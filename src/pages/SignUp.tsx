import { DefaultButton, PrimaryButton, Separator, Text, TextField } from '@fluentui/react'
import React, { FormEvent, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from './../assets/logo.jpg'
import firebase from "firebase/app";
import 'firebase/auth';
import { useHistory } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { GlobalContext } from '../store/GlobalState'
import { useAlert } from 'react-alert'
import { User } from '../models/user'
import { Gender, Permission, Privilege, Publisher } from '../models/publisher'
import { CONG_ID } from '../constants'
import apple from './../assets/apple.svg'
import google from './../assets/google.svg'

export default function SignUp() {

    const [email, setEmail] = useState('');
    const [name, setName] = useState<{ fistName: string, lastName: string }>();
    const [password, setPassword] = useState('');
    const { auth, firestore } = useContext(GlobalContext)
    let history = useHistory();
    const [user] = useAuthState(auth);

   
    const alert = useAlert()

    const signUpWithEmailAndPassword = async () => {
        try {
            if (email.length > 0 && password.length > 0) {
                if (user && user?.isAnonymous) {
                    const newCredential = await auth.createUserWithEmailAndPassword(email, password)
                    console.log(newCredential)

                    if (newCredential) {
                           // const userCredential = await auth.currentUser?.linkWithCredential(newCredential.credential);
                            
                            if (newCredential?.user) {
                                let user: User = {
                                    congregation: CONG_ID,
                                    email: newCredential?.user?.email ?? "",
                                    firstName: name?.fistName,
                                    lastName: name?.lastName,
                                    isEmailVerified: true,
                                    loginProvider: newCredential?.additionalUserInfo?.providerId,
                                    permissions: [
                                        Permission.programs,
                                        Permission.publishers,
                                        Permission.speakers
                                    ],
                                    uid: newCredential?.user?.uid
                                }

                                let publisher : Publisher = {
                                    uid: user.uid,
                                    email: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    gender: Gender.brother,
                                    isInvited: true, 
                                    privilege: Privilege.pub
                                }
                                firestore.doc(`users/${user.uid}`).set(user)
                                .then(() => {
                                    history.push("/admin")
                                    firestore.doc(`congregations/${CONG_ID}/publishers/${publisher.uid}`)
                                    .set(publisher)
                                    .then(() => history.push("/admin"))
                                })
                            }
                        }
                    }
                }
        } catch (error) {
            console.log(error)
        }
    }
    // eslint-disable-next-line
    const loginWithProvider = async (provider: string) => {
        try {
            const _provider = provider === 'google' ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.OAuthProvider('apple');
                let result = await auth.signInWithPopup(_provider)
                if (result) {
                    let userDoc = await firestore.doc(`users/${result.user?.uid}`).get()
                    if (userDoc.exists) {
                        history.push("/admin")
                    } else {
                        result.user?.delete()
                        .then((_: any) => alert.show('Oops, user account does not exist.'))
                    }
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
                    <button 
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
                    </button>
                </div>
                <Separator
                styles={{
                    content: {
                        background: 'inherit'
                    }
                }} className="bg-gray-50">OR</Separator>

                    <div className="mb-3">
                    <TextField
                        defaultValue={email}
                        onChange={(event : FormEvent, value) => setName({ 
                            fistName: value ?? '',
                            lastName: name?.lastName ?? '' 
                        })}
                        label="First Name"
                        type="text"
                        required/>
                    <TextField
                        defaultValue={email}
                        onChange={(event : FormEvent, value) => setName({ 
                            fistName: name?.fistName ?? '',
                            lastName: value ?? '' 
                        })}
                        label="Last Name"
                        type="text"
                        required/>
                       <TextField
                        defaultValue={email}
                        onChange={(event : FormEvent, value) => setEmail(value ?? "")}
                        label="Email"
                        type="email"
                        required/>
                    </div>
                    <TextField
                        defaultValue={password}
                        label="Password"
                        onChange={(event : FormEvent, value) => setPassword(value ?? "")}
                        type="password"
                        canRevealPassword
                        revealPasswordAriaLabel="Show password"
                    />
                    <Link to="/">
                        <Text className="px-2 mr-4">Go Back</Text>
                    </Link>
                    <DefaultButton text="Sign Out" onClick={() => auth.signOut()}/>
                    <PrimaryButton 
                    text="Sign up" 
                    onClick={() => signUpWithEmailAndPassword()}
                    className="mt-5"
                    allowDisabledFocus 
                    disabled={false}/>
            </div>
        </div>
        </>
    )
}


