import React from 'react'
import {
    useRouteMatch
} from "react-router-dom";
import ModalView from '../components/ModalView';
import ProtectedRoute from '../components/ProtectedRoute';
import TopBar from '../components/TopBar';
import UserView from '../components/UserView';
import Dashboard from './Dashboard';
import ProgramDetail from './ProgramDetail';
import Programs from './Programs';
import PublisherDetail from './PublisherDetail';
import Publishers from './Publishers';
import Speakers from './Speakers';


export default function Admin() {
    let { path } = useRouteMatch();

    return (
        <div>
            <TopBar />
            <div className="pt-10">
                <ProtectedRoute
                    exact={true}
                    redirectTo="/login"
                    path={path}>
                    <Dashboard />
                    </ProtectedRoute>
                <ProtectedRoute
                    exact={true}
                    redirectTo="/login"
                    path={`${path}/programs`}>
                    <Programs />
                </ProtectedRoute>

                <ProtectedRoute
                    exact={false}
                    redirectTo="/login"
                    path={`${path}/programs/:id`} >
                    <ProgramDetail />
                </ProtectedRoute>
                <ProtectedRoute
                    exact={false}
                    redirectTo="/login"
                    path={`${path}/me`} >
                    <UserView />
                </ProtectedRoute>
                <ProtectedRoute
                    exact={true}
                    redirectTo="/login"
                    path={path + '/publishers'} >
                    <Publishers />
                </ProtectedRoute>
                <ProtectedRoute
                    exact={false}
                    redirectTo="/login"
                    path={path + '/publishers/:id'} >
                    <PublisherDetail />
                </ProtectedRoute>
                <ProtectedRoute
                    exact={false}
                    redirectTo="/login"
                    path={path + '/speakers'}>
                    <Speakers />
                </ProtectedRoute>
            </div>
            <ModalView titleId={path} />
        </div>
    )
}
