import React from 'react';
import { Table } from 'react-bootstrap';
import "./Selectyear.css"
const years = [
  '2024FA', '2023FA', '2022FA', '2021FA', '2020FA',
  '2024FA', '2023FA', '2022FA', '2021FA', '2020FA',
  '2024FA', '2023FA', '2022FA', '2021FA', '2020FA',
  '2024FA', '2023FA', '2022FA', '2021FA', '2020FA'
];

export const Selectyear = () => {
  // Split the years into rows of three
  const rows = [];
  for (let i = 0; i < years.length; i += 3) {
    rows.push(years.slice(i, i + 3));
  }

  return (
    <div>
      <h1>Select Year</h1>
      <Table striped bordered hover>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((year) => (
                <td key={year} className="text-center">{year}</td>
              ))}
              {/* Fill empty cells if row has less than 3 items */}
              {3 - row.length > 0 && Array(3 - row.length).fill(null).map((_, i) => (
                <td key={`empty-${index}-${i}`}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
