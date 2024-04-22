import Messages from "./Messages"
import SendMessage from "./sendMessage"

function Chat() {
  return (
    <div className='h-screen w-0 hidden flex-col md:w-6/12 xl:w-8/12 md:flex '>
      <Messages/>
      <SendMessage/>
    </div>
  )
}

export default Chat
