import React, { useEffect, useState } from 'react';
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
  const [years, setYears] = useState([]);
  console.log('years', years);
  const [selectedYear,setSelectedYear] = useState(null)
  console.log('selectedYear', selectedYear);

  useEffect(() => {
    const getYears = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/years`);
        if (response?.status) {
          console.log('response of get years api->', response)
          setYears(response?.data)
        }
      } catch (error) {
        console.log('error while getting years', years)
      }
    }

    getYears()

  }, [])


  const [students, setStudents] = useState([]);
  useEffect(() => {
    if(!selectedYear)return
    const getStudents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getYear?year=${selectedYear}`);
        if (response?.status) {
          console.log('response of get students api->', response)
          setStudents(response?.data)
        }
      } catch (error) {
        console.log('error while getting ystudentsears', error)
      }
    }

    getStudents()

  }, [selectedYear])

  return (
    <>
    <div>
      <h1>Select Year</h1>
      <Table striped bordered hover>
        <tbody>
          {years?.map((item, index) => (
            <tr key={index}>
              <td className="text-center" onClick={(e)=> setSelectedYear(item?.year)}>{item?.year}</td>

            </tr>
          ))}
        </tbody>
      </Table>
    </div>

    {/* -----------------------------------------------Student Records------------------------ */}
   {students?.length > 0 && <div>
      <h1>Student Records</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-center">Year</th>
            <th className="text-center">Name</th>
            <th className="text-center">Roll No</th>
            <th className="text-center">Graduation Year</th>
            <th className="text-center">Graduation Month</th>
            <th className="text-center">Graduation Date</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((studentRecord, index) => (
            <tr key={index}>
              <td className="text-center">{studentRecord.year}</td>
              <td className="text-center">{studentRecord.name}</td>
              <td className="text-center">{studentRecord.roll_no}</td>
              <td className="text-center">{studentRecord.graduation_year}</td>
              <td className="text-center">{studentRecord.graduation_month}</td>
              <td className="text-center">{studentRecord.graduation_date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>}
          </>
  );
};
