import { Text, TextField } from '@fluentui/react'
import React, { useState } from 'react'

export default function Setup() {

  const [password, setPassword] = useState();


  return (
    <div className="container mx-auto pb-10 pt-4 px-4">
        <div className="flex justify-between items-center">
          <Text className="leading-5 my-5 font-bold text-gray-400">
          Welcome to Assemblee<br/>
            <span className="text-2xl text-black">Set up your account</span>
          </Text>
        </div>
        <div className="w-96">
            <Text className='font-bold text-md border-b-2 block pb-2 mb-2'>About You</Text>
            
            <TextField label='First Name' />
            <TextField label='Last Name' />

            <TextField label='Email' />

            <Text className='font-bold text-md border-b-2 block pb-2 my-3'>Congregation</Text>

            <TextField label='City' /> <TextField label='City' />
            <TextField label='Cong Number' />
        </div>
        
    </div>
  )
}
