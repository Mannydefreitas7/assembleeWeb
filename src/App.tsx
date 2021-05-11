import React from 'react';
import './App.css';
import Home from './pages/Home';
import {Helmet} from "react-helmet";
import { GlobalProvider } from './store/GlobalState';

import { transitions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from './components/message/Alert'

function App() {
  return (
    <AlertProvider
    offset='30px'
    timeout={5000}
    transition={transitions.SCALE}
    template={AlertTemplate}>
      <GlobalProvider>
        <Helmet>
            <title>West Hudson French - Airmont NY (USA)</title>
            <body className="bg-gray-50" />
        </Helmet>
        <Home />
      </GlobalProvider>
    </AlertProvider>
  );
}

export default App;
