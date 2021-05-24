import { DefaultButton, IconButton, Spinner, SpinnerSize, Text } from '@fluentui/react';
import React, { useContext } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { CONG_ID } from '../constants';
import { WeekProgram } from '../models/wol';
import { GlobalContext } from '../store/GlobalState';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link, useRouteMatch } from 'react-router-dom';
import ExportMenu from '../components/ExportMenu';

export default function Programs() {
    const { firestore, openModal, addProgram, isMobile } = useContext(GlobalContext)
    const [ weeksCollection, loading ] = useCollection(firestore.collection(`congregations/${CONG_ID}/weeks`).orderBy('date'));
    let { path } = useRouteMatch();
    return (
        <div className="container p-8">
            <div className="mb-2 flex justify-between items-center">
                <h1 className="font-semibold text-2xl inline-flex items-center"> <Icon iconName="ScheduleEventAction" className="mr-2"/>Programs</h1>
                <div className="inline-flex items-center my-2">
                    {
                        isMobile ? <IconButton 
                            onClick={() => {
                                addProgram()
                                openModal()
                            }}
                        iconProps={{ iconName: 'Add' }} /> :
                        <DefaultButton 
                        className="mr-2"
                            onClick={() => {
                                addProgram()
                                openModal()
                            } }
                        iconProps={{ iconName: 'Add' }} allowDisabledFocus>
                            Add Program
                        </DefaultButton> 
                    }
                <ExportMenu />
                </div>
               
            </div>
            {
                loading ? <Spinner className="pt-10" size={SpinnerSize.large} /> :
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4 mt-3">
                    <div>
                        <Text className="font-bold text-lg">Done</Text>
                        {
                            weeksCollection && weeksCollection.docs
                            .filter(doc => {
                                let week: WeekProgram = doc.data()
                                return week.isSent
                            })
                            .map(week => {
                                let _week : WeekProgram = week.data() 
                                return (
                                    <Link 
                                    to={`${path}/${week.id}`}
                                    key={week.id}
                                    className="px-4 py-3 rounded shadow bg-white text-black my-2 flex items-center hover:bg-gray-10 hover:bg-opacity-50 cursor-pointer">
                                        <Icon iconName="Calendar" className="mr-4"/>
                                        <div className="block">
                                            <span className="text-sm text-gray-400">Week Range</span> <br/>
                                            <span>{_week.range ?? ""}</span>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                    <div>
                        <Text className="font-bold text-lg">To Complete</Text>
                        {
                            weeksCollection && weeksCollection.docs
                            .filter(doc => {
                                let week: WeekProgram = doc.data()
                                return !week.isSent
                            })
                            .map(week => {
                                let _week : WeekProgram = week.data() 
                                return (
                                    <Link 
                                    to={`${path}/${week.id}`}
                                    key={week.id}
                                    className="px-4 py-3 rounded shadow bg-white text-black my-2 flex items-center hover:bg-gray-10 hover:bg-opacity-50 cursor-pointer">
                                        <Icon iconName="Calendar" className="mr-4"/>
                                        <div className="block">
                                            <span className="text-sm text-gray-400">Week Range</span> <br/>
                                            <span>{_week.range ?? ""}</span>
                                        </div>
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
