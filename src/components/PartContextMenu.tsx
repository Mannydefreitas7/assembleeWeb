import React, { createRef, useContext, useState } from 'react'
import { ContextualMenu, IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { IconButton } from '@fluentui/react';
import { Parent, Part } from '../models/wol';
import Mail from 'nodemailer/lib/mailer';
import { useAlert } from 'react-alert';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GlobalContext } from '../store/GlobalState';
import { EmailService } from '../services/email';
import { CONG_ID } from '../constants';


export default function PartContextMenu({ part } : { part: Part }) {
    const ref = createRef<HTMLDivElement>();
    const linkRef = React.useRef(ref);
    const emailService = new EmailService();
    const { auth, congregation, functions, openRenameModal, firestore } = useContext(GlobalContext)
    const [ user, loading ] = useAuthState(auth)
    const alert = useAlert()
    const [showContextualMenu, setShowContextualMenu] = useState(false);
    const onShowContextualMenu = React.useCallback((ev: React.MouseEvent<HTMLElement>) => {
        ev.preventDefault(); // don't navigate
        setShowContextualMenu(true);
    }, []);
  const onHideContextualMenu = React.useCallback(() => setShowContextualMenu(false), []);

  const hideEmail = () : boolean => {
      if (part.parent === Parent.apply) {
        if (part.assignee) {
            return false
        }
      }
      if (part.parent === Parent.treasures && part.index === 2) {
        if (part.assignee) {
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

  const menuItems: IContextualMenuItem[] = [
    {
        key: 'email',
        text: 'Email',
        disabled: hideEmail(),
        onClick: () => {
            emailService
            .emailPartPDF(part, sending, congregation, functions)
            .then(result => {
                if (result) {
                    setTimeout(() =>  alert.success('Email sent'), 2000)
                }
            })
        },
        iconProps: { iconName: 'Mail' },
      },
      {
        key: 'rename',
        text: 'Rename',
        onClick: () => { openRenameModal(part) },
        iconProps: { iconName: 'Rename' },
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

  let sending : Mail.Address = {
    name: 'West Hudson French',
    address: loading ? 'assemblee.app@gmail.com' : user?.email ?? "manny.defreitas7@gmail.com"
}

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


