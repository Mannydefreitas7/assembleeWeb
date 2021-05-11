import { PrimaryButton, Text, TextField } from '@fluentui/react'
import React, { FormEvent, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from './../assets/logo.jpg'
// import apple from './../assets/apple.svg'
// import google from './../assets/google.svg'
import { useHistory } from "react-router-dom";
import { GlobalContext } from '../store/GlobalState'
import { useAlert } from 'react-alert'


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
                firestore.doc(`users/${newCredential?.user?.uid}`).update({ isOnline: true })
                .then(() => history.push("/admin"))
                .then(() => alert.success('Logged In'))
                .catch(error => alert.error(`${error}`))
            }
        } catch (error) { alert.error(`${error}`) }
    }

    // const loginWithProvider = async (provider: string) => {
    //     try {
    //         const _provider = provider === 'google' ? new firebase.auth.GoogleAuthProvider() : new firebase.auth.OAuthProvider('apple');
    //             let result = await auth.signInWithPopup(_provider)
    //             if (result) {
    //                 let userDoc = await firestore.doc(`users/${result.user?.uid}`).get()
    //                 if (userDoc.exists) {
    //                     history.push("/admin")
    //                 } else {
    //                     result.user?.delete()
    //                     .then((_: any) => alert.error('Oops, user account does not exist.'))
    //                 }
    //             }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    return (
        <>
        <div className="flex h-screen w-full justify-center items-center">
            <div className="w-96 mx-auto p-10">
                <div className="w-full flex justify-center mb-5">
                    <img src={logo} className="rounded-full w-28 overflow-hidden" alt="logo" />
                </div>
                <h2 className="font-bold text-2xl">LOGIN</h2>
                {/* <div className="flex justify-start flex-wrap">
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
                </div> */}
                {/* <Separator 
                styles={{
                    content: {
                        background: 'inherit'
                    }
                }} className="bg-gray-50">OR</Separator> */}

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
                    <Link to="/">
                        <Text className="px-2 mr-4">Go Back</Text>
                    </Link>
                    <PrimaryButton 
                    text="Login" 
                    onClick={() => loginWithEmailAndPassword()}
                    className="mt-5"
                    allowDisabledFocus 
                    disabled={false}/>
            </div>
        </div>
        </>
    )
}


