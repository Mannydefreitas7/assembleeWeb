import React, { useContext } from 'react'
import {
    useRouteMatch
} from "react-router-dom";
import BottomBar from '../components/BottomBar';
import ModalView from '../components/ModalView';
import ProtectedRoute from '../components/ProtectedRoute';
import TopBar from '../components/TopBar';
import UserView from '../components/UserView';
import { GlobalContext } from '../store/GlobalState';
import Dashboard from './Dashboard';
import Groups from './Groups';
import ProgramDetail from './ProgramDetail';
import Programs from './Programs';
import PublisherDetail from './PublisherDetail';
import Publishers from './Publishers';
import Service from './Service';
import SpeakerDetail from './SpeakerDetail';
import Speakers from './Speakers';


export default function Admin() {
    let { path } = useRouteMatch();
    const { isMobile } = useContext(GlobalContext)

    return (
        <div>
            {
                isMobile ? <BottomBar /> :
                <TopBar />
            }
            <div className={isMobile ? '' : 'pt-12'}>
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
                    exact={true}
                    redirectTo="/login"
                    path={path + '/speakers'}>
                    <Speakers />
                </ProtectedRoute>
                <ProtectedRoute
                    exact={false}
                    redirectTo="/login"
                    path={path + '/speakers/:id'}>
                    <SpeakerDetail />
                </ProtectedRoute>
                <ProtectedRoute
                    exact={false}
                    redirectTo="/login"
                    path={path + '/groups'}>
                    <Groups />
                </ProtectedRoute>
                <ProtectedRoute
                    exact={false}
                    redirectTo="/login"
                    path={path + '/service'}>
                    <Service />
                </ProtectedRoute>
            </div>
            <ModalView titleId={path} />
        </div>
    )
}
