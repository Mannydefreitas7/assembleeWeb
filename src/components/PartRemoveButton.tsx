import { IPersonaSharedProps, Persona, PersonaInitialsColor, PersonaPresence, PersonaSize } from '@fluentui/react'
import React from 'react'
import { Gender, Publisher } from '../models/publisher'
import { Part } from '../models/wol';

export default function PartRemoveButton({ publisher, part, action } : { publisher: Publisher, part: Part, action: () => void }) {
    const persona: IPersonaSharedProps = {
        imageInitials: `${publisher.lastName?.charAt(0)}${publisher.firstName?.charAt(0)}`,
        imageUrl: publisher.photoURL ? publisher.photoURL : '',
        text: `${publisher.lastName} ${publisher.firstName}`,
      };
    return (
        <>
            <button 
            onClick={action}
            className=" py-1 bg-gray-50 rounded-full focus:outline-none hover:bg-gray-100">
                <Persona
                    {...persona}
                    className="p-1"
                    initialsColor={publisher.gender === Gender.brother ? PersonaInitialsColor.darkBlue : PersonaInitialsColor.pink}
                    size={PersonaSize.size24}
                    presence={part.isConfirmed ? PersonaPresence.online : PersonaPresence.none}
                    imageAlt={`${publisher.lastName} ${publisher.firstName}`}
                />
            </button>
        </>
    )
}
