
import React, { useContext, useEffect } from 'react';
import firebase from "firebase/app";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Board from './Board';

export default function Home() {

    useEffect(() => {
        if (!firebase.auth().currentUser) {
            signIn() 
        } else {
            console.log(firebase.auth().currentUser)
        }
    }, [])

    const signIn = async () => {
        let anonymousResult = await firebase.auth().signInAnonymously();
        if (anonymousResult) console.log(anonymousResult.user)
    }   

    return (
        <>
        <Router>
            <Switch>
            <Route path="/" exact={true}>
                <Board />
            </Route>
            </Switch>
        </Router>
        </>
    )
}
