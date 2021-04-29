import { ChoiceGroup, Dropdown, IChoiceGroupOption, Icon, IconButton, IDropdownOption, PrimaryButton, Separator, Spinner, TextField } from '@fluentui/react'
import React, { useContext } from 'react'
import { Gender, Privilege, Publisher } from '../models/publisher';
import { GlobalContext } from '../store/GlobalState';
import * as EmailValidator from 'email-validator';
import { v4 } from 'uuid'
import { CONG_ID } from '../constants';

export default function AddPublisherView() {
    const { dismissModal, firestore } = useContext(GlobalContext);
    const [isLoading, setLoading] = React.useState(true);
    const [publisher, setPublisher] = React.useState<Publisher>({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [errorMsg, setErrorMsg] = React.useState<{
        firstName?: string,
        lastName?: string,
        email?: string,
        gender?: string
    }>();
    const genders: IDropdownOption[] = [
        { key: Gender.brother, text: Gender.brother },
        { key: Gender.sister, text: Gender.sister },
    ];   
    const privileges: IDropdownOption[] = [
        { key: Privilege.elder, text: Privilege.elder },
        { key: Privilege.ms, text: Privilege.ms },
        { key: Privilege.pub, text: Privilege.pub },
    ];  

    const valiations = () => {
        if (publisher?.email && publisher?.email?.length > 3) {
            if (!EmailValidator.validate(publisher?.email)) {
               return setErrorMsg({ email:  'Not a valid email'})
            }
        }
        if (publisher?.firstName && publisher?.firstName?.length < 2 || publisher?.lastName && publisher?.lastName?.length < 2) {
            setLoading(true)
            return setErrorMsg({ firstName: 'Please enter full Name'})
        }
        if (!publisher?.gender || !publisher.privilege) {
            setLoading(true)
            return setErrorMsg({ gender: 'Please enter gender' })
        }
        setLoading(false)
    }

    const addPublisher = () => {

        valiations()
        
        if (publisher) {
            if (publisher.firstName! && publisher.lastName! && publisher.email! && publisher.gender!) {
                let _publisher : Publisher = {
                    ...publisher,
                    isInvited: false,
                    privilege: publisher.privilege ? publisher.privilege : Privilege.pub,
                    isWTConductor: false,
                    isReader: false,
                    uid: v4()
                }
                firestore
                .doc(`congregations/${CONG_ID}/publishers/${_publisher.uid}`)
                .set(_publisher)
                .then(dismissModal)
            }
        }
    }
      
    return (
        <div>
            <div className="flex items-center justify-between pl-4 pr-2 py-2 bg-gray-50">
               
               <div className="inline-flex items-center">
                   <Icon iconName="AddFriend" className="mr-2 text-lg"/>
                   <span className="font-bold text-lg">Add Publisher</span>
               </div>
               <IconButton
               onClick={dismissModal}
               iconProps={{
                   iconName: "ChromeClose"
               }}
               />
           </div>
           <div className="px-4 pb-2" style={{ minWidth: 500 }}>
            <Separator className="mt-4"><Icon iconName="UserOptional" /></Separator>
               <div className="flex">
                    <TextField 
                    errorMessage={errorMsg?.firstName} 
                    onKeyUp={(e) => { 
                        setPublisher({ 
                            ...publisher,
                            firstName: e.currentTarget.value
                        })
                        valiations() }}
                    className="mr-2" 
                    placeholder="Charles" 
                    label="First Name" 
                    required />
                    <TextField 
                    className="flex-1" 
                    errorMessage={errorMsg?.lastName} 
                    onKeyUp={(e) => { 
                        setPublisher({ 
                            ...publisher,
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
                   setPublisher({ 
                    ...publisher,
                       email: e.currentTarget.value
                    })
                   valiations()
                }}
               placeholder="charles.russel@domain.com" 
               required />
               <Separator className="mt-4"><Icon iconName="BusinessCenterLogo" /></Separator>
               <div className="flex">
                    <Dropdown
                        placeholder="Brother"
                        label="Gender"
                        onChange={(e, option) => {
                            
                            setPublisher({ 
                                ...publisher,
                                gender: option?.text ?? Gender.brother 
                            })
                            valiations()
                        }}
                        options={genders}
                        className="flex-1 mr-2"
                    />
                    <Dropdown
                        placeholder="Publisher"
                        onChange={(e, option) => {
                            setPublisher({ 
                                ...publisher,
                                privilege: option?.text ?? Privilege.pub 
                            })
                            valiations()
                        }}
                        label="Privilege"
                        className="flex-1"
                        options={privileges}
                    />
               </div>
               <div className="flex py-4 justify-center">
                    <PrimaryButton
                    onClick={addPublisher}
                    disabled={isLoading}
                    className="w-full" 
                    iconProps={{iconName: 'Add'}}
                    text={
                        publisher && publisher?.firstName &&  publisher.firstName.length > 1 && publisher.lastName && publisher.lastName.length > 1? `Add ${publisher?.firstName} ${publisher?.lastName}` : 'Add Publisher'
                    } />
            </div>
           </div>
        </div>
    )
}
