import React from 'react'
import Header from './Header';

const SideBar = () => {
  return (
    <div className={` bg-secondary h-screen w-screen flex flex-col md:w-1/3 lg:w-1/4`}>
      <Header/>
    </div>
  )
}

export default SideBar;