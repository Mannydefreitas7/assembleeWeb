import { ActionButton, DefaultButton, Panel, PanelType, Pivot, PivotItem, SearchBox, Spinner, SpinnerSize, Text } from '@fluentui/react';
import React, { useContext, useEffect, useState } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { Route, useHistory, useParams, useRouteMatch } from 'react-router';
import { CONG_ID } from '../constants';
import { Part, WeekProgram } from '../models/wol';
import { GlobalContext } from '../store/GlobalState';
import WeekEndView from '../components/WeekEndView';
import MidWeekView from '../components/MidWeekView';
import PartTile from '../components/PartTile';
import PublisherTile from '../components/PublisherTile';
import { Privilege, Publisher } from '../models/publisher';
import PublisherPartsView from '../components/PublisherPartsView';
import { Link } from 'react-router-dom';

export default function ProgramDetail() {
    const { firestore, dismissPanel, isPanelOpen, week, part } = useContext(GlobalContext)
    const { id } = useParams<{ id: string }>();
    let { path, url } = useRouteMatch();
    const [documentSnapshot] = useDocument(firestore.doc(`congregations/${CONG_ID}/weeks/${id}`))
    const [search, setSearch] = useState('')
    const [collection, loading] = useCollection(firestore.collection(`congregations/${CONG_ID}/weeks/${id}/parts`).orderBy('index'));
    const [publishersCollection, publishersLoading] = useCollection(firestore.collection(`congregations/${CONG_ID}/publishers`).orderBy('lastName'));
    let history = useHistory();
    let document: WeekProgram = {
        ...documentSnapshot?.data()
    }

    useEffect(() => {

        return () => {

        }
    }, [])

    return (
        <div className="container mx-auto p-8">
            <div className="mb-2 flex justify-between items-center">
                <h1 className="font-bold text-2xl">
                    <ActionButton
                        className="font-bold text-base"
                        onClick={() => history.goBack()}
                        iconProps={{ iconName: 'ChromeBack' }} allowDisabledFocus>
                        Programs
                    </ActionButton> <br />
                    {document.range}
                </h1>
                <div className="inline-flex">
                    <ActionButton iconProps={{ iconName: 'DownloadDocument' }} allowDisabledFocus>
                        Download
                    </ActionButton>
                    <ActionButton
                        className="text-red-500"
                        iconProps={{ iconName: 'Delete', className: 'text-red-500 hover:text-red-900' }} allowDisabledFocus>
                        Delete
                    </ActionButton>
                </div>
            </div>
            {
                loading ? <Spinner className="pt-10" size={SpinnerSize.large} /> :
                    <div>
                        <Pivot>
                            <PivotItem headerText="Midweek">
                                <MidWeekView week={document} parts={collection?.docs.map<Part>(d => d.data()) ?? []} />
                            </PivotItem>
                            <PivotItem headerText="Weekend">
                                <WeekEndView parts={collection?.docs.map<Part>(d => d.data()) ?? []} />
                            </PivotItem>
                        </Pivot>
                        <Panel
                            isOpen={isPanelOpen}
                            onDismiss={dismissPanel}
                            type={PanelType.extraLarge}
                            closeButtonAriaLabel="Close"
                            isLightDismiss={false}
                            headerText="Select Publisher"
                        >
                            <p className="mb-5">{week.range}</p>
                            <PartTile part={part} />
                            <SearchBox
                                className="mt-5"
                                placeholder="Search Publishers" onKeyDown={(newValue) => setSearch(newValue.currentTarget.value)} />
                            {
                                publishersLoading ? <Spinner className="pt-10" size={SpinnerSize.large} /> :
                                    publishersCollection?.docs
                                        .filter(p => {
                                            let _: Publisher = {
                                                ...p.data()
                                            }
                                            return part.privilege?.includes(_.privilege ?? Privilege.pub) && _.lastName?.toLowerCase().includes(search.toLowerCase())
                                        })
                                        .map(publisher => {
                                            return (
                                                <div key={publisher.id}>
                                                    <Route path={path} exact>
                                                        <div className="flex justify-between items-center" >
                                                            <PublisherTile publisher={publisher.data()} />
                                                            <div className="inline-flex items-center">
                                                                <Link
                                                                    to={`${url}/publishers/${publisher.id}/parts`}>
                                                                    <Text className="mr-5 text-green-700">See Parts</Text>
                                                                </Link>
                                                                <DefaultButton text="Select" onClick={() => { }} allowDisabledFocus />
                                                            </div>
                                                        </div>
                                                    </Route>
                                                    <Route path={`${path}/publishers/${publisher.id}/parts`}>
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-semibold text-xl mt-5 mb-2">
                                                                <ActionButton
                                                                    className="font-normal text-base"
                                                                    onClick={() => history.goBack()}
                                                                    iconProps={{ iconName: 'ChromeBack' }} allowDisabledFocus>
                                                                    Publishers</ActionButton> <br />
                                                                {`${publisher.data().lastName}, ${publisher.data().firstName} Parts`}
                                                            </h3>
                                                            <DefaultButton text="Select" onClick={() => { }} allowDisabledFocus />
                                                        </div>
                                                        <PublisherPartsView publisher={publisher.data()} />
                                                    </Route>
                                                </div>
                                            )
                                        })
                            }
                        </Panel>
                    </div>
            }
        </div>
    )
}
