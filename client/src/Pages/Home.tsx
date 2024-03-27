import React from 'react'
import SideBar from '../Components/SideBar/SideBar'
import Chat from '../Components/Chat'

function Home() {
  return (
    <div className={`bg-background w-screen h-screen flex`}>
      <SideBar/>
      <Chat/>
    </div>
  )
}

export default Home
