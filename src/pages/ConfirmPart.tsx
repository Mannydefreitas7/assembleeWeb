import { PrimaryButton, Spinner, Text } from '@fluentui/react';
import moment from 'moment';
import React, { useContext, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { CONG_ID } from '../constants';
import { Part } from '../models/wol';
import { useQuery } from '../shared/hooks';
import { GlobalContext } from '../store/GlobalState';


export default function ConfirmPart() {

    let query = useQuery();
    const { auth, firestore } = useContext(GlobalContext);
    const [user] = useAuthState(auth);
    const docQuery = firestore.doc(`congregations/${CONG_ID}/weeks/${query.get('week')}/parts/${query.get('part')}`)
    const [partDoc, partLoading] = useDocument(docQuery)
    let part: Part = {
        ...partDoc?.data()
    }
    useEffect(() => {
        if (!user) auth.signInAnonymously()
        return () => {
            if (user) auth.signOut()
        }
    // eslint-disable-next-line
    }, [])

    const confirmPart = async () => {
        // eslint-disable-next-line
        let res = await docQuery.update({ isConfirmed: true })
    }

    // confirm?week=80397e7e-d973-4ca5-994c-f766832b2daf&part=a8150185-69a2-44b9-8a37-56aa6c2853dc

    return (
                <div className="flex justify-center items-center h-screen">
                    <div className="bg-white p-5 shadow rounded w-96">
                        <h3 className="font-bold text-center mb-4 text-xl">Meeting Assignment</h3>
                        {
                            partLoading ? <Spinner /> :
                                <div className="p-2">
                                    <p className="mb-1">
                                        <strong>Name:</strong> <span className="ms-2">{part?.assignee?.firstName} {part?.assignee?.lastName}</span>
                                    </p>
                                    <p className="mb-1">
                                        <strong>Assistant:</strong> <span className="ml-2">{part?.assistant?.firstName} {part?.assistant?.lastName}</span>
                                    </p>
                                    <p className="mb-4">
                                        <strong>Date:</strong> <span className="ml-2">{moment(part?.date?.toDate()).format('MMM d, y')}</span>
                                    </p>
                                    <p className="mb-2"><strong>Assignment</strong></p>
                                    <p className="ml-4 mb-4">{part?.title}</p>

                                    <p className="mb-2"><strong>To be given:</strong></p>
                                    <p className="ml-4 mb-4">Main Hall</p>
                                </div>
                        }
                        <hr />
                        {
                            partLoading ? <Spinner /> :
                            part.isConfirmed ? <div className="mt-4 text-center text-lg"><Text>Thank you! Your part is confirmed.</Text></div> :
                            <PrimaryButton className="block w-full mt-4" text="Confirm" onClick={confirmPart} />
                        }
                </div>
            </div>
    )
}
