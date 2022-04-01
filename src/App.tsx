import React from 'react';
import './App.css';
import Home from './routes/Home';
import { transitions, Provider as AlertProvider } from 'react-alert'
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { config } from './constants';
import AlertTemplate from './components/alert/Alert';
import { ThemeProvider, loadTheme } from '@fluentui/react';
import { dark } from './theme/dark';
import { useThemeDetector } from './shared/hooks';
import { light } from './theme/light';

const App = () => {

  const firebaseApp = initializeApp(config);
  const firestore = getFirestore(firebaseApp);
  const functions = getFunctions(firebaseApp);
  const auth = getAuth(firebaseApp);
  const lightTheme = loadTheme(light);
  const darkTheme = loadTheme(dark);
  const isDark = useThemeDetector();

  if (process.env.NODE_ENV === 'development') {
      connectAuthEmulator(auth, "http://localhost:9099");
      connectFirestoreEmulator(firestore, "localhost", 8080);
      connectFunctionsEmulator(functions, "localhost", 5001);
  }

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <AlertProvider
        offset='30px'
        timeout={5000}
        transition={transitions.SCALE}
        template={AlertTemplate}>
        <Home />
      </AlertProvider>
    </ThemeProvider>
  )
}

export default App;
