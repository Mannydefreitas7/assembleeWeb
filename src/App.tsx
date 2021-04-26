import React from 'react';
import './App.css';
import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import Home from './pages/Home';
import { NeutralColors } from '@fluentui/theme';
import { config } from './constants';
import { GlobalProvider } from './store/GlobalState';

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

// const auth = firebase.auth();

function App() {
  return (
    <div style={{ backgroundColor: NeutralColors.gray10, height: '100vh' }}>
      <GlobalProvider>
        <Home />
      </GlobalProvider>
    </div>
  );
}

export default App;
