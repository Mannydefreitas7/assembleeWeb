import {  DefaultButton, IconButton } from '@fluentui/react'
import React, { useContext } from 'react'
import { GlobalContext } from '../store/GlobalState';

export default function ExportMenu() {
    const { openExportModal, isMobile } = useContext(GlobalContext)

    return (
        <div>
            {
                isMobile ? <IconButton 
                    onClick={openExportModal}
                    iconProps={{ iconName: 'Generate' }} /> : 
                <DefaultButton
                    iconProps={{ iconName: 'Generate' }}
                    text="Export"
                    onClick={openExportModal}
                />
            }
        </div>
    )
}


