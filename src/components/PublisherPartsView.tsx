import { Spinner, SpinnerSize } from '@fluentui/react';
import React, { useContext } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { CONG_ID } from '../constants';
import { Publisher } from '../models/publisher';
import { Part } from '../models/wol';
import { GlobalContext } from '../store/GlobalState'
import SmallPartTile from './SmallPartTile';

export default function PublisherPartsView({ publisher }: { publisher: Publisher }) {

    const { firestore } = useContext(GlobalContext)
    const [collection, loading] = useCollection(firestore.collection(`congregations/${CONG_ID}/publishers/${publisher.uid}/parts`).orderBy('date'));
    return (
        <div>
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
