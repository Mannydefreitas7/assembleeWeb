import React from 'react'
import {
    Route,
    useRouteMatch
  } from "react-router-dom";
import ModalView from '../components/ModalView';
import TopBar from '../components/TopBar';
import ProgramDetail from './ProgramDetail';
import Programs from './Programs';

export default function Admin() {
    let { path } = useRouteMatch();
    return (
        <div>
            <TopBar />
                <div className="pt-10">
                    <Route path={path} exact>
                        ADMIN
                    </Route>
                    <Route path={`${path}/programs`} exact >
                        <Programs />
                    </Route>
                    <Route path={`${path}/programs/:id`} >
                        <ProgramDetail />
                    </Route>
                    <Route path={path + '/publishers'} >
                        <h1>PUBLISHERS</h1>
                    </Route>
                    <Route path={path + '/speakers'}>
                        <h1>SPEAKERS</h1>
                    </Route>
                </div>
                <ModalView titleId={path} />
        </div>
    )
}
