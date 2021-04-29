import { ActionButton, Spinner, SpinnerSize } from '@fluentui/react';
import React, { useContext } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { CONG_ID } from '../constants';
import { WeekProgram } from '../models/wol';
import { GlobalContext } from '../store/GlobalState';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link, useRouteMatch } from 'react-router-dom';
import PublisherTile from '../components/PublisherTile';
import { Publisher } from '../models/publisher';

export default function Publishers() {
    const { firestore, openPublisherModal } = useContext(GlobalContext)
    const [ value, loading ] = useCollection(firestore.collection(`congregations/${CONG_ID}/publishers`).orderBy('lastName'))
    let { path } = useRouteMatch();
    return (
        <div className="container mx-auto p-8">
            <div className="mb-2 flex justify-between items-center">
                <h1 className="font-semibold text-2xl inline-flex items-center"> <Icon iconName="People" className="mr-2"/>Publishers</h1>
                <ActionButton 
                onClick={openPublisherModal}
                iconProps={{ iconName: 'AddFriend' }} allowDisabledFocus>
                    Add Publisher
                </ActionButton>
            </div>
            {
                loading ? <Spinner className="pt-10" size={SpinnerSize.large} /> :
                value?.docs.map(data => {
                    let publisher : Publisher = data.data() 
                    return (
                        <Link 
                        to={`${path}/${publisher.uid}`}
                        key={publisher.uid}
                        className="px-4 py-3 bg-white text-black my-2 flex items-center hover:bg-gray-10 hover:bg-opacity-50 cursor-pointer">
                            <PublisherTile publisher={publisher} />
                        </Link>
                    )
                })
            }
        </div>
    )
}
