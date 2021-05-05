import { ActionButton, ChoiceGroup, DefaultButton, Persona, PersonaInitialsColor, PersonaSize, Spinner, TextField } from '@fluentui/react'
import React, { useContext, useState } from 'react'
import { GlobalContext } from '../store/GlobalState';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';
import { CONG_ID } from '../constants';
import { Gender, Privilege, Publisher } from '../models/publisher';
import { useHistory, useParams } from 'react-router';
import SmallPartTile from '../components/SmallPartTile';
import { Part } from '../models/wol';


export default function PublisherDetail() {
    const { firestore } = useContext(GlobalContext);
    const { id } = useParams<{ id: string }>();
    const [documentSnapshot, publisherLoading] = useDocument(firestore.doc(`congregations/${CONG_ID}/publishers/${id}`))
    const [partsSnapshot, partsLoading] = useCollection(firestore.collection(`congregations/${CONG_ID}/publishers/${id}/parts`).orderBy('date'))
    const [ isEditing, setEditing ] = useState(false)

    let history = useHistory();
    let publisher: Publisher = documentSnapshot?.exists ? {
        ...documentSnapshot?.data()
    } : {}
    const [ name, setName ] = useState<{ firstName: string | undefined, lastName: string | undefined, email: string | undefined }>({
        firstName: publisher.firstName, lastName: publisher.lastName, email: publisher.email
    })
    return (
        <div className="container mx-auto mt-5 p-8">
            <div className="mb-2 flex justify-between items-center">
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
                        className="text-red-500"
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
                                    tertiaryText={publisher.privilege}
                                    imageUrl={publisher.photoURL}
                                    size={PersonaSize.size100}
                                    imageAlt={`${publisher.lastName} ${publisher.firstName}`}
                                /> : null
                            }

                        </div>
                        <div className="flex flex-wrap mt-4 w-full items-end">
                            <TextField
                                disabled={!isEditing}
                                type="text"
                                onKeyUp={(e) => setName({
                                    firstName: e.currentTarget?.value ,
                                    lastName: name?.lastName,
                                    email: name?.email 
                                })}
                                placeholder="Charles"
                                className="mr-4 flex-1 md:w-full"
                                label="First Name"
                                defaultValue={ isEditing ? name?.firstName : publisher.firstName}
                            />
                            <TextField
                                disabled={!isEditing}
                                type="text"
                                onKeyUp={(e) => setName({
                                    firstName: name?.firstName,
                                    lastName: e.currentTarget?.value,
                                    email: name?.lastName 
                                })}
                                className="mr-4 flex-1 md:w-full"
                                placeholder="Russel"
                                label="Last Name"
                                defaultValue={ isEditing ? name?.lastName : publisher.lastName}
                            />
                            <TextField
                                disabled={!isEditing}
                                type="email"
                                onKeyUp={(e) => setName({
                                    firstName: name?.firstName,
                                    lastName: name?.lastName,
                                    email: e.currentTarget?.value 
                                })}
                                className="flex-1 md:w-full"
                                placeholder="charles.russel@jw.org"
                                label="Email"
                                defaultValue={isEditing ? name?.email : publisher.email}
                            />
                            {
                                isEditing ? <DefaultButton 
                                onClick={() => {
                                    firestore.doc(`congregations/${CONG_ID}/publishers/${publisher.uid}`).update({
                                        firstName: name && name.firstName ? name?.firstName : publisher.firstName,
                                        lastName: name && name.lastName ? name?.lastName : publisher.lastName,
                                        email: name && name.email ? name?.email : publisher.email,
                                    }).then(() => setEditing(false))
                                }}
                                className="ml-2" iconProps={{ iconName: 'Save' }} text='Save' /> :
                                <DefaultButton 
                                onClick={() => {setEditing(true)}}
                                className="ml-2"  iconProps={{ iconName: 'Edit' }} text='Edit' />
                                }
                            
                        </div>
                        <div className="mt-4">
                            <ChoiceGroup 
                            onChange={(e, option) => {
                                firestore.doc(`congregations/${CONG_ID}/publishers/${publisher.uid}`).update({privilege: option?.key })
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
                            partsLoading ? <Spinner title="Please wait..." /> : 
                            <>
                            <h4 className="font-bold mt-6 text-lg">Parts</h4>
                            {
                                partsSnapshot?.docs.map(part => {
                                    let _part: Part = {
                                        ...part.data()
                                    }
                                    return (<SmallPartTile key={_part.id} part={_part} />)
                                })
                            }
                            </>
                        }
                    </>
            }
        </div>
    )
}
