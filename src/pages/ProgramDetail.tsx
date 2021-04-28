import { ActionButton, Pivot, PivotItem, Spinner, SpinnerSize } from '@fluentui/react';
import React, { useContext, useEffect } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { useHistory, useParams } from 'react-router';
import { CONG_ID } from '../constants';
import { Part, WeekProgram } from '../models/wol';
import { GlobalContext } from '../store/GlobalState';
import WeekEndView from '../components/WeekEndView';
import MidWeekView from '../components/MidWeekView';
import SelectPublisherPanel from '../components/SelectPublisherPanel';

export default function ProgramDetail() {
    const { firestore } = useContext(GlobalContext)
    const { id } = useParams<{ id: string }>();
    const [documentSnapshot] = useDocument(firestore.doc(`congregations/${CONG_ID}/weeks/${id}`))
    const [collection, loading] = useCollection(firestore.collection(`congregations/${CONG_ID}/weeks/${id}/parts`).orderBy('index'));
    let history = useHistory();
    let document: WeekProgram = {
        ...documentSnapshot?.data()
    }

    useEffect(() => {

        return () => {

        }
    }, [])

    return (
        <div className="container mx-auto p-8">
            <div className="mb-2 flex justify-between items-center">
                <h1 className="font-bold text-2xl">
                    <ActionButton
                        className="font-bold text-base"
                        onClick={() => history.goBack()}
                        iconProps={{ iconName: 'ChromeBack' }} allowDisabledFocus>
                        Programs
                    </ActionButton> <br />
                    {document.range}
                </h1>
                <div className="inline-flex">
                    <ActionButton iconProps={{ iconName: 'DownloadDocument' }} allowDisabledFocus>
                        Download
                    </ActionButton>
                    <ActionButton
                        className="text-red-500"
                        iconProps={{ iconName: 'Delete', className: 'text-red-500 hover:text-red-900' }} allowDisabledFocus>
                        Delete
                    </ActionButton>
                </div>
            </div>
            {
                loading ? <Spinner className="pt-10" size={SpinnerSize.large} /> :
                    <div>
                        <Pivot>
                            <PivotItem headerText="Midweek">
                                <MidWeekView week={document} parts={collection?.docs.map<Part>(d => d.data()) ?? []} />
                            </PivotItem>
                            <PivotItem headerText="Weekend">
                                <WeekEndView week={document} parts={collection?.docs.map<Part>(d => d.data()) ?? []} />
                            </PivotItem>
                        </Pivot>
                      <SelectPublisherPanel />
                    </div>
            }
        </div>
    )
}
