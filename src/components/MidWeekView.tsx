import { Stack } from '@fluentui/react'
import React, { useContext } from 'react'
import { Part, WeekProgram } from './../models/wol';
import { PartInfo } from './../components/MeetingView'
import { apply, chairmans, life, prayers, treasures } from '../shared/methods';
import PartAssigneeButton from './PartAssigneeButton';
import { GlobalContext } from '../store/GlobalState';
import PartRemoveButton from './PartRemoveButton';


export default function MidWeekView({ parts, week }: { parts: Part[], week: WeekProgram }) {
    const { openPanel, selectPublisher } = useContext(GlobalContext)
   
    return (
        <div>
            <Stack>
                <div className="p-10 rounded bg-white shadow my-4">
                    <h3 className="mt-0 text-xl font-semibold">Réunion de Semaine</h3>
                    <div className="mt-3 flex pl-4 flex-wrap justify-between items-center">
                        <label className="text-gray-400">Président</label>
                        {
                            chairmans(parts).length > 0 && chairmans(parts)[0].assignee ?
                            <PartRemoveButton 
                            action={() => {}}
                            part={chairmans(parts)[0]} 
                            publisher={chairmans(parts)[0].assignee ?? {}} /> :
                            <PartAssigneeButton text="Assignee" action={() => {
                                selectPublisher(week, chairmans(parts)[0], null)
                                openPanel()
                            }} />
                        }
                    </div>
                    <div className="mt-3 flex pl-4 flex-wrap justify-between items-center">
                        <label className="text-gray-400">Priere</label>
                        {
                            prayers(parts).length > 0 && prayers(parts)[0].assignee ?
                            <PartRemoveButton 
                            action={() => {}}
                            part={prayers(parts)[0]} 
                            publisher={prayers(parts)[0].assignee ?? {}} /> :
                            <PartAssigneeButton text="Assignee" action={() => {
                                selectPublisher(week, prayers(parts)[0], null)
                                openPanel()
                            }} />
                        }
                    </div>
                    <h4 className="my-3 font-semibold text-lg treasures">JOYAUX DE LA PAROLE DE DIEU</h4>
                    {
                        parts && treasures(parts).map(part => {
                            return (
                                <div className="mt-3 pl-4 flex flex-wrap justify-between items-center" key={part.id}>
                                    <label>{part.title}</label>
                                    {
                                        part && part.assignee ?
                                        <PartRemoveButton 
                                        action={() => {}}
                                        part={part} 
                                        publisher={part.assignee ?? {}} /> :
                                        <PartAssigneeButton text="Assignee" action={() => {
                                            selectPublisher(week, part, null)
                                            openPanel()
                                        }} />
                                    }
                                </div>
                            )
                        })
                    }

                    <h4 className="my-3 font-semibold text-lg apply">APPLIQUE-TOI AU MINISTÈRE</h4>
                    {
                        parts && apply(parts).map(part => {
                            return (
                                <div className="mt-3 pl-4 flex flex-wrap justify-between items-center" key={part.id}>
                                    <label className="w-2/3">{part.title}</label>
                                    <div className="inline-flex items-center my-1">
                                    {
                                        part && part.assignee ?
                                        <PartRemoveButton 
                                        action={() => {}}
                                        part={part} 
                                        publisher={part.assignee ?? {}} /> :
                                        <PartAssigneeButton text="Assignee" action={() => {
                                            selectPublisher(week, part, null)
                                            openPanel()
                                        }} />
                                    }
                                    <span className="text-gray-200 mx-1">-</span>
                                    {
                                        part && part.assistant ?
                                        <PartRemoveButton 
                                        action={() => {}}
                                        part={part} 
                                        publisher={part.assistant ?? {}} /> :
                                        <PartAssigneeButton text="Assistant" action={() => {
                                            selectPublisher(week, part, null)
                                            openPanel()
                                        }} />
                                    }
                                    </div>
                                </div>
                            )
                        })
                    }
                    <h4 className="my-3 font-semibold text-lg life">VIE CHRÉTIENNE</h4>

                    {
                        parts && life(parts).map(part => {
                            return (
                                <div className="mt-3 pl-4 flex flex-wrap justify-between items-center" key={part.id}>
                                    <label className="w-2/3">{part.title}</label> 
                                    {
                                        part && part.index != life(parts).length ?
                                        part.assignee ?
                                        <PartRemoveButton 
                                        action={() => {}}
                                        part={part} 
                                        publisher={part.assignee ?? {}} /> :
                                        <PartAssigneeButton text="Assignee" action={() => {
                                            selectPublisher(week, part, null)
                                            openPanel()
                                        }} /> : 
                                        <div className="inline-flex items-center my-1">
                                            {
                                                part.assignee ?
                                                <PartRemoveButton 
                                                action={() => {}}
                                                part={part} 
                                                publisher={part.assignee ?? {}} /> :
                                                <PartAssigneeButton text="Assignee" action={() => {
                                                    selectPublisher(week, part, null)
                                                    openPanel()
                                                }} />
                                            }
                                            <span className="text-gray-200 mx-1">-</span>
                                            {
                                                part && part.assistant ?
                                                <PartRemoveButton 
                                                action={() => {}}
                                                part={part} 
                                                publisher={part.assistant ?? {}} /> :
                                                <PartAssigneeButton text="Reader" action={() => {
                                                    selectPublisher(week, part, null)
                                                    openPanel()
                                                }} />
                                            }
                                        </div>
                                    }
                                    </div>
                            )
                        })
                    }
                    <div className="mt-3 pl-4 flex justify-between items-center">
                        <label className="text-gray-400">Priere</label>
                        <PartInfo part={prayers(parts)[1]} />
                    </div>
                </div>
            </Stack>
        </div>
    )
}
