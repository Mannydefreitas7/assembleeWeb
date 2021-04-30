import { ActionButton } from '@fluentui/react'
import React, { useContext } from 'react'
import { GlobalContext } from '../store/GlobalState';

export default function ExportMenu() {
    const { openExportModal } = useContext(GlobalContext)

    return (
        <div>
            <ActionButton
                iconProps={{ iconName: 'Generate' }}
                text="Export"
                onClick={openExportModal}
            />
        </div>
    )
}


