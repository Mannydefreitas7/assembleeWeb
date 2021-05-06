import { Dropdown, Persona, PersonaPresence, PersonaSize, SelectableOptionMenuItemType } from '@fluentui/react'
import React from 'react'
import { Permission } from '../models/publisher'
import { User } from '../models/user'

export default function UserRow({ user } : { user: User}) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded my-2">
                <Persona
                    text={`${user.lastName} ${user.firstName}`}
                    secondaryText={user.email}
                    tertiaryText={user.uid}
                    imageUrl={user.photoURL}
                    size={PersonaSize.size48}
                    presence={user.isOnline ? PersonaPresence.online : PersonaPresence.offline}
                    imageAlt={`${user.lastName} ${user.firstName}`}
                />
                <div className="inline-flex">
                    <Dropdown
                        placeholder="Select permissions"
                        defaultSelectedKeys={user.permissions}
                        multiSelect
                        options={[
                            {
                                key: Permission.admin,
                                text: Permission.admin,
                                itemType: SelectableOptionMenuItemType.Normal
                            },
                            {
                                key: Permission.programs,
                                text: Permission.programs,
                                itemType: SelectableOptionMenuItemType.Normal
                            },
                            {
                                key: Permission.publishers,
                                text: Permission.publishers,
                                itemType: SelectableOptionMenuItemType.Normal
                            },
                            {
                                key: Permission.speakers,
                                text: Permission.speakers,
                                itemType: SelectableOptionMenuItemType.Normal
                            }
                        ]}
                    />
            </div>
        </div>
        
    )
}
