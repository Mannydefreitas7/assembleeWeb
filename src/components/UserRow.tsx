import { Dropdown, IDropdownOption, Persona, PersonaPresence, PersonaSize, SelectableOptionMenuItemType } from '@fluentui/react'
import React, { useContext } from 'react'
import { Permission } from '../models/publisher'
import { User } from '../models/user'
import { GlobalContext } from '../store/GlobalState';

export default function UserRow({ user } : { user: User}) {

    const { firestore } = useContext(GlobalContext);

    const changePermission = async (option: IDropdownOption) => {
        if (user.permissions) {
            if (option && option.selected) {
                await firestore.doc(`users/${user.uid}`).update({ permissions: [
                    ...user.permissions,
                    option.text
                ] })
            } else {
                await firestore.doc(`users/${user.uid}`).update({ permissions: [
                    ...user.permissions.filter(o => o !== option.text),
                ] })
            }
        }
    }

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
                        onChange={(event, option) => {
                            if (option) changePermission(option)
                            //changePermission(option)
                        }}
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
