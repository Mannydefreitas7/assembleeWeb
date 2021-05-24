import React, { useContext, useState } from 'react'
import { Icon, IconButton, PrimaryButton, TextField } from '@fluentui/react';
import { Part } from '../models/wol';
import { useAlert } from 'react-alert';

import { GlobalContext } from '../store/GlobalState';

import { CONG_ID } from '../constants';

export default function RenamePartView({part}:{part: Part}) {
    const { firestore, dismissModal } = useContext(GlobalContext);
    const [input, setInput] = useState<string>(part.title ?? '');
    const alert = useAlert()
    const saveChange = () => {
        if (part.assignee) {
           firestore.doc(`congregations/${CONG_ID}/publishers/${part.assignee.uid}/parts/${part.id}`).update({ title: input })
        } else if (part.assistant) {
           firestore.doc(`congregations/${CONG_ID}/publishers/${part.assistant.uid}/parts/${part.id}`).update({ title: input })
        }
        firestore.doc(`congregations/${CONG_ID}/weeks/${part.week}/parts/${part.id}`).update({ title: input })
        .then(() => {
            dismissModal()
            alert.success('Part renamed successfully!')
        })
    }

    return (
        <>
        <div className="h-160 w-80">
            <div className="flex items-center justify-between pl-4 pr-2 py-2 bg-gray-50">
                <div className="inline-flex items-center">
                    <Icon iconName="Rename" className="mr-2 text-lg" />
                    <span className="font-bold text-lg">Rename Part</span>
                </div>
                <IconButton
                    onClick={dismissModal}
                    iconProps={{
                        iconName: "ChromeClose"
                    }}
                />
            </div>
            <div className="p-4">
                <TextField 
                multiline
                resizable
                onKeyUp={(e) => setInput(e.currentTarget.value)}
                defaultValue={input} />
                <div className="flex items-center justify-center mt-4">
                    <PrimaryButton className="w-full" text="Save" onClick={saveChange} />
                </div>
            </div>
        </div>
        </>
    )
}