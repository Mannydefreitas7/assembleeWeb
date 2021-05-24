import { Icon, Text } from '@fluentui/react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
    return (
        <div>
            <div className="container mx-auto p-8">
            <div className="mb-2 flex justify-between items-center">
                <h1 className="font-semibold text-2xl inline-flex items-center">Welcome!</h1>
            </div>
                <Link className="p-4 bg-white hover:bg-gray-100 flex justify-between items-center rounded cursor-pointer shadow" to='/board'>
                    <div className="inline-flex items-center">
                        <Icon iconName="Questionnaire" className="mr-2 text-2xl"/>
                        <Text className="text-lg font-semibold">Board</Text>
                    </div>
                    <Icon iconName="ChevronRightMed" className="mr-2"/>
                </Link>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <Link className="p-4 bg-white hover:bg-gray-100 flex flex-col items-center justify-items-center rounded cursor-pointer shadow" to='/admin/programs'>
                        <Icon iconName="ScheduleEventAction" className="text-4xl text-gray-300 mt-4"/>
                        <Text className="text-lg font-semibold mb-4 text-gray-500">Programs</Text>
                    </Link>
                    <Link className="p-4 bg-white hover:bg-gray-100 flex flex-col items-center justify-items-center rounded cursor-pointer shadow" to='/admin/publishers'>
                        <Icon iconName="People" className="text-4xl text-gray-300 mt-4"/>
                        <Text className="text-lg font-semibold mb-4 text-gray-500">Publishers</Text>
                    </Link>
                    <Link className="p-4 bg-white hover:bg-gray-100 flex flex-col items-center justify-items-center rounded cursor-pointer shadow" to='/admin/speakers'>
                        <Icon iconName="PublishCourse" className="text-4xl text-gray-300 mt-4"/>
                        <Text className="text-lg font-semibold mb-4 text-gray-500">Speakers</Text>
                    </Link>
                    <Link className="p-4 bg-white hover:bg-gray-100 flex flex-col items-center justify-items-center rounded cursor-pointer shadow" to='/admin/groups'>
                        <Icon iconName="Group" className="text-4xl text-gray-300 mt-4"/>
                        <Text className="text-lg font-semibold mb-4 text-gray-500">Groups</Text>
                    </Link>
                    <Link className="p-4 bg-white hover:bg-gray-100 flex flex-col items-center justify-items-center rounded cursor-pointer shadow" to='/admin/service'>
                        <Icon iconName="TimeEntry" className="text-4xl text-gray-300 mt-4"/>
                        <Text className="text-lg font-semibold mb-4 text-gray-500">Service</Text>
                    </Link>
                </div>
            </div>
        </div>
    )
}
