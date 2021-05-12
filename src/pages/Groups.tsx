import {
    DefaultButton,
    Icon,
    Persona,
    PersonaInitialsColor,
    PersonaSize,
    Spinner,
    Text,
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
    ).orderBy('number');
    const publishersCollectionQuery = firestore.collection(
        `congregations/${CONG_ID}/publishers`
    ).orderBy('lastName');

    const [groupCollection, groupLoading] = useCollection(groupCollectionQuery);
    const [publishersCollection, publishersCollectionLoading] = useCollection(
        publishersCollectionQuery
    );

    const onDragEnd = async (result: DropResult) => {
        try {
            const { source, destination, draggableId } = result;     
            if (!destination) {
                return;
            }
            const destId = destination.droppableId;
            const srcId = source.droppableId;
            if (srcId === `droppable-publishers`) {
                await firestore.doc(`congregations/${CONG_ID}/publishers/${draggableId}`).update({ groupId: destId })
            }
        } catch (error) { console.log(error) }
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
                            droppableId={`droppable-publishers`}
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
                    <div className={`w-full grid grid-cols-4 auto-rows-min gap-4 mt-2 bg-gray-50 rounded`}>
                        {
                            groupLoading ? <Spinner /> :
                                groupCollection && groupCollection.docs.map((doc, ind) => {
                                    let group: Group = {
                                        ...doc.data()
                                    }
                                    return <Droppable
                                            key={group.id}
                                            ignoreContainerClipping={true}
                                            mode={'standard'}
                                            droppableId={`${group.id}`}>
                                            {(provided, snapshot) => (
                                                
                                    <div 
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{ zIndex: 0, position: 'relative' }}
                                    className={`bg-gray-100 rounded px-3 py-2 transform transition-all w-full border-2 border-dashed dark:border-gray-700 ${snapshot.isDraggingOver ? 'border-green-200 bg-green-50' : 'dark:bg-gray-900'}`}>
                                     
                                        <div className="p-1">
                                            <Text className="font-bold text-lg block">{group.name}</Text>
                                            <Text className="text-sm block text-gray-600 font-semibold">{group.address}</Text>
                                            <Text className="text-sm text-gray-600">{group.description}</Text>
                                        </div>
                                            {
                                                publishersCollectionLoading ? <Spinner /> :
                                                publishersCollection && publishersCollection.docs
                                                .filter(doc => {
                                                    let publisher: Publisher = doc.data();
                                                    return publisher.groupId === group.id
                                                })
                                                .map((doc, index) => {
                                                    let publisher: Publisher = doc.data();
                                                    return (<Draggable
                                                        key={publisher.uid}
                                                        draggableId={`${publisher.uid}`}
                                                        index={index}
                                                        >
                                                        {(childProvided, childSnapshot) => {
                                                            return (<div
                                                                className={`p-2 rounded my-2 bg-white ${childSnapshot.isDragging ? 'shadow-lg' : 'shadow-none'}`}
                                                              
                                                                ref={childProvided.innerRef}
                                                                {...childProvided.draggableProps}
                                                                {...childProvided.dragHandleProps}
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
                                                            </div>)  
                                                        }}
                                                    </Draggable>) 
                                                })}
                                           {provided.placeholder}
                                    </div>
                                    )}
                                    </Droppable>
                                })}
                    </div>
                </div>
            </DragDropContext>

        </div>
    );
}
