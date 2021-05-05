import { Icon, Persona, PersonaPresence, PersonaSize, SharedColors } from '@fluentui/react'
import { Publisher } from '../models/publisher'
import { Parent, Part } from '../models/wol'

export default function PartTile({ part, publisher }: { part: Part, publisher?: Publisher }) {

    return (
        <div className="p-4 flex items-center justify-between bg-gray-50 border-l-2 border-green-700">
            <div className="flex items-center">
                <Icon iconName="FileComment" className="mr-6 text-2xl" />
                <div className="flex-1">
                    <div className="inline">
                        <span className="text-gray-600 text-sm">Part Title</span> <br />
                        <span className="text-base font-semibold leading-5 w-2/3">{part.title}</span> 
                       <br />
                        <div className="inline-flex items-center mt-2">
                            <span className="text-white inline-block px-2 py-1 mr-2 text-xs border font-semibold rounded-full"
                                style={{
                                    color: part.parent === Parent.apply ?
                                        SharedColors.orangeYellow10 :
                                        part.parent === Parent.life ?
                                            SharedColors.pinkRed10 :
                                            part.parent === Parent.treasures ?
                                                SharedColors.gray40 :
                                                SharedColors.gray20,
                                    borderColor: part.parent === Parent.apply ?
                                        SharedColors.orangeYellow10 :
                                        part.parent === Parent.life ?
                                            SharedColors.pinkRed10 :
                                            part.parent === Parent.treasures ?
                                                SharedColors.gray40 :
                                                SharedColors.gray20
                                }}
                            >{part.parent}</span>
                            {
                                publisher ?
                                    <div className="inline-flex items-center mr-4 bg-gray-100 p-1 rounded-full cursor-pointer" onClick={() => {}}>
                                    <Persona
                                        className={part.assignee && part.assignee.uid === publisher?.uid ? 'opacity-100' : 'bg-opacity-50'}
                                        imageUrl={publisher.photoURL ? publisher.photoURL : ''}
                                        text={`${publisher.lastName} ${publisher.firstName}`}
                                        size={PersonaSize.size24}
                                        presence={part.isConfirmed ? PersonaPresence.online : PersonaPresence.none}
                                        imageAlt={`${publisher.lastName} ${publisher.firstName}`}
                                    />
                                     <Icon iconName="StatusErrorFull" className="text-lg text-gray-500 mr-1" />
                                    </div> : null
                            }
                            {
                                part.assistant ?
                                    <Persona
                                        className={part.assistant.uid === publisher?.uid ? 'opacity-100' : 'bg-opacity-50'}
                                        imageUrl={part.assistant.photoURL ? part.assistant.photoURL : ''}
                                        text={`${part.assistant.lastName} ${part.assistant.firstName}`}
                                        size={PersonaSize.size24}
                                        presence={part.isConfirmed ? PersonaPresence.online : PersonaPresence.none}
                                        imageAlt={`${part.assistant.lastName} ${part.assistant.firstName}`}
                                    /> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
