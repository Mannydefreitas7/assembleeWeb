import React from 'react';
import './App.css';
import Home from './routes/Home';
import { transitions, Provider as AlertProvider, positions } from 'react-alert'
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { config } from './constants';
import { AlertTemplate } from './components/alert/Alert';

const App = () => {

  const firebaseApp = initializeApp(config);
  const firestore = getFirestore(firebaseApp);
  const functions = getFunctions(firebaseApp);
  const auth = getAuth(firebaseApp);

  if (process.env.NODE_ENV === 'development') {
      connectAuthEmulator(auth, "http://localhost:9099");
      connectFirestoreEmulator(firestore, "localhost", 8080);
    //  connectFunctionsEmulator(functions, "localhost", 5001);
  }
 
  return (
      <AlertProvider
        offset='10px'
        timeout={5000}
        position={positions.TOP_RIGHT}
        transition={transitions.FADE}
        template={AlertTemplate}>
          <Home />
      </AlertProvider>
  )
}

export default App;
