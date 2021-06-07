import { Persona, PersonaInitialsColor, PersonaSize, Spinner, Text } from '@fluentui/react';
import React, { useContext } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { CONG_ID } from '../constants';
import { Group } from '../models/group';
import { Gender, Publisher } from '../models/publisher';
import { GlobalContext } from '../store/GlobalState';

export default function GroupView() {
    const { firestore } = useContext(GlobalContext);
    const groupCollectionQuery = firestore.collection(
        `congregations/${CONG_ID}/groups`
    ).orderBy('number');
    const publishersCollectionQuery = firestore.collection(
        `congregations/${CONG_ID}/publishers`
    ).orderBy('lastName');
    const [groupCollection, groupLoading] = useCollection(groupCollectionQuery);
    const [publishersCollection, publishersCollectionLoading] = useCollection(
        publishersCollectionQuery
    );
    return (
        <div className={`w-full grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 auto-rows-min gap-4 mt-4 bg-gray-50 rounded`}>
            {
                groupLoading ? <Spinner /> :
                groupCollection && groupCollection.docs.map((doc, ind) => {
                    let group: Group = doc.data();
                    return <div 
                    key={group.id}
                    className={`bg-white rounded px-3 py-2 w-full shadow dark:border-gray-700`}>
                     <div className="flex justify-between">
                        <div className="p-1 mb-4">
                            <Text className="font-bold text-lg block">{group.name}</Text>
                            <Text className="text-sm block text-gray-600 font-semibold">{group.address}</Text>
                            <Text className="text-sm text-gray-600">{group.description}</Text>
                        </div>
                        </div>
                            {
                                publishersCollectionLoading ? <Spinner /> :
                                publishersCollection && publishersCollection.docs
                                .filter(doc => {
                                    let publisher: Publisher = doc.data();
                                    return publisher.groupId === group.id
                                })
                                .map((doc, index) => {
                                    let publisher: Publisher = doc.data();
                                    return <Persona
                                            key={index}
                                            className="my-1"
                                            initialsColor={
                                                publisher.gender === Gender.brother
                                                    ? PersonaInitialsColor.darkBlue
                                                    : PersonaInitialsColor.pink
                                            }
                                            text={`${publisher.lastName} ${publisher.firstName}`}
                                            size={PersonaSize.size24}
                                            secondaryText={publisher.privilege}
                                            />
                                })
                            }
                    </div>
                })
            }
        </div>
    )
}
