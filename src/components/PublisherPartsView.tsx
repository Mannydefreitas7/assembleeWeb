import { ActionButton, Spinner, SpinnerSize } from '@fluentui/react';
import React, { useContext } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { useHistory } from 'react-router';
import { CONG_ID } from '../constants';
import { Publisher } from '../models/publisher';
import { Part } from '../models/wol';
import { GlobalContext } from '../store/GlobalState'
import SmallPartTile from './SmallPartTile';

export default function PublisherPartsView({ publisher }: { publisher: Publisher }) {

    const { firestore } = useContext(GlobalContext)
    const [collection, loading, _error] = useCollection(firestore.collection(`congregations/${CONG_ID}/publishers/${publisher.uid}/parts`).orderBy('date'));
    console.log(_error)
    let history = useHistory();
    return (
        <div>
            <h3 className="font-semibold text-xl mt-5 mb-2">
                <ActionButton
                    className="font-normal text-base"
                    onClick={() => history.goBack()}
                    iconProps={{ iconName: 'ChromeBack' }} allowDisabledFocus>
                    Publishers
                            </ActionButton> <br />
                {`${publisher.lastName}, ${publisher.firstName} Parts`}
            </h3>
            {
                loading ? <Spinner className="pt-10" size={SpinnerSize.large} /> :
                    collection?.docs.map(part => {
                        let _part: Part = {
                            ...part.data()
                        }
                        return (
                            <div key={_part.id}>
                                <SmallPartTile part={_part}/>
                            </div>
                        )
                    })
            }
        </div>
    )
}
