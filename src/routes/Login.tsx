import React, { useState } from 'react'
import { Helmet } from "react-helmet";
import logo from './../assets/logo.jpg';
import apple from './../assets/apple.svg'
import google from './../assets/google.svg'
import { useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, getFirestore } from 'firebase/firestore'

const Login = () => {

    const auth = getAuth();
    const db = getFirestore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();
    const alert = useAlert();

    const loginWithEmailAndPassword = async (event: any) => {
        event.preventDefault();
        try {
            if (email.length > 0 && password.length > 0) {
                const newCredential = await signInWithEmailAndPassword(auth, email, password)
                if (newCredential.user) {
                    navigate("/admin")
                    alert.success('Logged In')
                }
            }
        } catch (error) { alert.error(`${error}`) }
    }

    const loginWithProvider = async (provider: string) => {
        try {
            const _provider = provider === 'google' ? new GoogleAuthProvider() : new OAuthProvider('apple');
                const result = await signInWithPopup(auth, _provider)
                if (result) {
                    const userRef = doc(db, `users/${result.user.uid}`);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        navigate("/admin", { state: userDoc.data() })
                    } else {
                        await result.user.delete()
                        alert.error('Oops, user account does not exist.');
                    }
                }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
        <Helmet>
              <html className="h-full bg-gray-50 dark:bg-neutral-900" />
              <body className="h-full" />
        </Helmet>
          <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <img
                className="mx-auto h-24 w-auto rounded-full"
                src={logo}
                alt="Workflow"
              />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 dark:text-white">Sign in to your account</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  setup your congregation account.
                </a>
              </p>
            </div>
    
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white dark:bg-neutral-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-900 rounded-md shadow-sm placeholder-neutral-200 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-neutral-700 dark:text-white"
                      />
                    </div>
                  </div>
    
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-900 rounded-md shadow-sm placeholder-neutral-200 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-neutral-700 dark:text-white"
                      />
                    </div>
                  </div>
    
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-neutral-300 dark:border-neutral-900 dark:bg-neutral-700 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-white">
                        Remember me
                      </label>
                    </div>
    
                    <div className="text-sm">
                      <a href="#" className="font-medium text-green-600 hover:text-green-500">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
    
                  <div>
                    <button
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={(e) => loginWithEmailAndPassword(e)}
                    >
                      Sign in
                    </button>
                  </div>
                </div>
    
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-300 dark:border-neutral-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500">Or continue with</span>
                    </div>
                  </div>
    
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div>
                      <a
                        onClick={() => loginWithProvider('google')}
                        className="w-full inline-flex justify-center py-2 px-4 border border-blue-500 rounded-md shadow-sm bg-blue-500 text-sm font-medium text-gray-500 hover:bg-blue-600"
                      >
                        <span className="sr-only">Sign in with Google</span>
                        <img className="w-5 h-5 dark:fill-current:text-white" src={google} />
                      </a>
                    </div>
    
                    <div>
                      <a
                        onClick={() => loginWithProvider('apple')}
                        className="w-full inline-flex justify-center py-2 px-4 border border-black rounded-md shadow-sm bg-black text-sm font-medium text-gray-500 hover:bg-neutral-900"
                      >
                        <span className="sr-only">Sign in with Apple</span>
                        <img className="w-5 h-5 dark:fill-current:text-white" src={apple} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
    )
}

export default Login;

