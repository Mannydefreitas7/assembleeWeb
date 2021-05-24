import { Persona, PersonaInitialsColor, SearchBox, Spinner } from '@fluentui/react'
import React, { useContext, useState } from 'react'
import { useAlert } from 'react-alert'
import {  useCollectionOnce } from 'react-firebase-hooks/firestore'
import { CONG_ID } from '../constants'
import { Publisher, Speaker, Talk } from '../models/publisher'
import { GlobalContext } from '../store/GlobalState'
import PublisherTile from './PublisherTile'
import TalkTile from './TalkTile'

export default function SelectTalkOutlineView({ publisher, speaker, onDismiss }: {publisher?: Publisher, speaker?: Speaker, onDismiss: () => void}) {

    const { firestore, congregation } = useContext(GlobalContext)
    const collectionQuery = firestore.collection(`languages/${congregation.fireLanguage?.languageCode}/talks`).orderBy('number')
    const [talksCollection, talksCollectionLoading] = useCollectionOnce(collectionQuery)
    const [search, setSearch] = useState<string>('');
    const alert = useAlert()

    const addTalkToPublisher = (talk: Talk) => {
        if (publisher) {
           return firestore.doc(`congregations/${CONG_ID}/publishers/${publisher.uid}/talks/${talk.id}`)
           .set(talk)
           .then(() => onDismiss())
           .then(() => alert.success('Talk added successfully'))
           .catch((error) => alert.error(`Error: ${error}`))
        }
        if (speaker) {
            return firestore.doc(`congregations/${CONG_ID}/speakers/${speaker.id}/talks/${talk.id}`)
            .set(talk)
            .then(() => onDismiss())
            .then(() => alert.success('Talk added successfully'))
            .catch((error) => alert.error(`Error: ${error}`))
        }
    }

    return (
        <div>
            <p className="mb-5"></p>
            {
                publisher ? <PublisherTile publisher={publisher}/> : null
            }
            {
                speaker ? <Persona
                text={`${speaker.lastName} ${speaker.firstName}`}
                secondaryText={speaker.congregation?.properties?.orgName?.toUpperCase()}
                tertiaryText={speaker.email}
                initialsColor={PersonaInitialsColor.darkGreen}
            /> : null
            }
           
            {
                   talksCollection && talksCollection.docs.length > 0 ?
                    <SearchBox
                    className="mt-5"
                    placeholder="Search Talk Outline" onKeyDown={(newValue) => setSearch(newValue.currentTarget.value)} /> : null
            }
            {
                talksCollectionLoading ? <Spinner label="Please wait..."/> :
                talksCollection && talksCollection.docs
                .filter(doc => {
                    let talk : Talk = {
                        ...doc.data()
                    }
                    return talk.title?.toLowerCase().includes(search.toLowerCase())
                })
                .map(doc => {
                    let talk : Talk = {
                        ...doc.data()
                    }
                    return (
                        <TalkTile onClick={() => addTalkToPublisher(talk)} key={talk.id} talk={talk} />
                    )
                })
            }

        </div>
    )
}
