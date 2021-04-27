import { MessageBar, MessageBarType } from '@fluentui/react'
import React from 'react'
import { AlertComponentPropsWithStyle } from 'react-alert'

export default function AlertTemplate({ close, message, style, options } : AlertComponentPropsWithStyle) : any {
  const type = () : MessageBarType => {
    switch (options.type) {
      case 'success':
        return MessageBarType.success
      case 'info':
        return MessageBarType.info
      case 'error':
        return MessageBarType.error
      default:
        return MessageBarType.info
    }
  }
    return (
      <MessageBar 
      className='mt-24 w-full rounded shadow'
      onClick={close}
      messageBarType={type()}>
        {message}
      </MessageBar>
    )
}
