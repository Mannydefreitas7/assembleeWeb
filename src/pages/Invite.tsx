import { PrimaryButton, Spinner, TextField } from '@fluentui/react';
import React, { useContext,  useState } from 'react'
import { useDocumentOnce } from 'react-firebase-hooks/firestore';

import firebase from "firebase/app";
import 'firebase/auth';
import logo from './../assets/logo.jpg'
import { CONG_ID } from '../constants';
import { useQuery } from '../shared/hooks';
import { GlobalContext } from '../store/GlobalState';
import { User } from '../models/user'
import { Permission, Publisher } from '../models/publisher'
import { useHistory } from "react-router-dom";
import * as EmailValidator from 'email-validator';
import { useAlert } from 'react-alert';

export default function Invite() {

    const [password, setPassword] = useState<string>();
    
    const { auth, firestore } = useContext(GlobalContext);
    let query = useQuery();
    let history = useHistory();
    let alert = useAlert();
    const [isDisabled, setIsDisabled] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const oldPublisherDocQuery = firestore.doc(`congregations/${CONG_ID}/publishers/${query.get('pub')}`);
    const [oldPublisherDoc, loading] = useDocumentOnce(oldPublisherDocQuery);
    const oldPublisher : Publisher = {
        ...oldPublisherDoc?.data()
    }
    const [email, setEmail] = useState<string>(oldPublisher?.email ?? "");
    const createUser = async (credential: firebase.auth.UserCredential) : Promise<any> => {
        try {
            const promises : Promise<any>[] = []
            if (!loading) {
                if (credential && credential.user) {
                    let user: User = {
                        congregation: CONG_ID,
                        email: email ? email : credential.user.email ?? "",
                        firstName: oldPublisher.firstName,
                        lastName: oldPublisher.lastName,
                        isEmailVerified: true,
                        permissions: [
                            Permission.programs,
                            Permission.publishers,
                            Permission.speakers
                        ],
                        uid: credential.user.uid
                    }
                    promises.push(firestore.doc(`users/${user.uid}`).set(user))
                    promises.push(firestore.doc(`congregations/${CONG_ID}/publishers/${oldPublisher.uid}`).update({ 
                        userId: credential.user.uid,
                        isInvited: true
                    }))
                    return Promise.all(promises)
                }
            }
        } catch (error) { console.log(error) }
    }


    const signUpWithEmailAndPassword = async () => {
        if (firestore) {
            try {
                setIsLoading(true)
                    if (password && oldPublisher.email) {
                        const newCredential = await auth.createUserWithEmailAndPassword(oldPublisher.email, password)
                            createUser(newCredential)
                            .then(() => setIsLoading(false))
                            .then(() => history.push('/admin'))
                            .catch(error => alert.error(`Error: ${error}`))
                    }
            } catch (error) {
                alert.error(`Error: ${error}`)
            }
        } else {
            console.log('FIRESTORE NOT LOADED')
        }
    }
    // eslint-disable-next-line
    const signUpWithProvider = async (provider: string) => {
        try {
            const _provider = provider === 'google' ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.OAuthProvider('apple');
                let result = await auth.signInWithPopup(_provider)
                if (result) { 
                    createUser(result)
                    .then(() => history.push('/admin'))
                 }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
        <div className="flex h-screen w-full justify-center items-center">
            <div className="w-96 mx-auto p-10">
                <div className="w-full flex justify-center mb-5">
                    <img src={logo} className="rounded-full w-28 overflow-hidden" alt="logo" />
                </div>
                <h2 className="font-bold text-2xl">SIGNUP</h2>
                <div className="flex justify-start flex-wrap">

                    {/* <button 
                    onClick={() => loginWithProvider('google')}
                    className="inline-flex mt-2 google w-full items-center justify-center p-2">
                        <img src={google} alt="google"/>
                        <span className="ml-2">Login with Google</span>
                    </button>
                    <button 
                    onClick={() => loginWithProvider('apple')}
                    className="inline-flex my-2 bg-black w-full items-center justify-center p-2">
                        <img src={apple} alt="apple"/>
                        <span className="ml-2 text-white">Sign in with Apple</span>
                    </button> */}
                </div>
                {/* <Separator 
                styles={{
                    content: {
                        background: 'inherit'
                    }
                }} className="bg-gray-50">OR</Separator> */}

                    {
                        loading ? <Spinner /> :
                        <div className="mb-3">
                        <TextField
                            defaultValue={oldPublisher.firstName}
                            label="First Name"
                            type="text"
                            disabled/>
                        <TextField
                            defaultValue={oldPublisher.lastName}
                            disabled
                            label="Last Name"
                            type="text"/>
                           <TextField
                            defaultValue={oldPublisher.email}
                            disabled
                            autoComplete={'off'}
                            onChange={(event, value) => {
                                if (value) {
                                    setEmail(value)
                                    if (!EmailValidator.validate(value)) {
                                        setIsDisabled(true)
                                    }
                                }
                            }}
                            onGetErrorMessage={(value) => {
                                if (EmailValidator.validate(value)) {
                                    return
                                }
                                return 'Not a valid email'
                            }} 
                            label="Email"
                            type="email"/>
                        </div>
                    }

                    <TextField
                        defaultValue={password}
                        label="Password"
                        onChange={(event, value) => {
                            if (value) {
                                setPassword(value)
                            } 
                        }}
                        type="password"
                        onGetErrorMessage={(value) => {
                            if (value.length >= 6) {
                                return
                            }
                            return 'Password needs to be at least 6 characters.'
                        }} 
                        required
                        canRevealPassword
                        revealPasswordAriaLabel="Show password"
                    />
                    <TextField
                        label="Confirm Password"
                        required
                        type="password"
                        onChange={(event, value) => {
                            if (value) {
                                if (value === password) {
                                    setIsDisabled(false)
                                } else {
                                    setIsDisabled(true)
                                }
                            }
                        }}
                        onGetErrorMessage={(value) => {
                            if (password === value) {
                                return
                            }
                            return 'Passwords don\'t match'
                        }} 
                        canRevealPassword
                        revealPasswordAriaLabel="Show password"
                    />
                    {
                        isLoading ? <Spinner className="mt-4" label="Creating your account..." labelPosition="right" /> :
                        <PrimaryButton 
                            text="Sign up" 
                            onClick={() => signUpWithEmailAndPassword()}
                            className="mt-5"
                            allowDisabledFocus 
                            disabled={isDisabled}/>
                    }
                    
            </div>
        </div>
        </>
    )
}
