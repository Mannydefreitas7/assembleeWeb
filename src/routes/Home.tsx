import { Helmet } from "react-helmet";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
// import Board from './Board';
import Login from './Login';
// import Admin from './Admin';
// import SignUp from './SignUp';
// import ProtectedRoute from '../components/ProtectedRoute';
// import ConfirmPart from "./ConfirmPart";
// import Invite from "./Invite";
 import Setup from "./Setup";


export default function Home() {
  
    return (
        <div>
            <Helmet>
                <body className="bg-gray-50" />
            </Helmet>
            <Router>
                <Routes>
                    <Route path="/">
                        <Route index element={<Login />} />
                        <Route path='setup' element={<Setup />} />
                    </Route>
                    {/* <Route path="/board">
                       <Board />
                    </Route> */}

                    {/* <ProtectedRoute
                        path="/"
                        redirectTo="/board"
                        exact
                    >
                        <Admin />
                    </ProtectedRoute> */}

                    {/* <ProtectedRoute
                        path="/admin"
                        redirectTo="/login"
                        exact={false}
                    >
                        <Admin />
                    </ProtectedRoute> */}
                    {/* <Route path="/login">
                        <Login />
                    </Route> */}
                    {/* <Route path="/confirm">
                        <ConfirmPart />
                    </Route> */}
                    {/* <Route path='/setup'>
                        <Setup />
                    </Route>
                    <Route path="/invite">
                        <Invite />
                    </Route> */}
                    {/* {
                        process.env.NODE_ENV === 'development' ?
                            <Route path="/signup">
                                <SignUp />
                            </Route> : null
                    } */}
                </Routes>
            </Router>
        </div>
    )
}
