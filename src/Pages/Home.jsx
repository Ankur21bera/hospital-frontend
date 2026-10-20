import React from 'react'
import Header from '../Components/Header'
import Specialitymenu from '../Components/Specialitymenu'
import Topdoctors from '../Components/Topdoctors'
import Banner from '../Components/Banner'

const Home = () => {
  return (
    <div>
      <Header/>
      <Specialitymenu/>
      <Topdoctors/>
      <Banner/>
    </div>
  )
}

export default Home