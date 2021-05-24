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


export default function Home() {

    return (
        <>
            <Router>
                <Switch>
                    <Route path="/board">
                       <Board />
                    </Route>
                    <ProtectedRoute
                        path="/admin"
                        redirectTo="/board"
                        exact={false}
                    >
                        <Admin />
                    </ProtectedRoute>

                    <ProtectedRoute
                        path="/"
                        redirectTo="/board"
                        exact={true}
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
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/confirm">
                        <ConfirmPart />
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
