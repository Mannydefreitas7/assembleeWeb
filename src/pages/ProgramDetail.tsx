import { ActionButton, DefaultButton, Dialog, DialogFooter, DialogType, IconButton, Pivot, PivotItem, PrimaryButton, Spinner, SpinnerSize, Toggle } from '@fluentui/react';
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
import { useBoolean } from '@fluentui/react-hooks';
import { SharedColors } from '@fluentui/theme'
import { useAlert } from 'react-alert';

export default function ProgramDetail() {
    const { firestore, congregation, reloadWeeks, isMobile } = useContext(GlobalContext)
    const { id } = useParams<{ id: string }>();
    const [documentSnapshot, weekLoading] = useDocument(firestore.doc(`congregations/${CONG_ID}/weeks/${id}`))
    const [collection, loading] = useCollection(firestore.collection(`congregations/${CONG_ID}/weeks/${id}/parts`).orderBy('index'));
    let history = useHistory();
    let alert = useAlert()
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const [isDownloading, setIsDownloading] = useState(false)
    let document: WeekProgram = {
        ...documentSnapshot?.data()
    }
    const exportService = new ExportService()
   
    const deleteProgram = () => {
        collection?.docs.forEach(async doc => await doc.ref.delete())
        documentSnapshot?.ref.delete()
        .then(() => toggleHideDialog())
        .then(() => history.goBack())
        .then(() => alert.success('Week deleted successfully'))
        .catch((error) => alert.error(`Error: ${error}`))
    }

    function _onChange(ev: React.MouseEvent<HTMLElement>, checked?: boolean) {
        firestore.doc(`congregations/${CONG_ID}/weeks/${id}`).update({ isSent: checked })
        .then(() => reloadWeeks())
    }

    const download = () => {
        setIsDownloading(true)
        exportService.downloadPDF([document], congregation, firestore)
        .then(value => setIsDownloading(false))
    }

    return (
        <div className="mx-auto p-8">
            <div className="mb-2 flex flex-wrap justify-between items-center">
                <h1 className="font-bold text-2xl">
                    <ActionButton
                        className="font-bold text-base"
                        onClick={() => history.goBack()}
                        iconProps={{ iconName: 'ChromeBack' }} allowDisabledFocus>
                        Programs
                    </ActionButton> <br />
                    {document.range}
                </h1>
                <div className="flex flex-wrap items-center">
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
                        isMobile ? <IconButton
                        onClick={download}
                        iconProps={{ iconName: 'PDF' }}
                        /> : <ActionButton 
                        onClick={download}
                        iconProps={{ iconName: 'PDF' }} allowDisabledFocus>
                            Download
                        </ActionButton>
                    }
                    {
                        isMobile ? <IconButton 
                        styles={{ icon: {
                            color: SharedColors.red10
                        }}}
                        onClick={toggleHideDialog}
                        iconProps={{ iconName: 'Delete' }} 
                        /> : <ActionButton
                            styles={{ 
                                root: { color: SharedColors.red10 },
                                icon: {
                                color: SharedColors.red10
                            }}}
                            onClick={toggleHideDialog}
                            iconProps={{ iconName: 'Delete', className: 'text-red-500 hover:text-red-900' }} allowDisabledFocus>Delete</ActionButton>
                    }

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
            <Dialog
                hidden={hideDialog}
                onDismiss={toggleHideDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Are You Sure?',
                    closeButtonAriaLabel: 'Close',
                    subText: 'This will remove all parts and information related to this week.',
                }}
            >
                <DialogFooter>
                <PrimaryButton styles={{ 
                    root: { backgroundColor: SharedColors.red20, borderColor: SharedColors.red20  },
                    rootHovered: { backgroundColor: SharedColors.red10, borderColor: SharedColors.red10 }
                 }} onClick={deleteProgram} text="Yes, Delete" />
                <DefaultButton onClick={toggleHideDialog} text="No" />
                
                </DialogFooter>
            </Dialog>
        </div>
    )
}
