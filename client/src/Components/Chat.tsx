import React from 'react'
import CreateGroup  from './createGroup'

function Chat() {
  return (
    <div className='h-screen w-0 hidden flex-col md:w-6/12 xl:w-7/12 md:flex '>
      <CreateGroup/>
    </div>
  )
}

export default Chat
