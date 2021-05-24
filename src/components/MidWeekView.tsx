import { Stack } from '@fluentui/react'
import React, { useContext } from 'react'
import { Part, PartType, WeekProgram } from './../models/wol';
import { apply, chairmans, life, prayers, treasures } from '../shared/methods';
import PartAssigneeButton from './PartAssigneeButton';
import { GlobalContext } from '../store/GlobalState';
import PartRemoveButton from './PartRemoveButton';
import PartContextMenu from './PartContextMenu';


export default function MidWeekView({ parts, week }: { parts: Part[], week: WeekProgram }) {

    const { openPanel, selectPublisher, isMobile } = useContext(GlobalContext)
    return (
        <div>
            <Stack>
                <div className={`${isMobile ? 'p-4' : 'p-10'} rounded bg-white shadow my-4`}>
                    <h3 className="mt-0 text-xl font-semibold">Réunion de Semaine</h3>
                    <div className="mt-3 flex pl-4 flex-wrap justify-between items-center">
                        <label className="text-gray-400">Président</label>
                        <div className="inline-flex items-center my-2">
                            {
                                chairmans(parts).length > 0 && chairmans(parts)[0].assignee ?
                                    <PartRemoveButton
                                        action={() => {
                                            selectPublisher(week, chairmans(parts)[0], PartType.assignee, chairmans(parts)[0].assignee)
                                            openPanel()
                                        }}
                                        part={chairmans(parts)[0]}
                                        publisher={chairmans(parts)[0].assignee ?? {}} /> :
                                    <PartAssigneeButton text="Assignee" action={() => {
                                        selectPublisher(week, chairmans(parts)[0], PartType.assignee, null)
                                        openPanel()
                                    }} />
                            }
                            {
                                chairmans(parts) && chairmans(parts).length > 0 ? 
                                <PartContextMenu part={chairmans(parts)[0]} /> : null
                            }
                        </div>
                    </div>
                    <div className="mt-3 flex pl-4 flex-wrap justify-between items-center">
                        <label className="text-gray-400">Priere</label>
                        <div className="inline-flex items-center my-2">
                        {
                            prayers(parts).length > 0 && prayers(parts)[0].assignee ?
                                <PartRemoveButton
                                    action={() => {
                                        selectPublisher(week, prayers(parts)[0], PartType.assignee, prayers(parts)[0].assignee)
                                        openPanel()
                                    }}
                                    part={prayers(parts)[0]}
                                    publisher={prayers(parts)[0].assignee ?? {}} /> :
                                <PartAssigneeButton text="Assignee" action={() => {
                                    selectPublisher(week, prayers(parts)[0], PartType.assignee, null)
                                    openPanel()
                                }} />
                        }
                        {
                            prayers(parts) && prayers(parts).length > 0 ? 
                            <PartContextMenu part={prayers(parts)[0]} /> : null
                        }
                        </div>
                    </div>
                    <h4 className="my-3 font-semibold text-lg treasures">JOYAUX DE LA PAROLE DE DIEU</h4>
                    {
                        parts && treasures(parts).map(part => {
                            return (
                                <div className="mt-3 pl-4 flex flex-wrap justify-between items-center" key={part.id}>
                                    <label className={isMobile ? 'text-xs' : ''}>{part.title}</label>
                                    <div className="inline-flex items-center my-2">
                                    {
                                        part && part.assignee ?
                                            <PartRemoveButton
                                                action={() => {
                                                    selectPublisher(week, part, PartType.assignee, part.assignee)
                                                    openPanel()
                                                }}
                                                part={part}
                                                publisher={part.assignee ?? {}} /> :
                                            <PartAssigneeButton text="Assignee" action={() => {
                                                selectPublisher(week, part, PartType.assignee, null)
                                                openPanel()
                                            }} />
                                    }
                                    {
                                        part ? <PartContextMenu part={part} /> : null
                                    }
                                    </div>

                                </div>
                            )
                        })
                    }

                    <h4 className="my-3 font-semibold text-lg apply">APPLIQUE-TOI AU MINISTÈRE</h4>
                    {
                        parts && apply(parts).map(part => {
                            return (
                                <div className="mt-3 pl-4 flex flex-wrap justify-between items-center" key={part.id}>
                                    <label className={isMobile ? 'text-xs' : 'w-2/3'}>{part.title}</label>
                                    <div className="inline-flex flex-wrap items-center my-2">
                                        {
                                            part && part.assignee ?
                                                <PartRemoveButton
                                                    action={() => {
                                                        selectPublisher(week, part, PartType.assignee, part.assignee)
                                                        openPanel()
                                                    }}
                                                    part={part}
                                                    publisher={part.assignee ?? {}} /> :
                                                <PartAssigneeButton text="Assignee" action={() => {
                                                    selectPublisher(week, part, PartType.assignee, null)
                                                    openPanel()
                                                }} />
                                        }
                                        <span className="text-gray-200 mx-1">-</span>
                                        {
                                            part && part.assistant ?
                                                <PartRemoveButton
                                                    action={() => {
                                                        selectPublisher(week, part, PartType.assistant, part.assistant)
                                                        openPanel()
                                                    }}
                                                    part={part}
                                                    publisher={part.assistant ?? {}} /> :
                                                <PartAssigneeButton text="Assistant" action={() => {
                                                    selectPublisher(week, part, PartType.assistant, null)
                                                    openPanel()
                                                }} />
                                        }
                                        {
                                            part ? <PartContextMenu part={part} /> : null
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
                                    <label className={isMobile ? 'text-xs' : 'w-2/3'}>{part.title}</label>
                                    <div className="inline-flex items-center my-2">
                                    {
                                        part && part.index !== life(parts).length ?
                                            part.assignee ?
                                                <PartRemoveButton
                                                    action={() => {
                                                        selectPublisher(week, part, PartType.assignee, part.assignee)
                                                        openPanel()
                                                    }}
                                                    part={part}
                                                    publisher={part.assignee ?? {}} /> :
                                                <PartAssigneeButton text="Assignee" action={() => {
                                                    selectPublisher(week, part, PartType.assignee, null)
                                                    openPanel()
                                                }} /> :   
                                        <>
                                            {  
                                                part.assignee ?
                                                    <PartRemoveButton
                                                        action={() => {
                                                            selectPublisher(week, part, PartType.assignee, part.assignee)
                                                            openPanel()
                                                        }}
                                                        part={part}
                                                        publisher={part.assignee ?? {}} /> :
                                                    <PartAssigneeButton text="Assignee" action={() => {
                                                        selectPublisher(week, part, PartType.assignee, null)
                                                        openPanel()
                                                    }} />
                                            }
                                                <span className="text-gray-200 mx-1">-</span>
                                            {
                                                part && part.assistant ?
                                                    <PartRemoveButton
                                                        action={() => {
                                                            selectPublisher(week, part, PartType.assistant, part.assistant)
                                                            openPanel()
                                                        }}
                                                        part={part}
                                                        publisher={part.assistant ?? {}} /> :
                                                    <PartAssigneeButton text="Reader" action={() => {
                                                        selectPublisher(week, part, PartType.assistant, null)
                                                        openPanel()
                                                    }} />
                                            }
                                        </>
                                    }
                                    {
                                        part ? <PartContextMenu part={part} /> : null
                                    }
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="mt-3 pl-4 flex justify-between items-center">
                        <label className="text-gray-400">Priere</label>
                        <div className="inline-flex items-center my-2">
                        {
                            prayers(parts).length > 1 && prayers(parts)[1].assignee ?
                                <PartRemoveButton
                                    action={() => {
                                        selectPublisher(week, prayers(parts)[1], PartType.assignee, prayers(parts)[1].assignee)
                                        openPanel()
                                    }}
                                    part={prayers(parts)[1]}
                                    publisher={prayers(parts)[1].assignee ?? {}} /> :
                                <PartAssigneeButton text="Assignee" action={() => {
                                    selectPublisher(week, prayers(parts)[1], PartType.assignee, null)
                                    openPanel()
                                }} />
                        }
                        {
                            prayers(parts) && prayers(parts).length > 1 ? 
                            <PartContextMenu part={prayers(parts)[1]} /> : null
                        }
                        </div>
                    </div>
                </div>
            </Stack>
        </div>
    )
}
