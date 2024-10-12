import React from 'react';
import { Table } from 'react-bootstrap';

const studentRecords = [
  { year: "2024FA", name: "Arun Zaheer", rollNo: "22-10650", graduationyear: "2022", graduationmonth: "November", graduationdate: "26" },
  { year: "2024FA", name: "Moses Martin", rollNo: "22-10651", graduationyear: "2020", graduationmonth: "November", graduationdate: "26" },
  { year: "2024FA", name: "Zimran Azim", rollNo: "22-10652", graduationyear: "2023", graduationmonth: "November", graduationdate: "26" }
];

export const Studenttable = () => {
  return (
    <div>
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
          {studentRecords.map((studentRecord, index) => (
            <tr key={index}>
              <td className="text-center">{studentRecord.year}</td>
              <td className="text-center">{studentRecord.name}</td>
              <td className="text-center">{studentRecord.rollNo}</td>
              <td className="text-center">{studentRecord.graduationyear}</td>
              <td className="text-center">{studentRecord.graduationmonth}</td>
              <td className="text-center">{studentRecord.graduationdate}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
