
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

export default function Home() {

    const { auth } = useContext(GlobalContext)
    const [ user ] = useAuthState(auth);

    const signIn = () => {
        try {
            auth.signInAnonymously()
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
            <Route 
                path="/admin" 
                component={Admin} 
                strict={(!user?.isAnonymous)}>
            </Route>
            <Route path="/login">
                <Login />
            </Route>
            </Switch>
        </Router>
        </>
    )
}
