import { Dropdown, Stack } from '@fluentui/react'
import React, { useContext } from 'react'
import { Part, PartType, WeekProgram } from './../models/wol';
import { chairmans, prayers, talk, wt } from '../shared/methods';
import PartRemoveButton from './PartRemoveButton';
import PartAssigneeButton from './PartAssigneeButton';
import { GlobalContext } from '../store/GlobalState';
import PartContextMenu from './PartContextMenu';

export default function WeekEndView({ parts, week }: { parts: Part[], week: WeekProgram }) {
    const { openPanel, selectPublisher, talks, firestore, congregation } = useContext(GlobalContext);

    const selectTalk = async (part: Part, title: string) => {
        try {
            let doc = firestore.doc(`congregations/${congregation.id}/weeks/${week.id}/parts/${part.id}`);
            doc.update({ title: title })
        } catch (error) { console.log(error) }
    }
    return (
        <div>
            <Stack>
                <div className="p-10 rounded bg-white shadow mt-4">
                    <h3 className="mt-0 text-xl font-semibold">Réunion Publique</h3>
                    <div className="mt-3 ps-4 flex justify-between items-center">
                        <label className="text-gray-400">Président</label>
                        <div className="inline-flex items-center">
                        {
                            chairmans(parts).length > 1 && chairmans(parts)[1].assignee ?
                            <PartRemoveButton 
                            action={() => {
                                selectPublisher(week, chairmans(parts)[1], PartType.assignee, chairmans(parts)[1].assignee)
                                openPanel()
                            }}
                            part={chairmans(parts)[1]} 
                            publisher={chairmans(parts)[1].assignee ?? {}} /> :
                            <PartAssigneeButton text="Assignee" action={() => {
                                selectPublisher(week, chairmans(parts)[1], PartType.assignee, null)
                                openPanel()
                            }} />
                        }
                        {
                            chairmans(parts) && chairmans(parts).length > 1 ? 
                            <PartContextMenu part={chairmans(parts)[1]} /> : null
                        }
                        </div>
                    </div>
                    <h4 className="my-3 fw-bold weekend">DISCOURS PUBLIC</h4>
                    <div className="mt-3 ps-4 d-flex flex flex-wrap justify-between items-center">
                        {
                            talk(parts).length > 0 && talk(parts)[0] ?
                            talk(parts)[0].title ? <label className="">{talk(parts)[0].title ?? ''}</label> :
                            <Dropdown 
                                disabled={!talk(parts)[0].assignee}
                                style={{ minWidth: 350 }}
                                defaultValue={talk(parts)[0].title}
                                onChange={(e, option) => {
                                    console.log(option)
                                    if (option) {
                                        selectTalk(talk(parts)[0], option.text)
                                    }
                                }}
                                placeholder="Select Talk Outline"
                                options={talks ? talks : []}
                             /> : null
                        }
                        <div className="inline-flex items-center">
                        {
                            talk(parts).length > 0 && talk(parts)[0].assignee ?
                            <PartRemoveButton 
                            action={() => {
                                selectPublisher(week, talk(parts)[0], PartType.assignee, talk(parts)[0].assignee)
                                openPanel()
                            }}
                            part={talk(parts)[0]} 
                            publisher={talk(parts)[0].assignee ?? {}} /> :
                            <PartAssigneeButton text="Speaker" action={() => {
                                selectPublisher(week, talk(parts)[0], PartType.assignee,  null)
                                openPanel()
                            }} />
                        }
                        {
                            talk(parts) && talk(parts).length > 0 ? 
                            <PartContextMenu part={talk(parts)[0]} /> : null
                        }
                        </div>
                    </div>
                    <h4 className="my-3 fw-bold weekend">ÉTUDE DE LA TOUR DE GARDE</h4>
                    <div className="mt-3 ps-4 d-flex flex flex-wrap justify-between items-center">
                        <label className="">{wt(parts)[0]?.subTitle ?? ''}</label>
                         <div className="inline-flex items-center my-1">
                            {
                                wt(parts).length > 0 && wt(parts)[0].assignee  ?
                                <PartRemoveButton 
                                action={() => {
                                    selectPublisher(week, wt(parts)[0], PartType.assignee, wt(parts)[0].assignee)
                                    openPanel()
                                }}
                                part={wt(parts)[0]} 
                                publisher={wt(parts)[0].assignee ?? {}} /> :
                                <PartAssigneeButton text="Conductor" action={() => {
                                    selectPublisher(week, wt(parts)[0], PartType.assignee, null)
                                    openPanel()
                                }} />
                            }
                            <span className="text-gray-200 mx-1">-</span>
                            {
                                wt(parts)[0] && wt(parts)[0].assistant ?
                                <PartRemoveButton 
                                action={() => {
                                    selectPublisher(week, wt(parts)[0], PartType.assistant, wt(parts)[0].assistant)
                                    openPanel()
                                }}
                                part={wt(parts)[0]} 
                                publisher={wt(parts)[0].assistant ?? {}} /> :
                                <PartAssigneeButton text="Reader" action={() => {
                                    selectPublisher(week, wt(parts)[0], PartType.assistant, null)
                                    openPanel()
                                }} />
                            }
                            {
                                wt(parts) && wt(parts).length > 0 ? 
                                <PartContextMenu part={wt(parts)[0]} /> : null
                            }
                        </div>
                    </div>
                    <div className="mt-3 ps-4 flex justify-between items-center">
                        <label className="col-sm-12 col-md-6 col-lg-6 text-gray-400">Priere</label>
                        <div className="inline-flex items-center my-1">
                        {
                            prayers(parts).length > 3 && prayers(parts)[3].assignee ?
                            <PartRemoveButton 
                            action={() => {
                                selectPublisher(week, prayers(parts)[3], PartType.assignee, prayers(parts)[3].assignee)
                                openPanel()
                            }}
                            part={prayers(parts)[3]} 
                            publisher={prayers(parts)[3].assignee ?? {}} /> :
                            <PartAssigneeButton text="Assignee" action={() => {
                                selectPublisher(week, prayers(parts)[3], PartType.assignee, null)
                                openPanel()
                            }} />
                        }
                        {
                            prayers(parts) && prayers(parts).length > 3 ? 
                            <PartContextMenu part={prayers(parts)[3]} /> : null
                        }
                        </div>
                    </div>
                </div>
            </Stack>
        </div>
    )
}
