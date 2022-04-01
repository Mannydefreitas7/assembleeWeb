import { MessageBar, MessageBarType } from '@fluentui/react'
import React, { ReactNode, ReactPropTypes } from 'react'
import { AlertComponentPropsWithStyle } from 'react-alert'

/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon, ExclamationCircleIcon, QuestionMarkCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import { XIcon } from '@heroicons/react/solid'

const AlertContainer = ({children}: any) => {
  return (
    <div
    aria-live="assertive"
   // className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
  >
    <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {children}
    </div>
  </div>
  )
}

const AlertTemplate = ({ close, message, style, options } : AlertComponentPropsWithStyle) => {

  const Success = () => (
    <div className="max-w-sm w-full bg-green-50 shadow-lg rounded-lg pointer-events-auto overflow-hidden" style={style}>
      <div className="p-4">
        <div className="flex items-start">
            <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
          <div className="ml-3 pt-0.5">
            <p>{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={close}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const Info = () => (
    <div className="max-w-sm w-full bg-blue-50 shadow-lg rounded-lg pointer-events-auto overflow-hidden" style={style}>
      <div className="p-4">
        <div className="flex items-start">
            <ExclamationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
          <div className="ml-3 pt-0.5">
            <p>{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={close}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const Danger = () => (
    <div className="max-w-sm w-full bg-red-50 shadow rounded-lg pointer-events-auto overflow-hidden" style={style}>
      <div className="p-4">
        <div className="flex items-start">  
          <XCircleIcon className="h-6 w-6 text-red-700" aria-hidden="true" />
          <div className="ml-3 pt-0.5">
            <p className='text-red-700'>{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="rounded-md inline-flex text-neutral-600 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={close}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const type = () : ReactNode => {
    switch (options.type) {
      case 'success':
        return <Success />
      case 'info':
        return <Info />
      case 'error':
        return <Danger />
      default:
        return <Success />
    }
  }

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      {/* <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end"> */}

          {/* Alerts here: */}
          {/* <AlertContainer> */}
            {type()}
          {/* </AlertContainer> */}
        {/* </div>
      </div> */}
    </>
  )
}

export { AlertTemplate, AlertContainer };