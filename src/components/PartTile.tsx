import { DefaultButton, Icon, IconButton, IContextualMenuProps, Persona, PersonaPresence, PersonaSize, SharedColors, TextField } from '@fluentui/react'
import Mail from 'nodemailer/lib/mailer'
import React, { useContext, useState } from 'react'
import { Publisher } from '../models/publisher'
import { Parent, Part } from '../models/wol'
import { EmailService } from '../services/email';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GlobalContext } from '../store/GlobalState'
import { useAlert } from 'react-alert'

export default function PartTile({ part, publisher }: { part: Part, publisher?: Publisher }) {
    const emailService = new EmailService();
    const { auth, congregation, functions, dismissPanel } = useContext(GlobalContext)
    const [isEditing, setIsEditing] = useState(false)
    const [ user, loading ] = useAuthState(auth)
    const alert = useAlert()
    let sending : Mail.Address = {
        name: 'West Hudson French',
        address: loading ? 'assemblee.app@gmail.com' : user?.email ?? "manny.defreitas7@gmail.com"
    }
    const menuProps: IContextualMenuProps = {
        items: [
          {
            key: 'email',
            text: 'Email',
            disabled: !part.assignee || !publisher,
            onClick: () => {
                dismissPanel()
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
            onClick: () => { setIsEditing(!isEditing) },
            iconProps: { iconName: 'Rename' },
          },
          {
            key: 'confirm',
            text: part.isConfirmed ? 'Cancel' : 'Confirm',
            iconProps: { iconName: part.isConfirmed ? 'Cancel' : 'CheckMark' },
          },
        ],
      };
    return (
        <div className="p-4 flex items-center justify-between bg-gray-50 border-l-2 border-green-700">
            <div className="flex items-center">
                <Icon iconName="FileComment" className="mr-6 text-2xl" />
                <div className="flex justify-between items-center">
                    <div className="inline">
                        <span className="text-gray-600 text-sm">Part Title</span> <br />
                        {
                            isEditing ? <TextField
                            
                             defaultValue={part.title} className="w-full"  /> : <span className="text-base font-semibold leading-5 w-2/3">{part.title}</span> 
                        }
                       <br />
                        <div className="inline-flex items-center mt-2">
                            <span className="text-white inline-block px-2 py-1 mr-2 text-xs border font-semibold rounded-full"
                                style={{
                                    color: part.parent === Parent.apply ?
                                        SharedColors.orangeYellow10 :
                                        part.parent === Parent.life ?
                                            SharedColors.pinkRed10 :
                                            part.parent === Parent.treasures ?
                                                SharedColors.gray40 :
                                                SharedColors.gray20,
                                    borderColor: part.parent === Parent.apply ?
                                        SharedColors.orangeYellow10 :
                                        part.parent === Parent.life ?
                                            SharedColors.pinkRed10 :
                                            part.parent === Parent.treasures ?
                                                SharedColors.gray40 :
                                                SharedColors.gray20
                                }}
                            >{part.parent}</span>
                            {
                                publisher ?
                                    <div className="inline-flex items-center mr-4 bg-gray-100 p-1 rounded-full cursor-pointer" onClick={() => {}}>
                                    <Persona
                                        className={part.assignee && part.assignee.uid === publisher?.uid ? 'opacity-100' : 'bg-opacity-50'}
                                        imageUrl={publisher.photoURL ? publisher.photoURL : ''}
                                        text={`${publisher.lastName} ${publisher.firstName}`}
                                        size={PersonaSize.size24}
                                        presence={part.isConfirmed ? PersonaPresence.online : PersonaPresence.none}
                                        imageAlt={`${publisher.lastName} ${publisher.firstName}`}
                                    />
                                     <Icon iconName="StatusErrorFull" className="text-lg text-gray-500" />
                                    </div> : null
                            }
                            {
                                part.assistant ?
                                    <Persona
                                        className={part.assistant.uid === publisher?.uid ? 'opacity-100' : 'bg-opacity-50'}
                                        imageUrl={part.assistant.photoURL ? part.assistant.photoURL : ''}
                                        text={`${part.assistant.lastName} ${part.assistant.firstName}`}
                                        size={PersonaSize.size24}
                                        presence={part.isConfirmed ? PersonaPresence.online : PersonaPresence.none}
                                        imageAlt={`${part.assistant.lastName} ${part.assistant.firstName}`}
                                    /> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            <IconButton
                menuProps={menuProps}
                iconProps={{ iconName: 'MoreVertical' }}
                title="Emoji"
                ariaLabel="Emoji"
            />
        </div>
    )
}
