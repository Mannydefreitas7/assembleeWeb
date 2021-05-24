import { ActionButton, DefaultButton, Dialog, DialogFooter, DialogType, Panel, PanelType, Persona, PersonaInitialsColor, PersonaSize, PrimaryButton,  Spinner, Text, TextField } from '@fluentui/react'
import React, { useContext, useState } from 'react'
import { GlobalContext } from '../store/GlobalState';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';
import { CONG_ID } from '../constants';
import { Speaker, Talk } from '../models/publisher';
import { useHistory, useParams } from 'react-router';
import { useAlert } from 'react-alert';
import { useBoolean } from '@fluentui/react-hooks';
import { SharedColors } from '@fluentui/theme'
import SelectTalkOutlineView from '../components/SelectTalkOutlineView';
import TalkTile from '../components/TalkTile';

export default function SpeakerDetail() {
    const { firestore } = useContext(GlobalContext);
    const { id } = useParams<{ id: string }>();
    let query = firestore.doc(`congregations/${CONG_ID}/speakers/${id}`)
    const [documentSnapshot, speakerLoading] = useDocument(query)
    const [talksCollection, talksCollectionLoading] = useCollection(firestore.collection(`congregations/${CONG_ID}/speakers/${id}/talks`))
    const [isEditing, setEditing] = useState(false)
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

    let history = useHistory();
    let alert = useAlert();
    let speaker: Speaker = documentSnapshot?.exists ? {
        ...documentSnapshot?.data()
    } : {}
    const [speakerState, setSpeakerState] = useState<Speaker>(speaker)
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);

    const deleteSpeaker = () => {
        query.delete()
        .then(() => toggleHideDialog())
        .then(() => history.goBack())
        .then(() => alert.success('Speaker deleted successfully'))
        .catch((error) => alert.error(`Error: ${error}`))
    }

    return (
        <div className="container mt-2 p-8">
            <div className="mb-2 flex justify-between items-center">
                <h1 className="font-bold text-2xl">
                    <ActionButton
                        className="font-bold text-base"
                        onClick={() => history.goBack()}
                        iconProps={{ iconName: 'ChromeBack' }} allowDisabledFocus>
                        Speakers
                    </ActionButton> <br />
                    {speaker.firstName} {speaker.lastName}
                </h1>
                <div className="inline-flex">
                    <ActionButton
                        className="text-red-500"
                        onClick={toggleHideDialog}
                        iconProps={{ iconName: 'Delete', className: 'text-red-500 hover:text-red-900' }} allowDisabledFocus>
                        Delete
                    </ActionButton>
                </div>
            </div>
            {
                speakerLoading ? <Spinner title="Loading, please wait..." /> :
                    <>
                        <div className="bg-white shadow p-5 rounded">
                            {
                                documentSnapshot?.exists ? <Persona
                                    text={`${speaker.lastName} ${speaker.firstName}`}
                                    secondaryText={speaker.email}
                                    initialsColor={PersonaInitialsColor.darkBlue}
                                    tertiaryText={speaker.congregation?.properties?.orgName?.toUpperCase()}
                                    size={PersonaSize.size100}
                                /> : null
                            }
                        </div>
                        <div className="">
                            <TextField
                                disabled={!isEditing}
                                type="text"
                                onKeyUp={(e) => setSpeakerState({
                                    ...speaker,
                                    firstName: e.currentTarget?.value
                                })}
                                placeholder="Charles"
                                className="mt-4 md:w-full lg:w-1/4"
                                label="First Name"
                                defaultValue={isEditing ? speakerState?.firstName : speaker.firstName}
                            />
                            <TextField
                                disabled={!isEditing}
                                type="text"
                                onKeyUp={(e) => setSpeakerState({
                                    firstName: speakerState?.firstName,
                                    lastName: e.currentTarget?.value,
                                    email: speakerState?.lastName
                                })}
                                className="mt-4 md:w-full lg:w-1/4"
                                placeholder="Russel"
                                label="Last Name"
                                defaultValue={isEditing ? speakerState?.lastName : speaker.lastName}
                            />
                            <TextField
                                disabled={!isEditing}
                                type="email"
                                onKeyUp={(e) => setSpeakerState({
                                    ...speaker,
                                    email: e.currentTarget?.value
                                })}
                                className="mt-4 md:w-full lg:w-1/4"
                                placeholder="charles.russel@jw.org"
                                label="Email"
                                defaultValue={isEditing ? speakerState?.email : speaker.email}
                            />
                             <TextField
                                disabled={!isEditing}
                                type="text"
                                onKeyUp={(e) => setSpeakerState({
                                    ...speaker,
                                    congregation: {
                                        properties: {
                                            ...speaker?.congregation?.properties,
                                            orgName: e.currentTarget?.value
                                        }
                                    }
                                })}
                                className="mt-4 md:w-full lg:w-1/4"
                                placeholder="Long Meadow English"
                                label="Congregation Name"
                                defaultValue={isEditing ? speakerState?.congregation?.properties?.orgName : speaker.congregation?.properties?.orgName}
                            />
                                                         <TextField
                                disabled={!isEditing}
                                type="text"
                                onKeyUp={(e) => setSpeakerState({
                                    ...speaker,
                                    congregation: {
                                        properties: {
                                            ...speaker?.congregation?.properties,
                                            address: e.currentTarget?.value
                                        }
                                    }
                                })}
                                className="mt-4 md:w-full lg:w-1/4"
                                placeholder="Kings Drive"
                                label="Congregation Address"
                                defaultValue={isEditing ? speakerState?.congregation?.properties?.address : speaker.congregation?.properties?.address}
                            />
                            {
                                isEditing ? <DefaultButton
                                    onClick={() => {
                                        firestore.doc(`congregations/${CONG_ID}/speakers/${speaker.id}`)
                                        .update(speakerState).then(() => setEditing(false))
                                    }}
                                    className="mt-4" iconProps={{ iconName: 'Save' }} text='Save' /> :
                                    <DefaultButton
                                        onClick={() => { setEditing(true) }}
                                        className="mt-4" iconProps={{ iconName: 'Edit' }} text='Edit' />
                            }

                        </div>
                        {
                            talksCollectionLoading ? <Spinner title="Please wait..." /> :
                            talksCollection ?
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
                    subText: 'This will remove all parts and information related to this Speaker.',
                }}
            >
                <DialogFooter>
                    <PrimaryButton styles={{
                        root: { backgroundColor: SharedColors.red20, borderColor: SharedColors.red20 },
                        rootHovered: { backgroundColor: SharedColors.red10, borderColor: SharedColors.red10 }
                    }} onClick={deleteSpeaker} text="Yes, Delete" />
                    <DefaultButton onClick={toggleHideDialog} text="No" />

                </DialogFooter>
            </Dialog>
            <Panel
                isOpen={isOpen}
                onDismiss={dismissPanel}
                type={PanelType.extraLarge}
                headerText="Select Talk Outline"
            ><SelectTalkOutlineView speaker={speaker} onDismiss={dismissPanel} /></Panel>
        </div>
    )
}
