import React, { createRef, useContext, useState } from 'react'
import { ContextualMenu, IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { IconButton } from '@fluentui/react';
import { Parent, Part } from '../models/wol';
// @ts-ignore
import useClipboard from 'react-hook-clipboard';
import Mail from 'nodemailer/lib/mailer';
import { useAlert } from 'react-alert';
import { GlobalContext } from '../store/GlobalState';
import { EmailService } from '../services/email';
import { CONG_ID } from '../constants';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ExportService } from '../services/export';


export default function PartContextMenu({ part } : { part: Part }) {

    const ref = createRef<HTMLDivElement>();
    const linkRef = React.useRef(ref);
    const [clipboard, copyToClipboard] = useClipboard()
    const emailService = new EmailService();
    const exportService = new ExportService();
    const { congregation, functions, openRenameModal, firestore, auth } = useContext(GlobalContext);

    const alert = useAlert()

    const [showContextualMenu, setShowContextualMenu] = useState(false);

    const onShowContextualMenu = React.useCallback((ev: React.MouseEvent<HTMLElement>) => {
        ev.preventDefault(); // don't navigate
        setShowContextualMenu(true);
    }, []);

    const [user, loading] = useAuthState(auth)
    const onHideContextualMenu = React.useCallback(() => setShowContextualMenu(false), []);

  const copyEmail = (email: string) => {
    copyToClipboard(email)
    alert.success('Email copied to clipboard')
}


  const isDisabled = () : boolean => {
      if (part.parent === Parent.apply) {
        if (part.assignee && !part.isEmailed) {
            return false
        }
      }
      if (part.parent === Parent.treasures && part.index === 2) {
        if (part.assignee && !part.isEmailed) {
            return false
        }
      }
      return true
  }

    const confirmPart = () => {
        if (part.assignee) {
        firestore.doc(`congregations/${CONG_ID}/publishers/${part.assignee.uid}/parts/${part.id}`).update({ isConfirmed: true })
        } else if (part.assistant) {
        firestore.doc(`congregations/${CONG_ID}/publishers/${part.assistant.uid}/parts/${part.id}`).update({ isConfirmed: true })
        }
        firestore.doc(`congregations/${CONG_ID}/weeks/${part.week}/parts/${part.id}`).update({ isConfirmed: true })
    }

    const cancelPart = () => {
        if (part.assignee) {
        firestore.doc(`congregations/${CONG_ID}/publishers/${part.assignee.uid}/parts/${part.id}`).update({ isConfirmed: false })
        } else if (part.assistant) {
        firestore.doc(`congregations/${CONG_ID}/publishers/${part.assistant.uid}/parts/${part.id}`).update({ isConfirmed: false })
        }
        firestore.doc(`congregations/${CONG_ID}/weeks/${part.week}/parts/${part.id}`).update({ isConfirmed: false })
    }
    // const deletePart = () => {
    //     if (part.assignee) {
    //     firestore.doc(`congregations/${CONG_ID}/publishers/${part.assignee.uid}/parts/${part.id}`).delete()
    //     } else if (part.assistant) {
    //     firestore.doc(`congregations/${CONG_ID}/publishers/${part.assistant.uid}/parts/${part.id}`).delete()
    //     }
    //     firestore.doc(`congregations/${CONG_ID}/weeks/${part.week}/parts/${part.id}`).delete()
    // }

  const sending : Mail.Address = {
      name: congregation.properties?.orgName ?? 'Congregation',
      address: loading ? "assemblee.app@gmail.com" : user?.email ?? 'assemblee.app@gmail.com'
  }
  const menuItems: IContextualMenuItem[] = [
    {
        key: 'email',
        text: part.isEmailed ? 'Emailed' : 'Email',
        disabled: isDisabled(),
        onClick: () => {
            emailService
            .emailPartPDF(part, sending, congregation, functions)
            .then(result => {
                if (result) {
                    setTimeout(() =>  alert.success('Email sent'), 2000)
                }
            })
            .then(() => {
              firestore.doc(`congregations/${CONG_ID}/weeks/${part.week}/parts/${part.id}`).update({ isEmailed: true })
            })
            .catch(error => alert.error(`${error}`))
        },
        iconProps: { iconName: part.isEmailed ? 'MailCheck' : 'Mail' },
      },
      {
        key: 'rename',
        text: 'Rename',
        onClick: () => { openRenameModal(part) },
        iconProps: { iconName: 'Rename' },
      },
      {
        key: 'copy',
        text: 'Copy Email',
        disabled: isDisabled(),
        onClick: () => { 
          if (part && part.assignee && part.assignee.email)
          copyEmail(part.assignee.email) 
        },
        iconProps: { iconName: 'Copy' },
      },
      {
        key: 'part',
        text: 'Part PDF',
        onClick: () => { 
          exportService.downloadPartPDF(part)
        },
        iconProps: { iconName: 'Installation' },
      },
      {
        key: 'confirm',
        text: part.isConfirmed ? 'Cancel' : 'Confirm',
        iconProps: { iconName: part.isConfirmed ? 'Cancel' : 'CheckMark' },
        onClick: () => { part.isConfirmed ? cancelPart() : confirmPart() }
      },
    //   {
    //     key: 'delete',
    //     text: 'Delete',
    //     iconProps: { iconName: 'Trash' },
    //     onClick: () => { deletePart() }
    //   },
  ];



    return (
        <>  
            <div ref={ref}>
            <IconButton 
                className="ml-2 rounded-full overflow-hidden"
                onClick={onShowContextualMenu}
                iconProps={{ iconName: 'More' }} />
            </div>
            <ContextualMenu
                items={menuItems}
                target={linkRef.current}
                hidden={!showContextualMenu}
                onItemClick={onHideContextualMenu}
                onDismiss={onHideContextualMenu}
            />
        </>
    )
}


