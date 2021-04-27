import { Stack } from '@fluentui/react'
import React from 'react'
import { Part } from './../models/wol';
import { PartInfo } from './../components/MeetingView'
import { chairmans, talk, wt } from '../shared/methods';

export default function WeekEndView({ parts }: { parts: Part[] }) {

    return (
        <div>
            <Stack>
                <div className="p-10 rounded bg-white shadow mt-4">
                    <h3 className="mt-0 text-xl font-semibold">Réunion Publique</h3>
                    <div className="mt-3 ps-4 flex justify-between items-center">
                        <label className="text-gray-400">Président</label>
                        <PartInfo part={chairmans(parts)[1]} />
                    </div>
                    <h4 className="my-3 fw-bold weekend">DISCOURS PUBLIC</h4>
                    <div className="mt-3 ps-4 d-flex flex flex-wrap justify-between items-center">
                        <label className="">{talk(parts)[0].title}</label>
                        <PartInfo part={talk(parts)[0]} />
                    </div>
                    <h4 className="my-3 fw-bold weekend">ÉTUDE DE LA TOUR DE GARDE</h4>
                    <div className="mt-3 ps-4 d-flex flex flex-wrap justify-between items-center">
                        <label className="">{wt(parts)[0].title}</label>
                        <PartInfo part={wt(parts)[0]} />
                    </div>
                    <div className="mt-3 ps-4 flex justify-between items-center">
                        <label className="col-sm-12 col-md-6 col-lg-6 text-gray-400">Priere</label>
                    </div>
                </div>
            </Stack>
        </div>
    )
}
