import React, { ReactNode, useContext } from 'react'
import { Route, Redirect } from 'react-router-dom';
import { GlobalContext } from '../store/GlobalState';
import { useAuthState } from 'react-firebase-hooks/auth';

type ProtectedRouteProps = {
    children: ReactNode,
    redirectTo: string,
    path: string,
    exact: boolean
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
    const {  auth } = useContext(GlobalContext)
    const [ userAuth ] = useAuthState(auth)
        if (userAuth && !userAuth.isAnonymous) {
            return (
                <Route strict={true} sensitive={true} exact={props.exact} path={props.path}>{props.children}</Route>
            )
        } else {
            return (<Redirect to={props.redirectTo} />)
        }

}
