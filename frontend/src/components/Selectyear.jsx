

import React from 'react'

const years = [
   '2024FA','2023FA','2022FA','2021FA','2020FA'
]

export const Selectyear = () => {
  return (
    <div>
        
        <h1>Select Year</h1>
        <ul>
            {
                years.map((year) =>
                
                <li key={year} >{year}</li>
                
                )
            }    
            
        </ul>   
    </div>
  )
}
