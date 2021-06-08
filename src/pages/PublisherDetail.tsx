import { ActionButton, ChoiceGroup, DefaultButton, Dialog, DialogFooter, DialogType, Dropdown, IDropdownOption, Panel, PanelType, Persona, PersonaInitialsColor, PersonaSize, PrimaryButton,  Spinner, Text, TextField } from '@fluentui/react'
import React, { useContext, useState } from 'react'
import { GlobalContext } from '../store/GlobalState';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';

import { CONG_ID } from '../constants';
import { Gender, Privilege, Publisher, Talk } from '../models/publisher';
import { useHistory, useParams } from 'react-router';
import { useAlert } from 'react-alert';
import { useBoolean } from '@fluentui/react-hooks';
import { SharedColors } from '@fluentui/theme'
import SelectTalkOutlineView from '../components/SelectTalkOutlineView';
import TalkTile from '../components/TalkTile';
import { Group } from '../models/group';

export default function PublisherDetail() {

    const { firestore, auth, congregation } = useContext(GlobalContext);
    
    const { id } = useParams<{ id: string }>();
    let query = firestore.doc(`congregations/${CONG_ID}/publishers/${id}`)
    const [documentSnapshot, publisherLoading] = useDocument(query)
    const [talksCollection, talksCollectionLoading] = useCollection(firestore.collection(`congregations/${CONG_ID}/publishers/${id}/talks`))
    const groupCollectionQuery = firestore.collection(
        `congregations/${CONG_ID}/groups`
    ).orderBy('number'); 
    const [groupCollection, groupLoading] = useCollection(groupCollectionQuery);
    const [isEditing, setEditing] = useState(false)
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

    let history = useHistory();
    let alert = useAlert();
    let publisher: Publisher = documentSnapshot?.exists ? {
        ...documentSnapshot?.data()
    } : {}
    const [pub, setPublisher] = useState<Publisher>({
        firstName: publisher.firstName, 
        lastName: publisher.lastName, 
        email: publisher.email,
        groupId: publisher.groupId
    })
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    

    const invite = () => {
        let url: string = `https://assemblee.web.app/invite?cong=${congregation.id}&pub=${publisher.uid}`;
        if (publisher.email) {
            auth.sendSignInLinkToEmail(publisher.email, {
                url: url,
                handleCodeInApp: true
            })
                .then(() => alert.success(`Email sent to ${publisher?.firstName?.slice(0, 1).toUpperCase()}. ${publisher?.lastName?.toUpperCase()}`))
                .catch(error => alert.error(`Error: ${error}`))
        }
    }

    const deletePublisher = () => {
        query.delete()
        .then(() => toggleHideDialog())
        .then(() => history.goBack())
        .then(() => alert.success('Publisher deleted successfully'))
        .catch((error) => alert.error(`Error: ${error}`))
    }

    return (
        <div className="container mt-2 p-8">
            <div className="mb-2 flex flex-wrap justify-between items-center">
                <h1 className="font-bold text-2xl">
                    <ActionButton
                        className="font-bold text-base"
                        onClick={() => history.goBack()}
                        iconProps={{ iconName: 'ChromeBack' }} allowDisabledFocus>
                        Publishers
                    </ActionButton> <br />
                    {publisher.firstName} {publisher.lastName}
                </h1>
                <div className="inline-flex">
                    <ActionButton
                        disabled={publisher.isInvited}
                        onClick={invite}
                        iconProps={{ iconName: publisher.isInvited ? 'MailCheck' : 'Send' }} allowDisabledFocus>
                        {publisher.isInvited ? 'Invited' : 'Invite'}
                    </ActionButton>
                    <ActionButton
                        className="text-red-500"
                        onClick={toggleHideDialog}
                        iconProps={{ iconName: 'Delete', className: 'text-red-500 hover:text-red-900' }} allowDisabledFocus>
                        Delete
                    </ActionButton>
                </div>
            </div>
            {
                publisherLoading ? <Spinner title="Loading, please wait..." /> :
                    <>
                        <div className="bg-white shadow p-5 rounded">
                            {
                                documentSnapshot?.exists ? <Persona
                                    text={`${publisher.lastName} ${publisher.firstName}`}
                                    secondaryText={publisher.email}
                                    initialsColor={publisher.gender === Gender.brother ? PersonaInitialsColor.darkBlue : PersonaInitialsColor.pink}
                                    tertiaryText={publisher.privilege.toUpperCase()}
                                    imageUrl={publisher.photoURL}
                                    size={PersonaSize.size100}
                                    imageAlt={`${publisher.lastName} ${publisher.firstName}`}
                                /> : null
                            }
                        </div>
                        <div className="">
                            <TextField
                                disabled={!isEditing}
                                type="text"
                                onKeyUp={(e) => setPublisher({
                                    ...pub,
                                    firstName: e.currentTarget?.value,
                                })}
                                placeholder="Charles"
                                className="mt-4 md:w-full lg:w-1/4"
                                label="First Name"
                                defaultValue={publisher.firstName}
                            />
                            <TextField
                                disabled={!isEditing}
                                type="text"
                                onKeyUp={(e) => setPublisher({
                                    ...pub,
                                    lastName: e.currentTarget?.value,
                                })}
                                className="mt-4 md:w-full lg:w-1/4"
                                placeholder="Russel"
                                label="Last Name"
                                defaultValue={publisher.lastName}
                            />
                            <TextField
                                disabled={!isEditing}
                                type="email"
                                onKeyUp={(e) => setPublisher({
                                    ...pub,
                                    email: e.currentTarget?.value
                                })}
                                className="mt-4 md:w-full lg:w-1/4"
                                placeholder="charles.russel@jw.org"
                                label="Email"
                                defaultValue={publisher.email}
                            />
                            {
                                groupLoading ? <Spinner /> :
                                <Dropdown
                                    label="Group"
                                    className="mt-4 md:w-full lg:w-1/4"
                                    disabled={!isEditing}
                                    placeholder="Select Group"
                                    defaultSelectedKey={publisher.groupId}
                                    onChange={(e, option) => {
                                        setPublisher({
                                            ...pub,
                                            groupId: option?.id
                                        })
                                    }}
                                    options={groupCollection ? groupCollection.docs.map(doc => {   
                                    let group: Group = doc.data()
                                    let option: IDropdownOption = {
                                        id: group.id ?? '',
                                        key: group.id ?? '',
                                        text: group.name ?? ''
                                    }
                                    return option
                                }) : []}
                                />
                            }
                            
                            {
                                isEditing ? 
                                <div className="inline-flex items-center mt-4">
                                    <DefaultButton 
                                    className="mr-2"
                                    text='Cancel' onClick={() => setEditing(false)} />
                                    <DefaultButton
                                    onClick={() => {
                                        firestore.doc(`congregations/${CONG_ID}/publishers/${publisher.uid}`).update({
                                            firstName: pub && pub.firstName ? pub?.firstName : publisher.firstName,
                                            lastName: pub && pub.lastName ? pub?.lastName : publisher.lastName,
                                            email: pub && pub.email ? pub?.email : publisher.email,
                                            groupId: pub && pub.groupId ? pub.groupId : publisher.groupId
                                        }).then(() => setEditing(false))
                                    }}
                                     iconProps={{ iconName: 'Save' }} text='Save' />
                                </div>
                                 :
                                    <DefaultButton
                                        onClick={() => { setEditing(true) }}
                                        className="mt-4" iconProps={{ iconName: 'Edit' }} text='Edit' />
                            }

                        </div>
                        <div className="mt-4">
                            <ChoiceGroup
                                onChange={(e, option) => {
                                    firestore.doc(`congregations/${CONG_ID}/publishers/${publisher.uid}`).update({ privilege: option?.key })
                                }}
                                label="Privilege" defaultSelectedKey={publisher.privilege} options={[
                                    {
                                        key: Privilege.pub,
                                        text: 'Publisher',
                                    },
                                    {
                                        key: Privilege.ms,
                                        text: 'Servant',
                                        disabled: publisher.gender === Gender.sister
                                    },
                                    {
                                        key: Privilege.elder,
                                        text: 'Elder',
                                        disabled: publisher.gender === Gender.sister
                                    },
                                ]} />
                        </div>
                        {
                            talksCollectionLoading ? <Spinner title="Please wait..." /> :
                            talksCollection && (publisher.privilege === Privilege.elder || publisher.privilege === Privilege.ms)  ?
                                <div className="mt-4">
                                    <div className="flex justify-between items-center">
                                        <Text className="font-bold mt-6 text-xl">Talks</Text>
                                        <DefaultButton onClick={openPanel} iconProps={{ iconName: 'Add' }} text="Talk" />
                                    </div>
                                    {
                                        talksCollection.docs.map(doc => {
                                            let talk: Talk = {
                                                ...doc.data()
                                            }
                                            return (<TalkTile key={talk.id} talk={talk} />)
                                        })
                                    }
                                </div> : null
                        }
                    </>
            }
            <Dialog
                hidden={hideDialog}
                onDismiss={toggleHideDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Are You Sure?',
                    closeButtonAriaLabel: 'Close',
                    subText: 'This will remove all parts and information related to this publisher.',
                }}
            >
                <DialogFooter>
                    <PrimaryButton styles={{
                        root: { backgroundColor: SharedColors.red20, borderColor: SharedColors.red20 },
                        rootHovered: { backgroundColor: SharedColors.red10, borderColor: SharedColors.red10 }
                    }} onClick={deletePublisher} text="Yes, Delete" />
                    <DefaultButton onClick={toggleHideDialog} text="No" />

                </DialogFooter>
            </Dialog>
            <Panel
                isOpen={isOpen}
                onDismiss={dismissPanel}
                type={PanelType.extraLarge}
                headerText="Select Talk Outline"
            ><SelectTalkOutlineView publisher={publisher} onDismiss={dismissPanel} /></Panel>
        </div>
    )
}
