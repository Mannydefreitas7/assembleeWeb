import { DayOfWeek } from '@fluentui/date-time-utilities';
import { IDropdownOption, Spinner, Text } from '@fluentui/react';
import React, { useContext } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { FieldService } from '../models/fieldService';
import { GlobalContext } from '../store/GlobalState'

export default function ServiceMeetingView() {

    const { firestore, congregation } = useContext(GlobalContext);
    const serviceCollectionQuery = firestore.collection(`congregations/${congregation.id}/service`).orderBy('time');
    const [serviceCollection, serviceLoading] = useCollection(serviceCollectionQuery);
    const days: IDropdownOption[] = [
        { text: 'Lundi', key: DayOfWeek.Monday },
        { text: 'Mardi', key: DayOfWeek.Tuesday },
        { text: 'Mercredi', key: DayOfWeek.Wednesday },
        { text: 'Jeudi', key: DayOfWeek.Thursday },
        { text: 'Vendredi', key: DayOfWeek.Friday },
        { text: 'Samedi', key: DayOfWeek.Saturday },
        { text: 'Dimanche', key: DayOfWeek.Sunday },
      ];

    return (
        <div className="mt-4 grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4">
                       {
                    days && days.map(day=> {
                        return <div key={day.key} className="bg-white px-4 pt-2 pb-4 rounded shadow">
                                <Text className="font-bold text-xl">{day.text}</Text>
                                {
                                    serviceLoading ? <Spinner /> :
                                    serviceCollection && serviceCollection.docs
                                    .map(doc => {
                                        let service: FieldService = doc.data();
                                        return service;
                                    })
                                    .map(service => {
                                        return <div key={service.id}>
                                        {
                                            service.day === day.key ? 
                                            <div className="p-3 my-2 border-l-2 border-green-700 bg-gray-50 flex items-center justify-between">
                                                <div>
                                                    <Text className="text-gray-600">{service.details}</Text> <br />
                                                    <Text className="font-bold text-lg">{service.time}</Text>
                                                </div>
                                            </div> : null
                                        }
                                        </div>
                                    })
                                }
                            </div>
                        })
                    }
        </div>
    )
}
