import { Modal } from '@fluentui/react'
import React, { useContext } from 'react'
import { GlobalContext } from '../store/GlobalState'

export default function ModalView({ titleId } : {
    titleId: string
}) {
    const { dismissModal, isModalOpen, modalChildren } = useContext(GlobalContext)
    return (
        <div>
            <Modal
                isClickableOutsideFocusTrap={false}
                titleAriaId={titleId}
                isOpen={isModalOpen}
                onDismiss={dismissModal}
            >
                {modalChildren}
            </Modal>
        </div>
    )
}
