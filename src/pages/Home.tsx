import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Board from './Board';
import Login from './Login';
import Admin from './Admin';
import SignUp from './SignUp';
import ProtectedRoute from '../components/ProtectedRoute';
import ConfirmPart from "./ConfirmPart";
import Invite from "./Invite";
import { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { GlobalContext } from "../store/GlobalState";
import Setup from "./Setup";


export default function Home() {

    const { auth } = useContext(GlobalContext)
    const [ user, loading ] = useAuthState(auth);
  
    const signIn = async () => {
        try {
            await auth.signInAnonymously()
        } catch (error) {
            console.log(error)
        }
    } 
  

    useEffect(() => { 
          if (user && !user.isAnonymous) {
            console.log('test')
              signIn() 
          }
          // eslint-disable-next-line
      }, [])

    return (
        <>
            <Router>
                <Switch>
                    <Route path="/board">
                       <Board />
                    </Route>

                    <ProtectedRoute
                        path="/"
                        redirectTo="/board"
                        exact
                    >
                        <Admin />
                    </ProtectedRoute>

                    <ProtectedRoute
                        path="/admin"
                        redirectTo="/login"
                        exact={false}
                    >
                        <Admin />
                    </ProtectedRoute>
                    <Route path="/login" exact>
                        <Login />
                    </Route>
                    <Route path="/confirm">
                        <ConfirmPart />
                    </Route>
                    <Route path='/setup'>
                        <Setup />
                    </Route>
                    <Route path="/invite">
                        <Invite />
                    </Route>
                    {
                        process.env.NODE_ENV === 'development' ?
                            <Route path="/signup">
                                <SignUp />
                            </Route> : null
                    }
                </Switch>
            </Router>
        </>
    )
}
