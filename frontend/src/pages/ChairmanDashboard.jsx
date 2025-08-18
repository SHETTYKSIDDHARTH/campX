import React from 'react'
import ChairmanNav from '../components/ChairmanNav'
import CreateEvent from '../components/CreateEvent'
function ChairmanDashboard() {
  return (
    <div className='bg-black min-w-full'>
      <ChairmanNav/>
      <CreateEvent/>
    </div>
  )
}

export default ChairmanDashboard