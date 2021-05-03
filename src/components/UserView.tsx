import { ActionButton, DefaultButton, Icon, IconButton, Persona, PersonaSize, Spinner, TextField } from '@fluentui/react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../store/GlobalState';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';
import { FileRejection, useDropzone } from 'react-dropzone'
import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import { User } from '../models/user';
import { CONG_ID } from '../constants';
import { Permission, Publisher } from '../models/publisher';

export default function UserView() {
    const { auth, user, storage, firestore } = useContext(GlobalContext);
    const [ userState, loading ] = useAuthState(auth);
    const [userInfo, setUserInfo] = useState<User>();
    const [passwords, setPasswords] = useState<{ password: string, confirm: string }>();
    const [ users, usersLoading ] = useCollectionOnce(firestore.collection('users').where('congregation', '==', CONG_ID))
    const onDrop = useCallback(async (acceptedFiles: File[], fileRejection: FileRejection[]) => {
            if (acceptedFiles[0].type == 'image/jpeg' || acceptedFiles[0].type == 'image/png') {
               let ref = storage.ref().child(`users/${acceptedFiles[0].name}`);
               let buffer = await acceptedFiles[0].arrayBuffer();
                   let task = await ref.put(buffer);
                   let url = await task.ref.getDownloadURL();
                   let res = await firestore.doc(`users/${userState?.uid}`).update({ photoURL: url })
                   let publiserRes = await firestore.doc(`congregations/${CONG_ID}/publishers/${userState?.uid}`).update({ photoURL: url })
            }
      }, [])

      useEffect(() => {
        loadUser()
      }, [])

    const loadUser = async () => {
        if (!loading) {
            let _res = await firestore.doc(`users/${userState?.uid}`).get();
            let _user = _res.exists ? _res.data() : {}
            setUserInfo(_user)
        }
    }


    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})
    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-end py-2">
                <ActionButton text="Sign Out" iconProps={{ iconName: 'SignOut' }} onClick={() => auth.signOut()} />
            </div>
           
            <div className="bg-white shadow p-5 rounded">
                <Persona
                    text={`${userInfo?.lastName} ${userInfo?.firstName}`}
                    secondaryText={userInfo?.email}
                    tertiaryText={userInfo?.permissions?.includes(Permission.admin) ? 'Admin' : ''}
                    imageUrl={userInfo?.photoURL}
                    size={PersonaSize.size100}
                    imageAlt={`${userInfo?.lastName} ${userInfo?.firstName}`}
                />
            </div>
            <div {...getRootProps()} className="w-full border-2 bg-gray-100 border-dashed px-4 py-2 mt-4 rounded">
                <div className="flex items-center justify-between">
                    <ActionButton iconProps={{ iconName: "ImageCrosshair" }} text='Select Profile Image' />
                    <img src={userInfo?.photoURL} className="w-8 rounded-full"/>
                </div>
                <input {...getInputProps()} />
            </div>
            <div className="flex mt-4 w-full items-center">
                <TextField
                disabled
                placeholder="Charles"
                className="w-full mr-4"
                label="First Name"
                defaultValue={userInfo?.firstName}
                 />
                <TextField
                disabled
                className="w-full"
                placeholder="Russel"
                label="Last Name"
                defaultValue={userInfo?.lastName}
                />
            </div>
            <div className="flex mt-4 w-full items-center">
                <TextField
                disabled
                type="password"
                className="w-full mr-4"
                label="New Password"
                defaultValue={passwords?.password}
                 />
                <TextField
                disabled
                type="password"
                className="w-full"
                label="Confirm Password"
                defaultValue={passwords?.confirm}
                />
            </div>
            <div className="mt-4">
                {
                    usersLoading ? <Spinner title="Users Loading" labelPosition="right" /> :
                    userInfo?.permissions?.includes(Permission.admin) && users?.docs && users?.docs.length > 0 ? users.docs.map(_otherUser => {
                        let otherUser : User = {
                            ..._otherUser.data()
                        }
                        return (
                            <div>{otherUser.firstName}</div>
                        )
                    }) : null
                }
            </div>
        </div>
    )
}
