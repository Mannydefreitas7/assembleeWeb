import { DayOfWeek } from '@fluentui/date-time-utilities';
import {  Dropdown, Icon, IconButton, IDropdownOption, PrimaryButton, SharedColors, Spinner, Text, TextField } from '@fluentui/react'
import React, { useContext, useState } from 'react'
import { useAlert } from 'react-alert';
import { useCollection } from 'react-firebase-hooks/firestore';
import { v4 } from 'uuid';
import { FieldService } from '../models/fieldService';
import { GlobalContext } from '../store/GlobalState';

export default function Service() {
    const { firestore, congregation } = useContext(GlobalContext);
    const [firstDayOfWeek] = React.useState(DayOfWeek.Monday);
    const [service, setService] = useState<FieldService>({
        day: firstDayOfWeek
    });
    const serviceCollectionQuery = firestore.collection(`congregations/${congregation.id}/service`).orderBy('time');
    const [serviceCollection, serviceLoading] = useCollection(serviceCollectionQuery)
    const alert = useAlert();
    const days: IDropdownOption[] = [
        { text: 'Monday', key: DayOfWeek.Monday },
        { text: 'Tuesday', key: DayOfWeek.Tuesday },
        { text: 'Wednesday', key: DayOfWeek.Wednesday },
        { text: 'Thursday', key: DayOfWeek.Thursday },
        { text: 'Friday', key: DayOfWeek.Friday },
        { text: 'Saturday', key: DayOfWeek.Saturday },
        { text: 'Sunday', key: DayOfWeek.Sunday },
      ];

    const addMeeting = () => {
        let id = v4();
        if (service)
        firestore.doc(`congregations/${congregation.id}/service/${id}`).set({
            ...service,
            id
        })
        .then(() => alert.success('Field Service meeting added successfully!'))
        .catch((error) => alert.error(`Error: ${error}`))
    }   

    const deleteMeeting = (id: string) => {
        firestore.doc(`congregations/${congregation.id}/service/${id}`).delete()
        .then(() => alert.success('Field Service meeting deleted successfully!'))
        .catch((error) => alert.error(`Error: ${error}`))
    }

    return (
        <div className="container p-8">
        <div className="mb-2 flex justify-between items-center">
            <h1 className="font-semibold text-2xl inline-flex items-center">
                <Icon iconName="TimeEntry" className="mr-2" /> Field Service
            </h1>

        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 my-4 gap-4">
            <div>
                    <Dropdown
                        label="Select day of the week"
                        options={days}
                        selectedKey={firstDayOfWeek}
                        onChange={(event, option) => setService({
                            ...service,
                            day: Number(option?.key ?? 0)
                        })}
                    />
                    <TextField
                        placeholder="9h30"
                        label="Time"
                        onChange={(event, value) => setService({
                            ...service, 
                            time: value
                        })}
                    />
                    <TextField
                        placeholder="Kingdom Hall"
                        label="Details"
                        onChange={(event, value) => setService({
                            ...service, 
                            details: value
                        })}
                    />
                    <PrimaryButton 
                        className="my-4"
                        text="Add Meeting" 
                        onClick={addMeeting}
                    />
            </div>
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
                                                <IconButton 
                                                onClick={() => {
                                                    if (service && service.id) {
                                                        deleteMeeting(service.id)
                                                    }
                                                }}
                                                iconProps={{ iconName: 'Trash', styles: { root: { color: SharedColors.red10 } } }} />
                                            </div> : null
                                        }
                                        </div>
                                    })
                                }
                            </div>
                        })
                    }
            </div>
        </div>
    )
}
