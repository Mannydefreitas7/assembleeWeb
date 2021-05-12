import { DefaultButton, Persona, PersonaInitialsColor, Spinner, Text } from '@fluentui/react';
import React, { useContext } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { CONG_ID } from '../constants';
import { GlobalContext } from '../store/GlobalState';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link, useRouteMatch } from 'react-router-dom';
import { Privilege, Publisher, Speaker } from '../models/publisher';

export default function Speakers() {
    const { firestore, openSpeakerModal } = useContext(GlobalContext)
    const collectionQuery = firestore.collection(`congregations/${CONG_ID}/speakers`).orderBy('lastName')
    const brothersQuery = firestore.collection(`congregations/${CONG_ID}/publishers`)
    .where('privilege', 'in', [Privilege.elder, Privilege.ms])
    const [ speakersCollection, speakersCollectionLoading ] = useCollection(collectionQuery)
    const [brothersCollection, brothersCollectionLoading] = useCollection(brothersQuery)
    let { path } = useRouteMatch();
    return (
        <div className="container p-8">
            <div className="mb-2 flex justify-between items-center">
                <h1 className="font-semibold text-2xl inline-flex items-center"> <Icon iconName="PublishCourse" className="mr-2"/>Speakers</h1>
                <DefaultButton 
                onClick={openSpeakerModal}
                iconProps={{ iconName: 'AddFriend' }} allowDisabledFocus>
                    Add Speaker
                </DefaultButton>
            </div>
            {
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4 mt-3">
                    <div>
                    <Text className="font-bold text-lg">Local</Text>
                    {   
                        brothersCollectionLoading ? <Spinner /> :
                        brothersCollection && brothersCollection.docs
                        .map(data => {
                            let speaker : Publisher = data.data() 
                            return (
                                <Link 
                                to={`/admin/publishers/${speaker.uid}`}
                                key={speaker.uid}
                                className="px-4 py-3 bg-white rounded text-black my-2 flex items-center hover:bg-gray-10 hover:bg-opacity-50 cursor-pointer shadow">
                                    <Persona
                                        text={`${speaker.lastName} ${speaker.firstName}`}
                                        secondaryText={speaker.privilege?.toUpperCase()}
                                        tertiaryText={speaker.email}
                                        initialsColor={PersonaInitialsColor.darkBlue}
                                    />
                                </Link>
                            )
                        })
                    }
                    </div>
                    <div>
                    <Text className="font-bold text-lg">Outside</Text>
                    {
                        speakersCollectionLoading ? <Spinner /> :
                        speakersCollection && speakersCollection.docs
                        .map(data => {
                            let speaker : Speaker = data.data() 
                            return (
                                <Link 
                                to={`${path}/${speaker.id}`}
                                key={speaker.id}
                                className="px-4 py-3 bg-white rounded text-black my-2 flex items-center hover:bg-gray-10 hover:bg-opacity-50 cursor-pointer shadow">
                                    <Persona
                                        text={`${speaker.lastName} ${speaker.firstName}`}
                                        secondaryText={speaker.congregation?.properties?.orgName?.toUpperCase()}
                                        tertiaryText={speaker.email}
                                        initialsColor={PersonaInitialsColor.darkGreen}
                                    />
                                </Link>
                            )
                        })
                    }
                    </div>
                </div>
            }
        </div>
    )
}
