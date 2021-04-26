
import React, { useEffect } from 'react';
import firebase from "firebase/app";
import {
    BrowserRouter as Router,
    Switch,
    Route
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
        return await firebase.auth().signInAnonymously();
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
