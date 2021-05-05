import { ActionButton, Pivot, PivotItem, Spinner, SpinnerSize, Toggle } from '@fluentui/react';
import React, { useContext, useState } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { useHistory, useParams } from 'react-router';
import { CONG_ID } from '../constants';
import { Part, WeekProgram } from '../models/wol';
import { GlobalContext } from '../store/GlobalState';
import WeekEndView from '../components/WeekEndView';
import MidWeekView from '../components/MidWeekView';
import SelectPublisherPanel from '../components/SelectPublisherPanel';
import { ExportService } from '../services/export';


export default function ProgramDetail() {
    const { firestore, congregation, reloadWeeks } = useContext(GlobalContext)
    const { id } = useParams<{ id: string }>();
    const [documentSnapshot, weekLoading] = useDocument(firestore.doc(`congregations/${CONG_ID}/weeks/${id}`))
    const [collection, loading] = useCollection(firestore.collection(`congregations/${CONG_ID}/weeks/${id}/parts`).orderBy('index'));
    let history = useHistory();
    
    const [isDownloading, setIsDownloading] = useState(false)
    let document: WeekProgram = {
        ...documentSnapshot?.data()
    }
    const [isChecked, setIsChecked] = useState<boolean>(document.isSent ?? false)
    const exportService = new ExportService()
   
    const deleteProgram = () => {
        collection?.docs.forEach(async doc => await doc.ref.delete())
        documentSnapshot?.ref.delete()
        .then(() => history.goBack())
    }

    function _onChange(ev: React.MouseEvent<HTMLElement>, checked?: boolean) {
       
        firestore.doc(`congregations/${CONG_ID}/weeks/${id}`).update({ isSent: checked })
        .then(() => reloadWeeks())
        setIsChecked(checked!)
    }

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
                <div className="flex items-center">
                    {
                        weekLoading ? <Spinner /> : 
                        <Toggle 
                            defaultChecked={document.isSent}
                            className="mb-0" 
                            label="Pin on Board?" 
                            inlineLabel 
                            onText="Yes" 
                            offText="No" 
                            onChange={_onChange} />
                    }
                    {
                        isDownloading ?
                        <Spinner label="Downloading..." labelPosition={'right'} /> :
                        <ActionButton 
                        onClick={() => {
                            setIsDownloading(true)
                            exportService.downloadPDF([document], congregation, firestore)
                            .then(value => setIsDownloading(false))
                        }}
                        iconProps={{ iconName: 'DownloadDocument' }} allowDisabledFocus>
                            Download
                        </ActionButton>
                    }

                    <ActionButton
                        className="text-red-500"
                        onClick={deleteProgram}
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
