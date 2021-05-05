import { IPersonaSharedProps, Persona, PersonaInitialsColor, PersonaPresence, PersonaSize } from '@fluentui/react';
import React from 'react'
import { Gender, Publisher } from '../models/publisher';

export default function PublisherTile({ publisher, isConfirmed } : { publisher: Publisher, isConfirmed?: boolean }) {
    const persona: IPersonaSharedProps = {
        imageInitials: `${publisher.lastName?.charAt(0)}${publisher.firstName?.charAt(0)}`,
        imageUrl: publisher.photoURL ? publisher.photoURL : '',
        text: `${publisher.lastName} ${publisher.firstName}`,
        secondaryText: publisher.privilege?.toUpperCase(),
        tertiaryText: publisher.uid ?? '',
      };
    return (
        <div className="my-4 rounded">
         <Persona
            {...persona}
            className="p-4"
            initialsColor={publisher.gender === Gender.brother ? PersonaInitialsColor.darkBlue : PersonaInitialsColor.pink}
            size={PersonaSize.size48}
            presence={isConfirmed ? PersonaPresence.online : PersonaPresence.none}
            imageAlt={`${publisher.lastName} ${publisher.firstName}`}
        />
        </div>
    )
}
