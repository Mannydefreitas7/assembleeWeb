import { Dropdown, Icon, IconButton, IDropdownOption, PrimaryButton, Separator, TextField } from '@fluentui/react'
import React, { useContext } from 'react'
import { Privilege, Speaker } from '../models/publisher';
import { GlobalContext } from '../store/GlobalState';
import * as EmailValidator from 'email-validator';
import { v4 } from 'uuid'
import { CONG_ID } from '../constants';

export default function AddSpeakerView() {
    const { dismissModal, firestore } = useContext(GlobalContext);
    const [isLoading, setLoading] = React.useState(true);
    const [speaker, setSpeaker] = React.useState<Speaker>();
    const [errorMsg, setErrorMsg] = React.useState<{
        firstName?: string | undefined,
        lastName?: string | undefined,
        email?: string | undefined,
        gender?: string | undefined
    }>();

    const privileges: IDropdownOption[] = [
        { key: Privilege.elder, text: Privilege.elder },
        { key: Privilege.ms, text: Privilege.ms },
    ];

    const valiations = () => {
        if (speaker && speaker.email && speaker.email.length > 3) {
            if (!EmailValidator.validate(speaker.email)) {
                setLoading(true)
                return setErrorMsg({ email: 'Not a valid email' })
            }
            if ((speaker.firstName && speaker.firstName.length < 2) && (speaker.lastName && speaker.lastName.length < 2)) {
                setLoading(true)
                return setErrorMsg({ firstName: 'Please enter full Name' })
            }
            setErrorMsg({})
            return setLoading(false)
        }
    }

    const addSpeaker = () => {

        valiations()

        if (speaker) {
            if (speaker.firstName! && speaker.lastName! && speaker.email!) {
                let _speaker: Speaker = {
                    ...speaker,
                    congregation: {
                        ...speaker.congregation,
                        id: v4()
                    },
                    privilege: speaker.privilege ? speaker.privilege : Privilege.pub,
                    id: v4()
                }
                firestore
                    .doc(`congregations/${CONG_ID}/speakers/${_speaker.id}`)
                    .set(_speaker)
                    .then(dismissModal)
            }
        }
    }

    return (
        <div style={{ minWidth: 532, maxHeight: 600 }}>
            <div className="flex items-center justify-between pl-4 pr-2 py-2 bg-gray-50">
                <div className="inline-flex items-center">
                    <Icon iconName="AddFriend" className="mr-2 text-lg" />
                    <span className="font-bold text-lg">Add Speaker</span>
                </div>
                <IconButton
                    onClick={dismissModal}
                    iconProps={{
                        iconName: "ChromeClose"
                    }}
                />
            </div>
                    <div className="px-4 pb-2">
                        <Separator className="mt-4"><Icon iconName="UserOptional" /></Separator>
                        <div className="flex">
                            <TextField
                                errorMessage={errorMsg?.firstName}
                                onKeyUp={(e) => {
                                    setSpeaker({
                                        ...speaker,
                                        firstName: e.currentTarget.value
                                    })
                                }}
                                className="mr-2"
                                placeholder="Charles"
                                label="First Name"
                                required />
                            <TextField
                                className="flex-1"
                                errorMessage={errorMsg?.lastName}
                                onKeyUp={(e) => {
                                    setSpeaker({
                                        ...speaker,
                                        lastName: e.currentTarget.value
                                    })
                                    valiations()
                                }}
                                placeholder="Russel"
                                label="Last Name"
                                required />
                        </div>
                        <TextField
                            label="Email"
                            errorMessage={errorMsg?.email}
                            onKeyUp={(e) => {
                                setSpeaker({
                                    ...speaker,
                                    email: e.currentTarget.value
                                })
                                valiations()
                            }}
                            placeholder="charles.russel@domain.com"
                            required />
                        <Separator className="mt-4"><Icon iconName="BusinessCenterLogo" /></Separator>
                        <div className="flex">
                            <Dropdown
                                placeholder="Privilege"
                                onChange={(e, option) => {
                                    setSpeaker({
                                        ...speaker,
                                        privilege: option?.text ?? Privilege.pub
                                    })
                                    valiations()
                                }}
                                label="Privilege"
                                className="flex-1"
                                options={privileges}
                            />
                        </div>
                        <div className="flex">
                            <TextField
                                errorMessage={errorMsg?.firstName}
                                onChange={(e, value) => {
                                    setSpeaker({
                                        ...speaker,
                                        congregation: {
                                            properties: {
                                                address: speaker?.congregation?.properties?.address,
                                                orgName: value
                                            }
                                        }
                                    })
                                }}
                                className="mr-2 w-full"
                                placeholder="Congregation Name"
                                label="Congregation Name"
                            />
                            <TextField
                                errorMessage={errorMsg?.firstName}
                                onChange={(e, value) => {
                                    setSpeaker({
                                        ...speaker,
                                        congregation: {
                                            properties: {
                                                address: value,
                                                orgName: speaker?.congregation?.properties?.orgName
                                            }
                                        }
                                    })
                                }}
                                className="w-full"
                                placeholder="Address"
                                label="Address"
                            />
                        </div>
                        <div className="flex py-4 justify-center">
                            <PrimaryButton
                                onClick={addSpeaker}
                                disabled={isLoading}
                                className="w-full"
                                iconProps={{ iconName: 'Add' }}
                                text={
                                    speaker && speaker?.firstName && speaker.firstName.length > 1 && speaker.lastName && speaker.lastName.length > 1 ? `Add ${speaker?.firstName} ${speaker?.lastName}` : 'Add Speaker'
                                } />
                        </div>
                    </div>
        </div>
    )
}
