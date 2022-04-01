import { PrimaryButton, TextField } from '@fluentui/react'
import React, { FormEvent, useContext, useState } from 'react'
import logo from './../assets/logo.jpg'
import apple from './../assets/apple.svg'
import google from './../assets/google.svg'
import { useHistory } from "react-router-dom";
import { GlobalContext } from '../store/GlobalState'
import { useAlert } from 'react-alert'
import { Separator } from 'office-ui-fabric-react';
import auth from "firebase/auth";



export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { auth, firestore } = useContext(GlobalContext);
    let history = useHistory();
   
    const alert = useAlert()

    const loginWithEmailAndPassword = async () => {
        try {
            if (email.length > 0 && password.length > 0) {
                const newCredential = await auth.signInWithEmailAndPassword(email, password)
                await firestore.doc(`users/${newCredential?.user?.uid}`).update({ isOnline: true })
                history.push("/admin")
                alert.success('Logged In')
            }
        } catch (error) { alert.error(`${error}`) }
    }

    const loginWithProvider = async (provider: string) => {
        try {
            const _provider = provider === 'google' ? new auth.GoogleAuthProvider() : new auth.OAuthProvider('apple');
                let result = await auth.signInWithPopup(_provider)
                if (result) {
                    let userDoc = await firestore.doc(`users/${result.user?.uid}`).get()
                    if (userDoc.exists) {
                        history.push("/admin")
                    } else {
                        result.user?.delete()
                        .then((_: any) => alert.error('Oops, user account does not exist.'))
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
                    <img src={logo} className="rounded-full w-20 overflow-hidden mb-10" alt="logo" />
                </div>
                <h2 className="font-bold text-2xl">LOGIN</h2>
                <div className="flex justify-start flex-wrap">
                    <button 
                    onClick={() => loginWithProvider('google')}
                    className="inline-flex mt-2 google w-full items-center justify-center p-2 rounded">
                        <img src={google} alt="google" style={{ width: 16 }}/>
                        <span className="ml-2 text-sm">Login with Google</span>
                    </button>
                    <button 
                    onClick={() => loginWithProvider('apple')}
                    className="inline-flex my-2 bg-black w-full items-center justify-center p-2 rounded">
                        <img src={apple} alt="apple" style={{ width: 16 }}/>
                        <span className="ml-2 text-white text-sm">Sign in with Apple</span>
                    </button>
                </div>
                <Separator 
                styles={{
                    content: {
                        background: 'inherit'
                    }
                }} className="bg-gray-50">OR</Separator>

                    <div className="mb-1">
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
                    <PrimaryButton 
                    text="Login" 
                    onClick={() => loginWithEmailAndPassword()}
                    className="mt-5 w-full"
                    allowDisabledFocus 
                    disabled={false}/>
            </div>
        </div>
        </>
    )
}


