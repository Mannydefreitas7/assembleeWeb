import { IPersonaSharedProps, Persona, PersonaPresence, PersonaSize } from '@fluentui/react';
import React from 'react'
import { Publisher } from '../models/publisher';

export default function PublisherTile({ publisher, isConfirmed } : { publisher: Publisher, isConfirmed?: boolean }) {
    const persona: IPersonaSharedProps = {
        imageInitials: `${publisher.lastName?.charAt(0)}${publisher.firstName?.charAt(0)}`,
        imageUrl: publisher.photoURL ? publisher.photoURL : '',
        text: `${publisher.lastName} ${publisher.firstName}`,
        secondaryText: publisher.privilege?.toUpperCase(),
        tertiaryText: publisher.uid,
      };
    return (
        <div className="my-4">
         <Persona
            {...persona}
            className="p-4"
            size={PersonaSize.size40}
            presence={isConfirmed ? PersonaPresence.online : PersonaPresence.none}
            imageAlt={`${publisher.lastName} ${publisher.firstName}`}
        />
        </div>
    )
}
