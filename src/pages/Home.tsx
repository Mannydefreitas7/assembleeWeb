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


export default function Home() {

    return (
        <>
            <Router>
                <Switch>
                    <Route path="/" exact>
                        <Board />
                    </Route>
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
