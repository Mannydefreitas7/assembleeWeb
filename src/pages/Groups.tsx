import {
    DefaultButton,
    Icon,
    Persona,
    PersonaInitialsColor,
    PersonaSize,
    Spinner,
    TextField,
} from "@fluentui/react";
import React, { useContext } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { CONG_ID } from "../constants";
import { GlobalContext } from "../store/GlobalState";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import { Gender, Publisher } from "../models/publisher";
import { Group } from "../models/group";

export default function Groups() {
    const { firestore, openGroupModal } = useContext(GlobalContext);
    const groupCollectionQuery = firestore.collection(
        `congregations/${CONG_ID}/groups`
    );
    const publishersCollectionQuery = firestore.collection(
        `congregations/${CONG_ID}/publishers`
    );

    const [groupCollection, groupLoading] = useCollection(groupCollectionQuery);
    const [publishersCollection, publishersCollectionLoading] = useCollection(
        publishersCollectionQuery
    );

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) {
            return;
        }
        const dInd = destination.droppableId;
        if (dInd === `droppableConcepts-${0}`) {
        }
    };

    return (
        <div className="container p-8">
            <div className="mb-2 flex justify-between items-center">
                <h1 className="font-semibold text-2xl inline-flex items-center">
                    <Icon iconName="Group" className="mr-2" /> Groups
                </h1>
                <DefaultButton onClick={openGroupModal} text="Add Group" iconProps={{ iconName: 'Add' }} />
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-row items-start">
                    <div className="mr-4">
                        <Droppable
                            key={0}
                            droppableId={`droppableId-searches`}
                            isDropDisabled={true}
                        >
                            {(provided, snapshot) => (
                                <div
                                    className=""
                                    ref={provided.innerRef}
                                >
                                    {
                                        publishersCollectionLoading ? <Spinner /> :
                                            publishersCollection && publishersCollection.docs
                                            .filter(doc => {
                                                let publisher: Publisher = {
                                                    ...doc.data()
                                                }
                                                return !publisher.groupId
                                            })
                                            .map((doc, index) => {
                                                let publisher: Publisher = {
                                                    ...doc.data()
                                                }
                                                return (<Draggable
                                                    key={publisher.uid}
                                                    draggableId={`${publisher.uid}`}
                                                    index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className={`p-2 rounded my-2 bg-white ${snapshot.isDragging ? 'shadow-lg' : 'shadow'}`}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Persona
                                                                initialsColor={
                                                                    publisher.gender === Gender.brother
                                                                        ? PersonaInitialsColor.darkBlue
                                                                        : PersonaInitialsColor.pink
                                                                }
                                                                text={`${publisher.lastName} ${publisher.firstName}`}
                                                                size={PersonaSize.size24}
                                                                secondaryText={publisher.privilege}
                                                            />

                                                        </div>
                                                    )}
                                                </Draggable>)
                                            })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                    <div className={`w-full grid grid-cols-1 auto-rows-min gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded`}>
                        {
                            groupLoading ? <Spinner /> :
                                groupCollection && groupCollection.docs.map((doc, ind) => {
                                    let group: Group = {
                                        ...doc.data()
                                    }
                                    return <>
                                        <div className="p-1">
                                            <TextField />
                                            <TextField />
                                        </div>
                                        <Droppable
                                            key={ind}
                                            droppableId={`${ind + 1}`}
                                        >
                                        {(provided, snapshot) => (
                                            <div
                                                className={`p-4 transform transition-all w-full border-2 border-dashed dark:border-gray-700 rounded ${snapshot.isDraggingOver ? 'bg-primary-50 bg-opacity-20 border-primary-100 dark:border-primary-50' : 'bg-white dark:bg-gray-900'}`}
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >

                                                <span className={`font-bold flex items-center justify-between text-primary-500 dark:text-primary-200`}>
                                                    {group.name}
                                                    <span className="text-sm px-2 py-1 text-black dark:text-white rounded-full bg-gray-50 dark:bg-gray-800">{group.number}</span>
                                                </span>
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                    </>
                                    
                                })}

                    </div>
                </div>
            </DragDropContext>

        </div>
    );
}
