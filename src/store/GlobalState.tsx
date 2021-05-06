import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { InitialState } from '../models/initialState';
import reducer from './AppReducer';
import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

import {
    CHANGE_WEEK,
    SELECT_PUBLISHER,
    VIEW_PUBLISHER_PARTS,
    ADD_PROGRAM,
    OPEN_PUBLISHER_MODAL,
    OPEN_EXPORT_MODAL,
    INITIAL_LOAD,
    OPEN_RENAME_MODAL,
    RELOAD_WEEKS
} from './ActionTypes';
import { Part, PartType, WeekProgram } from '../models/wol';
import { config, CONG_ID } from '../constants';
import { IDropdownOption } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { Publisher } from '../models/publisher';
import { Congregation } from '../models/congregation';
import AddProgramView from '../components/AddProgramView';
import AddPublisherView from '../components/AddPublisherView';
import ExportOptionsView from '../components/ExportOptionsView';
import RenamePartView from '../components/RenamePartView';

type GlobalProps = {
    children: ReactNode
}


const _firebase = firebase.initializeApp(config)
if (process.env.NODE_ENV === 'development') {
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

    _firebase.functions().useEmulator("localhost", 5001)
    _firebase.firestore().useEmulator("localhost", 8080)
    _firebase.auth().useEmulator("http://localhost:9099");
    _firebase.firestore().doc(`congregations/${congregation.id}`).set(congregation);
  //  let provider = new firebase.auth.GoogleAuthProvider()
  //  _firebase.auth().signInWithPopup(provider)
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
    reloadWeeks: null
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = (props: GlobalProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const [isModalOpen, { setTrue: openModal, setFalse: dismissModal }] = useBoolean(false);
 //   const deleteAllAnymomous = state.functions.httpsCallable('deleteAllAnymomous')
    useEffect(() => {
        load();
        return () => { 
            if (state.listener) state.listener()
         }
    // eslint-disable-next-line
    }, [])

    const load = async () => {
        try {
            let congregation : Congregation =  await _firebase.firestore().doc(`congregations/${CONG_ID}`).get();
             
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
                        congregation,
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
            isModalOpen: isModalOpen,
            loading: state.loading,
            changeWeek,
            selectPublisher,
            type: state.type,
            user: state.user,
            modalChildren: state.modalChildren,
            viewPublisherParts,
            assignPublisher,
            addProgram,
            openPublisherModal,
            openExportModal,
            openRenameModal,
            reloadWeeks
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}
