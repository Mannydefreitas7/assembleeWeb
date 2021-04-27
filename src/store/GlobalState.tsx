import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { InitialState } from '../models/initialState';
import reducer from './AppReducer';
import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import {
    LOAD_WEEKS,
    CHANGE_WEEK,
    SELECT_PUBLISHER,
    VIEW_PUBLISHER_PARTS
} from './ActionTypes';
import { Part, WeekProgram } from '../models/wol';
import { config, CONG_ID } from '../constants';
import { IDropdownOption } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { Publisher } from '../models/publisher';

type GlobalProps = {
    children: ReactNode
}


const _firebase = firebase.initializeApp(config)

const initialState: InitialState = {
    parts: [],
    weeks: [],
    auth: _firebase.auth(),
    firestore: _firebase.firestore(),
    week: {},
    part: {},
    publisher: {},
    loading: true,
    isPanelOpen: false,
    changeWeek: null,
    openPanel: null,
    dismissPanel: null,
    isModalOpen: false,
    selectPublisher: null,
    openModal: null,
    dismissModal: null,
    modalChildren: null,
    viewPublisherParts: null
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = (props: GlobalProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const [isModalOpen, { setTrue: openModal, setFalse: dismissModal }] = useBoolean(false);
    useEffect(() => {
        if (state.weeks.length === 0) {
            loadWeeks()
        }
    }, [state.weeks.length])

    const loadWeeks = async () => {
        try {
            let weeks: WeekProgram[] = await _firebase.firestore()
                .collection(`congregations/${CONG_ID}/weeks`)
                .limit(8)
                .orderBy('date')
                .where('isSent', '==', true)
                .get()
                .then(data => data.docs && data.docs.map(d => d.data()));
            if (weeks && weeks.length > 0) {
                let parts: Part[] = await _firebase.firestore()
                    .collection(`congregations/${CONG_ID}/weeks/${weeks[0].id}/parts`)
                    .orderBy('index')
                    .get()
                    .then(_ => _.docs.map(d => d.data()))
                if (parts && parts.length > 0) {
                    dispatch({
                        type: LOAD_WEEKS,
                        payload: {
                            weeks,
                            parts,
                            week: weeks[0]
                        }
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
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

    const changeWeek = (option: IDropdownOption) => {
        loadWeekParts(option); 
    }

    const selectPublisher = (week: WeekProgram, part: Part, publisher: Publisher) => {
        dispatch({
            type: SELECT_PUBLISHER,
            payload: {
                week,
                part,
                publisher 
            }
        })
    }

    const viewPublisherParts = (component: ReactNode) => {
        dispatch({
            type: VIEW_PUBLISHER_PARTS,
            payload: component
        })
    }



    return (
        <GlobalContext.Provider value={{
            parts: state.parts,
            weeks: state.weeks,
            part: state.part,
            publisher: state.publisher,
            firestore: state.firestore,
            auth: state.auth,
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
            modalChildren: state.modalChildren,
            viewPublisherParts
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}
