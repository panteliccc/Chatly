import React from 'react'
import ChatInfoHeader from './ChatInfoHeader'
import { useChatState } from '../../Context/Provider';

function ChatInfo() {
  const chatState = useChatState();

  return (
    <div className={`w-screen md:w-4/12 xl:w-3/12 border-0 md:border-l overflow-hidden ${chatState.openInfo?'flex':'hidden'} h-screen`}>
      <ChatInfoHeader/>
    </div>
  )
}

export default ChatInfo
