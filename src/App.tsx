import React from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import { FirebaseAuthProvider } from '@react-firebase/auth';
import { FirestoreProvider } from '@react-firebase/firestore';
import 'rsuite/lib/styles/index.less';
import { config } from './constants';
import Home from './pages/Home';
import { NeutralColors } from '@fluentui/theme';

function App() {

  return (
    <div style={{ backgroundColor: NeutralColors.gray10, height: '100vh' }}>
        <FirebaseAuthProvider firebase={firebase} {...config}>
          <FirestoreProvider {...config} firebase={firebase}>
              <Home />
          </FirestoreProvider>
        </FirebaseAuthProvider>
      </div>
  );
}

export default App;
