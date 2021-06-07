import { ActionButton, DefaultButton, Persona, PersonaInitialsColor, PersonaSize, PrimaryButton, Spinner, Text, TextField } from '@fluentui/react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../store/GlobalState';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection,  useDocument } from 'react-firebase-hooks/firestore';
import {  useDropzone } from 'react-dropzone'
import 'firebase/auth'
import 'firebase/firestore'
import { User } from '../models/user';
import { CONG_ID } from '../constants';
import { Permission } from '../models/publisher';
import UserRow from './UserRow';
import { useAlert } from 'react-alert';

export default function UserView() {
    const { auth, storage, firestore, functions } = useContext(GlobalContext);
    const [ userState ] = useAuthState(auth);
    const [userInfo, setUserInfo] = useState<User>();
   // const [password, setPassword] = useState<string>();
    const [isEditing, setIsEditing] = useState(false)
    const [ users, usersLoading ] = useCollection(firestore.collection('users').where('congregation', '==', CONG_ID))
    const [userDoc, userDocloading] = useDocument(firestore.doc(`users/${userState?.uid}`));
    let alert = useAlert()
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
            if (acceptedFiles[0].type === 'image/jpeg' || acceptedFiles[0].type === 'image/png') {
               let ref = storage.ref().child(`users/${acceptedFiles[0].name}`);
               let buffer = await acceptedFiles[0].arrayBuffer();
                   let task = await ref.put(buffer);
                   let url = await task.ref.getDownloadURL();
                   firestore.doc(`users/${userState?.uid}`).update({ photoURL: url })
            }
    // eslint-disable-next-line
      }, [])

    const deleteAllAnymomous = functions.httpsCallable('deleteAllAnymomous')


    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

    useEffect(() => {
        deleteAllAnymomous()
    })

    const saveData = () => {
        if (auth.currentUser) {
            firestore.doc(`users/${auth.currentUser.uid}`)
            .update({ firstName: userInfo?.firstName, lastName: userInfo?.lastName })
            .then(() => setIsEditing(false))
            .then(() => { alert.success("User Info updated successfully!") })
            .catch(error => alert.error(`Error: ${error}`))
        }
        
    }
    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-end py-2">
               
                <ActionButton text="Sign Out" iconProps={{ iconName: 'SignOut' }} onClick={() => {
                    if (!userDocloading && userDoc?.exists) {
                        let query = firestore.doc(`users/${userState?.uid}`);
                        query.update({ isOnline: false })
                    }
                    auth.signOut()
                    }} />
            </div>
           
            <div className="bg-white shadow p-5 rounded">
                {
                    userDocloading ? <Spinner /> :
                    <Persona
                        text={`${userDoc?.data()?.lastName} ${userDoc?.data()?.firstName}`}
                        secondaryText={userDoc?.data()?.email}
                        initialsColor={PersonaInitialsColor.darkBlue}
                        tertiaryText={userDoc?.data()?.permissions?.includes(Permission.admin) ? 'Admin' : ''}
                        imageUrl={userDoc?.data()?.photoURL}
                        imageShouldFadeIn={true}
                        size={PersonaSize.size100}
                        imageAlt={`${userInfo?.lastName} ${userInfo?.firstName}`}
                    />
                }
                
            </div>
            <div {...getRootProps()} className={ `${isDragActive ? 'bg-green-100 border-green-600' : 'bg-gray-100 border-gray-200'} w-full border-2 border-dashed px-4 py-2 mt-4 rounded`}>
                <div className="flex items-center justify-between">
                    <ActionButton iconProps={{ iconName: "ImageCrosshair" }} text='Select Profile Image' />
                    {
                        userInfo?.photoURL ?  <img alt={`${userInfo?.lastName} ${userInfo?.firstName}`} src={userInfo?.photoURL} className="w-8 rounded-full"/> : null
                    }
                   
                </div>
                <input {...getInputProps()} />
            </div>
            {
                userDocloading ? <Spinner /> : 
                <div className="flex mt-4 w-full items-center">
                    <TextField
                        disabled={!isEditing}
                        className="w-full mr-4"
                        label="First Name"
                        defaultValue={userDoc?.data()?.firstName}
                        onChange={(e, value) => {
                            setUserInfo({
                                ...userDoc?.data(),
                                firstName: value
                            })
                        }}
                    />
                    <TextField
                        disabled={!isEditing}
                        className="w-full"
                        label="Last Name"
                        onChange={(e, value) => {
                            setUserInfo({
                                ...userDoc?.data(),
                                lastName: value
                            })
                        }}
                        defaultValue={userDoc?.data()?.lastName}
                    />
                </div>
            }
        
            <div className="flex justify-end my-4">
                {
                    isEditing ? 
                    <div className="inline-flex">
                        <DefaultButton className="mr-2" text="Cancel" onClick={() => setIsEditing(false)}  />
                        <PrimaryButton iconProps={{ iconName: 'Save' }} onClick={saveData} text="Save" />
                    </div>
                     :
                    <DefaultButton iconProps={{ iconName: 'Edit' }} onClick={() => setIsEditing(true)} text="Edit" />
                }
            </div>
            {
                userDoc?.data()?.permissions?.includes(Permission.admin) ?
                <Text className="text-xl font-bold">Users</Text> : null
            }
            <div className="mt-4">
                {
                    usersLoading ? <Spinner title="Users Loading" labelPosition="right" /> :
                    userDoc?.data()?.permissions?.includes(Permission.admin) && users?.docs && users?.docs.length > 0 ? users.docs.map(_otherUser => {
                        let otherUser : User = {
                            ..._otherUser.data()
                        }
                        return (
                            <UserRow key={otherUser.uid} user={otherUser} />
                        )
                    }) : null
                }
            </div>
        </div>
    )
}
