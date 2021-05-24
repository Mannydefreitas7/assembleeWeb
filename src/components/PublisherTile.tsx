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
         <Persona
            {...persona}
            className="p-2"
            initialsColor={publisher.gender === Gender.sister ? PersonaInitialsColor.pink : PersonaInitialsColor.darkBlue}
            size={PersonaSize.size48}
            presence={isConfirmed ? PersonaPresence.online : PersonaPresence.none}
            imageAlt={`${publisher.lastName} ${publisher.firstName}`}
        />
    )
}
