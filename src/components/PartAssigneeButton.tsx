import { Icon } from '@fluentui/react'
import React from 'react'

export default function PartAssigneeButton({ text, action } : { text: string, action: () => void }) {
    return (
        <>
            <button 
            onClick={action}
            className="pr-4 py-1 bg-gray-50 rounded-full items-center focus:outline-none hover:bg-gray-100 inline-flex">
                <Icon iconName="AddFriend" className="mr-2 ml-3 text-gray-600"/>
                <span className="text-sm text-gray-600">{text}</span>
            </button>
        </>
    )
}
