import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { InitialState } from '../models/initialState';
import reducer from './AppReducer';
import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'
import talks from './../assets/talks.json';

import {
    CHANGE_WEEK,
    SELECT_PUBLISHER,
    VIEW_PUBLISHER_PARTS,
    ADD_PROGRAM,
    OPEN_PUBLISHER_MODAL,
    OPEN_EXPORT_MODAL,
    INITIAL_LOAD,
    OPEN_RENAME_MODAL,
    RELOAD_WEEKS,
    OPEN_SPEAKER_MODAL,
    OPEN_GROUP_MODAL,
    EDIT_GROUP_MODAL,
    LOAD_TALKS
} from './ActionTypes';
import { Part, PartType, WeekProgram } from '../models/wol';
import { config, CONG_ID } from '../constants';
import { IDropdownOption } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { Publisher, Talk } from '../models/publisher';
import { Congregation, FireLanguage } from '../models/congregation';
import AddProgramView from '../components/AddProgramView';
import ExportOptionsView from '../components/ExportOptionsView';
import RenamePartView from '../components/RenamePartView';
import AddPublisherView from '../components/AddPublisherView';
import AddSpeakerView from '../components/AddSpeakerView';
import { useMediaQuery } from 'react-responsive';
import AddGroupView from '../components/AddGroupView';
import EditGroupView from '../components/EditGroupView';


type GlobalProps = {
    children: ReactNode
}

const _firebase: firebase.app.App = firebase.apps.length === 0 ? firebase.initializeApp(config) : firebase.app()
if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line
    let congregation: Congregation = {
        id: '0927216B-2451-4AB5-AD08-11AC5777CCB1',
        fireLanguage: {
            apiURL: "wol/dt/r30/lp-f/",
            languageCode: "F"
        },
        language: {
            isSignLanguage: false,
            languageCode: 'F',
            languageName: 'Francais',
            scriptDirection: 'LTR',
            writtenLanguageCode: ['fr']
        },
        properties: {
            orgName: 'West Hudson French - NY (USA)',
            orgGuid: '0927216B-2451-4AB5-AD08-11AC5777CCB1'
        }
    }
    // eslint-disable-next-line
    let language: FireLanguage = {
        apiURL: 'wol/dt/r30/lp-f/',
        languageCode: 'F'
    }
    // eslint-disable-next-line
    let _talks : Talk[] = talks.map(t => {
        return {
            id: `${t.DocumentId}`,
            number: t.DocumentId + 1,
            timeStamp: new Date(),
            title: t.Title
        }
    })


  //  _firebase.functions().useEmulator("localhost", 5001)
  //  _firebase.firestore().useEmulator("localhost", 8080)
  //  _firebase.auth().useEmulator("http://localhost:9099");
  //  _firebase.firestore().doc(`congregations/${congregation.id}`).set(congregation);
  //  _firebase.firestore().doc(`languages/${language.languageCode}`).set(language);
    // _talks.forEach(talk => {
    //     _firebase.firestore().doc(`languages/${language.languageCode}/talks/${talk.id}`).set(talk)
    // })
}
 

const initialState: InitialState = {
    parts: [],
    weeks: [],
    auth: _firebase.auth(),
    firestore: _firebase.firestore(),
    functions: _firebase.functions(),
    storage: _firebase.storage(),
    week: {},
    congregation: {},
    part: {},
    publisher: {},
    loading: true,
    isPanelOpen: false,
    changeWeek: null,
    type: PartType.assignee,
    openPanel: null,
    dismissPanel: null,
    isModalOpen: false,
    selectPublisher: null,
    openModal: null,
    isMobile: false,
    dismissModal: null,
    modalChildren: null,
    viewPublisherParts: null,
    assignPublisher: null,
    addProgram: null,
    openPublisherModal: null,
    openExportModal: null,
    user: {},
    listener: null,
    openRenameModal: null,
    reloadWeeks: null,
    openSpeakerModal: null,
    openGroupModal: null,
    talks: [],
    openEditGroupModal: null,
    loadTalks: null
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = (props: GlobalProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const [isModalOpen, { setTrue: openModal, setFalse: dismissModal }] = useBoolean(false);
    const isMobile = useMediaQuery({ maxWidth: 767 })
    useEffect(() => {
        load();
        return () => { 
            if (state.user.uid) {
                let query = state.firestore.doc(`users/${state.user.uid}`);
                query.update({ isOnline: false })
            }
            if (state.listener) state.listener()
         }
    // eslint-disable-next-line
    }, [])

    const load = async () => {
        try {
            let congregationDoc = await _firebase.firestore().doc(`congregations/${CONG_ID}`).get();
             
            let _weeks = await _firebase.firestore()
            .collection(`congregations/${CONG_ID}/weeks`)
            .limit(8)
            .orderBy('date')
            .where('isSent', '==', true)
            .get();
         
            let weeks: WeekProgram[] = _weeks.docs.map(d => d.data());
            let parts: Part[] = weeks && weeks.length > 0 ? await _firebase.firestore()
            .collection(`congregations/${CONG_ID}/weeks/${weeks[0].id}/parts`)
            .orderBy('index')
            .get()
            .then(_ => _.docs.map(d => d.data())) : []

            let listener = state.auth
            .onAuthStateChanged(user => {
                console.log(user)
                dispatch({
                    type: INITIAL_LOAD,
                    payload: {
                        weeks,
                        parts,
                        congregation: congregationDoc.data(),
                        week: weeks[0],
                        user,
                        listener
                    }
                })
            })
        } catch (error) { console.log(error) }
    }

    const loadWeekParts = async (option: IDropdownOption) => {
        try {
            let parts: Part[] = await _firebase.firestore()
                .collection(`congregations/${CONG_ID}/weeks/${option.key}/parts`)
                .orderBy('index')
                .get()
                .then(_ => _.docs.map(d => d.data()))
            if (parts && parts.length > 0) {
                dispatch({
                    type: CHANGE_WEEK,
                    payload: {
                        parts,
                        week: state.weeks.filter(w => w.id === option.key)[0]
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const reloadWeeks = async () => {
        try {
            let weeks: WeekProgram[] = await state.firestore
                .collection(`congregations/${CONG_ID}/weeks`)
                .orderBy('date')
                .where('isSent', '==', true)
                .get()
                .then(_ => _.docs.map(d => d.data()))
            if (weeks && weeks.length > 0) {
                dispatch({
                    type: RELOAD_WEEKS,
                    payload: {
                        weeks,
                        week: weeks[0]
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const changeWeek = (option: IDropdownOption) => {
        loadWeekParts(option);
    }

    const selectPublisher = (week: WeekProgram, part: Part, type: PartType, publisher?: Publisher) => {
        dispatch({
            type: SELECT_PUBLISHER,
            payload: {
                week,
                type,
                part,
                publisher
            }
        })
    }

    const loadTalks = (id: string) => {
        getTalks(id).then(options => {
            if (options)
            dispatch({
                type: LOAD_TALKS,
                payload: options
            })
        })
    }

    const addProgram = () => {
        dispatch({
            type: ADD_PROGRAM,
            payload: <AddProgramView />
        })
    }

    const openPublisherModal = () => {
        dispatch({
            type: OPEN_PUBLISHER_MODAL,
            payload: <AddPublisherView />
        })
        openModal()
    }
    const openSpeakerModal = () => {
        dispatch({
            type: OPEN_SPEAKER_MODAL,
            payload: <AddSpeakerView />
        })
        openModal()
    }

    const openGroupModal = () => {
        dispatch({
            type: OPEN_GROUP_MODAL,
            payload: <AddGroupView />
        })
        openModal()
    }
    const openEditGroupModal = (id: string) => {
        dispatch({
            type: EDIT_GROUP_MODAL,
            payload:  <EditGroupView id={id} />
        })
        openModal()
    }

    

    const openExportModal = () => {
        dispatch({
            type: OPEN_EXPORT_MODAL,
            payload: <ExportOptionsView />
        })
        openModal()
    }

    const openRenameModal = (part : Part) => {
        dispatch({
            type: OPEN_RENAME_MODAL,
            payload: <RenamePartView part={part} />
        })
        openModal()
    }

    const getTalks = async (id: string) => {
        let talks : IDropdownOption[] = [];
        try {
            const publisherQuery = state.firestore.doc(`congregations/${CONG_ID}/publishers/${id}`);
            const isPublisher = (await publisherQuery.get()).exists
            if (isPublisher) {
                const talksCollection = await state.firestore.collection(`congregations/${CONG_ID}/publishers/${id}/talks`).get()
                talks = [
                    ...talksCollection.docs.map(doc => {
                        let talk : Talk = doc.data();
                        return {
                            key: talk.id ?? '',
                            text: talk.title ?? ''
                        }
                    })
                ]
                return talks;
            } else {
                const talksCollection = await state.firestore.collection(`congregations/${CONG_ID}/speakers/${id}/talks`).get()
                talks = [
                    ...talksCollection.docs.map(doc => {
                        let talk : Talk = doc.data();
                        return {
                            key: talk.id ?? '',
                            text: talk.title ?? ''
                        }
                    })
                ]
                return talks;
            }
        } catch (error) { console.log(error) }
        return talks
    }

    async function assignPublisher(week: WeekProgram, part: Part, newPublisher: Publisher, type: PartType, oldPublisher?: Publisher) {
        try {
            const partDocument = state.firestore.doc(`congregations/${CONG_ID}/weeks/${week.id}/parts/${part.id}`);
            if (oldPublisher && oldPublisher.uid !== newPublisher.uid) {
                state.firestore.doc(`congregations/${CONG_ID}/publishers/${oldPublisher.uid}/parts/${part.id}`).delete();
            } else {
                state.firestore.doc(`congregations/${CONG_ID}/publishers/${newPublisher.uid}/parts/${part.id}`)
                .set(part)
            }
            if (type === PartType.assignee) {
                partDocument.update({
                    assignee: newPublisher
                }).then(dismissPanel)
            } else {
                partDocument.update({
                    assistant: newPublisher
                }).then(dismissPanel)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const viewPublisherParts = (component: ReactNode) => {
        dispatch({
            type: VIEW_PUBLISHER_PARTS,
            payload: component
        })
    }



    return (
        <GlobalContext.Provider value={{
            listener: state.listener,
            parts: state.parts,
            weeks: state.weeks,
            storage: state.storage,
            part: state.part,
            publisher: state.publisher,
            firestore: state.firestore,
            functions: state.functions,
            auth: state.auth,
            congregation: state.congregation,
            week: state.week,
            isPanelOpen: isOpen,
            dismissPanel,
            openPanel,
            openModal,
            dismissModal,
            openGroupModal,
            isModalOpen: isModalOpen,
            loading: state.loading,
            changeWeek,
            selectPublisher,
            type: state.type,
            isMobile: isMobile,
            user: state.user,
            modalChildren: state.modalChildren,
            viewPublisherParts,
            assignPublisher,
            addProgram,
            openPublisherModal,
            openExportModal,
            openRenameModal,
            reloadWeeks,
            openSpeakerModal,
            openEditGroupModal,
            talks: state.talks,
            loadTalks
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}
