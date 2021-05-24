import { Icon } from '@fluentui/react'
import React from 'react'
import { Talk } from '../models/publisher'

export default function TalkTile({ talk, onClick } : { talk : Talk, onClick?: () => void }) {
    return (
        <div className="p-4 flex justify-start items-center cursor-pointer bg-gray-100 my-2 rounded hover:bg-gray-200" onClick={onClick}>
        <Icon iconName="TextDocumentShared" className="mr-6 text-lg"/>
        <div className="block">
            <span className="text-sm text-gray-500">Number {talk.number}</span> <br/>
            <span className="text-sm font-semibold">{talk.title?.toUpperCase()}</span> 
        </div>
    </div>
    )
}
