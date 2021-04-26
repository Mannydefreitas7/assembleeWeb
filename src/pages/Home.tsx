
import React, { useEffect } from 'react';
import firebase from "firebase/app";
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from "react-router-dom";
import Board from './Board';
import Login from './Login';
import Admin from './Admin';

export default function Home() {

    useEffect(() => {
        if (!firebase.auth().currentUser) {
            signIn() 
        } else {
            console.log(firebase.auth().currentUser)
        }
    }, [])

    const signIn = async () => {
        return await firebase.auth().signInAnonymously();
    }  
    const auth = firebase.auth()
    const [ user ] = useAuthState(auth);

    return (
        <>
        <Router>
            <Switch>
            <Route path="/" exact={true}>
                <Board />
            </Route>
            <Route path="/admin" exact={true}>
                {
                    user && user?.isAnonymous ? 
                    <Redirect to="/" exact={true} /> :
                    <Admin />
                }
            </Route>
            <Route path="/login" exact={true}>
                <Login />
            </Route>
            </Switch>
        </Router>
        </>
    )
}
