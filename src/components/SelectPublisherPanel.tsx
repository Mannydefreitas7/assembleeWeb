import { ActionButton, DefaultButton, Panel, PanelType, SearchBox, Spinner, SpinnerSize, Text } from '@fluentui/react';
import React, { useContext, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { Route, useHistory, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { CONG_ID } from '../constants';
import { Privilege, Publisher } from '../models/publisher';
import { GlobalContext } from '../store/GlobalState'
import PartTile from './PartTile';
import PublisherPartsView from './PublisherPartsView';
import PublisherTile from './PublisherTile';

export default function SelectPublisherPanel() {
    const { firestore, dismissPanel, isPanelOpen, week, part, publisher, assignPublisher, type } = useContext(GlobalContext)
    let { path, url } = useRouteMatch();
    const [publishersCollection, publishersLoading] = useCollection(firestore.collection(`congregations/${CONG_ID}/publishers`)
    .orderBy('lastName').where('privilege', 'in', (part?.privilege?.length ?? 0) > 0 ? part.privilege : [Privilege.pub]));
    const [search, setSearch] = useState('');
    let history = useHistory();

    return (
        <div>
            <Panel
                isOpen={isPanelOpen}
                onDismiss={dismissPanel}
                type={PanelType.extraLarge}
                closeButtonAriaLabel="Close"
                isLightDismiss={false}
                headerText="Select Publisher"
            >
                <p className="mb-5">{week?.range ?? ""}</p>
                <PartTile part={part} publisher={publisher} />
                {
                   publishersCollection?.docs && publishersCollection?.docs.map(p => p.data()).length > 0 ?
                    <SearchBox
                    className="mt-5"
                    placeholder="Search Publishers" onKeyDown={(newValue) => setSearch(newValue.currentTarget.value)} /> : null
                }
                
                {
                    publishersLoading ? <Spinner className="pt-10" size={SpinnerSize.large} /> :
                        publishersCollection?.docs
                            .filter(p => {
                                let _: Publisher = {
                                    ...p.data()
                                }
                                return part.privilege?.includes(_.privilege ?? Privilege.pub) && _.lastName?.toLowerCase().includes(search.toLowerCase())
                            })
                            .map(newPublisher => {
                                return (
                                    <div key={newPublisher.id}>
                                        <Route path={path} exact>
                                            <div className="flex justify-between items-center bg-gray-50 pr-4 my-2 rounded" >
                                                <PublisherTile publisher={newPublisher.data()} />
                                                <div className="inline-flex items-center">
                                                    <Link
                                                        to={`${url}/publishers/${newPublisher.id}/parts`}>
                                                        <Text className="mr-5 text-green-700">See Parts</Text>
                                                    </Link>
                                                    <DefaultButton text="Select" onClick={() => {
                                                        assignPublisher(week, part, newPublisher.data(), type, publisher)
                                                     }} allowDisabledFocus />
                                                </div>
                                            </div>
                                        </Route>
                                        <Route path={`${path}/publishers/${newPublisher.id}/parts`}>
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-xl mt-5 mb-2">
                                                    <ActionButton
                                                        className="font-normal text-base"
                                                        onClick={() => history.goBack()}
                                                        iconProps={{ iconName: 'ChromeBack' }} allowDisabledFocus>
                                                        Publishers</ActionButton> <br />
                                                    {`${newPublisher.data().lastName}, ${newPublisher.data().firstName} Parts`}
                                                </h3>
                                                <DefaultButton text="Select" onClick={() => {
                                                      assignPublisher(week, part, newPublisher.data(), type, publisher)
                                                 }} allowDisabledFocus />
                                            </div>
                                            <PublisherPartsView publisher={newPublisher.data()} />
                                        </Route>
                                    </div>
                                )
                            })
                }
            </Panel>
        </div>
    )
}
