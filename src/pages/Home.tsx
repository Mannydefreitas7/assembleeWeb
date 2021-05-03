
import React, { useContext, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import Board from './Board';
import Login from './Login';
import Admin from './Admin';
import { GlobalContext } from '../store/GlobalState';
import SignUp from './SignUp';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Home() {

    const { auth } = useContext(GlobalContext)
    const [ user ] = useAuthState(auth);

    const signIn = async () => {
        try {
            await auth.signInAnonymously()
        } catch (error) {
            console.log(error)
        }
    } 

    useEffect(() => {
        if (!user) {
            signIn() 
        }
    })
 

    return (
        <>
        <Router>
        <Switch>
            <Route path="/" exact>
                <Board />
            </Route>
            <ProtectedRoute 
                path="/admin" 
                redirectTo="/login"
                exact={false}
                >
                <Admin />
            </ProtectedRoute>
            <Route path="/login">
                <Login />
            </Route>
            {
                process.env.NODE_ENV === 'development' ?
                <Route path="/signup">
                    <SignUp />
                </Route> : null
            }
         
            </Switch>
        </Router>
        </>
    )
}
