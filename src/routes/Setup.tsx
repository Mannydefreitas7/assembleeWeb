import { PrimaryButton, Text, TextField } from '@fluentui/react'
import React, { useState } from 'react'
import { User } from '../models/user';

export default function Setup() {

  const [password, setPassword] = useState();
  const [user, serUser] = useState<User>();


  return (
    <div className="container mx-auto pb-10 pt-4 px-4">
        <div className="flex justify-between items-center">
          <Text className="leading-5 my-5 font-bold text-gray-400">
          Welcome to Assemblee<br/>
            <span className="text-2xl text-black">Set up your account</span>
            {user && user.firstName}
          </Text>
         
        </div>
        <div className="w-96">
          <form>
            <Text className='font-bold text-md border-b-2 block pb-2 mb-2'>About You</Text>
            <TextField label='First Name' type='name' value={user && user.firstName} />
            <TextField label='Last Name' type='name' value={user && user.lastName} />
            <TextField label='Email' type='email' value={user && user.email} />

            <Text className='font-bold text-md border-b-2 block pb-2 my-3'>Congregation</Text>

            <TextField label='City' /> <TextField label='City' />
            <TextField label='Cong Number' />
            <PrimaryButton text='Submit' />
          </form>
        </div>
        
    </div>
  )
}
