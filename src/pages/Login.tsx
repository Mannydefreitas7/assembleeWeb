import { PrimaryButton, Separator, Text, TextField } from '@fluentui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from './../assets/logo.jpg'
import apple from './../assets/apple.svg'
import google from './../assets/google.svg'
import firebase from "firebase/app";
import 'firebase/auth';
import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = firebase.auth()
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

    return (
        <div className="flex h-screen w-full justify-center items-center">
            <div className="w-96 mx-auto p-10">
                <div className="w-full flex justify-center mb-5">
                    <img src={logo} className="rounded-full w-28 overflow-hidden" alt="logo" />
                </div>
                <h2 className="font-bold text-2xl">LOGIN</h2>
                <div className="flex justify-start flex-wrap">
                    <button className="inline-flex mt-2 google w-full items-center justify-center p-2">
                        <img src={google} alt="google"/>
                        <span className="ml-2">Login with Google</span>
                    </button>
                    <button className="inline-flex my-2 bg-black w-full items-center justify-center p-2">
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
                <form onSubmit={(e) => {
                    e.preventDefault()
                    if (email.length > 0 && password.length > 0) {
                        signInWithEmailAndPassword(email, password)
                    }
                }}>
                    <div className="mb-3">
                       <TextField
                        value={email}
                        label="Email"
                        type="email"
                        required/>
                    </div>
                    <TextField
                        value={password}
                        label="Password"
                        type="password"
                        canRevealPassword
                        revealPasswordAriaLabel="Show password"
                    />
                    <Link to="/">
                        <Text className="px-2 mr-4">Go Back</Text>
                    </Link>
                    <PrimaryButton 
                    text="Login" 
                    onClick={() => {}}
                    className="mt-5"
                    allowDisabledFocus 
                    disabled={false}/>
                </form>
            </div>
        </div>
    )
}
