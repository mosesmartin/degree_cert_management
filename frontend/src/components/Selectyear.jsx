import React from 'react';
import { Table } from 'react-bootstrap';
import "./Selectyear.css"
import axios from 'axios';
import { API_BASE_URL } from '../ApiConfig';
// const years = [
//   '2024FA', '2023FA', '2022FA', '2021FA', '2020FA',
//   '2024FA', '2023FA', '2022FA', '2021FA', '2020FA',
//   '2024FA', '2023FA', '2022FA', '2021FA', '2020FA',
//   '2024FA', '2023FA', '2022FA', '2021FA', '2020FA'
// ];

export const Selectyear = () => {
  // Split the years into rows of three
  // const rows = [];
  // for (let i = 0; i < years.length; i += 3) {
  //   rows.push(years.slice(i, i + 3));
  // }
  const [years,setYears] = useState([]);
  console.log('years',years);
  useEffect(() => {
    const getYears = async()=>{
      try {
        const response = await axios.get(`${API_BASE_URL}/years`);
        if(response?.status){
          console.log('response of get years api->',response)
          setYears(response?.data?.data)
        }
      } catch (error) {
        console.log('error while getting years',years)
      }
    }
  
    getYears()
   
  }, [])
  

  return (
    <div>
      <h1>Select Year</h1>
      <Table striped bordered hover>
        <tbody>
          {years.map((row, index) => (
            <tr key={index}>
              {row.map((year) => (
                <td key={year} className="text-center">{year}</td>
              ))}
              {/* Fill empty cells if row has less than 3 items
              {3 - row.length > 0 && Array(3 - row.length).fill(null).map((_, i) => (
                <td key={`empty-${index}-${i}`}></td>
              ))} */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
