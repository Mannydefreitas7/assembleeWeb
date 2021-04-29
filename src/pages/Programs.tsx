import { ActionButton, Spinner, SpinnerSize } from '@fluentui/react';
import React, { useContext } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { CONG_ID } from '../constants';
import { WeekProgram } from '../models/wol';
import { GlobalContext } from '../store/GlobalState';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link, useRouteMatch } from 'react-router-dom';

export default function Programs() {
    const { firestore, openModal, addProgram } = useContext(GlobalContext)
    const [ value, loading ] = useCollection(firestore.collection(`congregations/${CONG_ID}/weeks`).orderBy('date'))
    let { path } = useRouteMatch();
    return (
        <div className="container mx-auto p-8">
            <div className="mb-2 flex justify-between items-center">
                <h1 className="font-semibold text-2xl inline-flex items-center"> <Icon iconName="ScheduleEventAction" className="mr-2"/>Programs</h1>
                <ActionButton 
                onClick={() => {
                    addProgram()
                    openModal()
                } }
                iconProps={{ iconName: 'Add' }} allowDisabledFocus>
                    Add Program
                </ActionButton>
            </div>
            {
                loading ? <Spinner className="pt-10" size={SpinnerSize.large} /> :
                value?.docs.map(week => {
                    let _week : WeekProgram = week.data() 
                    return (
                        <Link 
                        to={`${path}/${week.id}`}
                        key={week.id}
                        className="px-4 py-3 bg-white text-black my-2 flex items-center hover:bg-gray-10 hover:bg-opacity-50 cursor-pointer">
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
    )
}
