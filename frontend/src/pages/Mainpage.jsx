import React, { useEffect, useState } from 'react'
import { Selectyear } from '../components/selectyear'
// import { Studenttable } from '../components/Studenttable'
import axios from 'axios';
import { API_BASE_URL } from '../ApiConfig';


export const Mainpage = () => {

  return (



    <>
      <Selectyear />
      {/* <Studenttable  /> */}
    </>
  )
}
