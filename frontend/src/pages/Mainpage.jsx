import React, { useEffect, useState } from 'react'
import { Selectyear } from '../components/Selectyear'
// import { Studenttable } from '../components/Studenttable'

import NavBar from './NavBar';



export const Mainpage = () => {

  return (



    <>
    <NavBar/>
      <Selectyear />
      {/* <Studenttable  /> */}
    </>
  )
}
