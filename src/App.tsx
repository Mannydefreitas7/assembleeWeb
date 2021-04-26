import React from 'react';
import './App.css';
import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import Home from './pages/Home';
import {Helmet} from "react-helmet";
import { config } from './constants';
import { GlobalProvider } from './store/GlobalState';

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

// const auth = firebase.auth();

function App() {
  return (
      <GlobalProvider>
        <Helmet>
            <title>West Hudson French - Airmont NY (USA)</title>
            <body className="bg-gray-50" />
        </Helmet>
        <Home />
      </GlobalProvider>
  );
}

export default App;
