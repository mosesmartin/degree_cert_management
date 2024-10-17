import React, { useEffect, useRef } from 'react';
import degreeImg from '../assets/blank_degree_template.jpg'; // Ensure this path is correct
import './DegreeOverlay.css'

const DegreeOverlay = ({ studentRecord, canvasWidth, canvasHeight }) => {
  const canvasRef = useRef(null);

  const draw = (ctx) => {
    const img = new Image();
    img.src = degreeImg;

    img.onload = () => {
      // Draw the background image
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      // Set text properties
      ctx.fillStyle = 'black'; // Change color as needed
      ctx.font = 'normal 600 24px Goteborg, regular';

      // Function to map grid (10mm increments) to canvas coordinates
      const gridToCanvasX = (gridX) => (gridX / 30) * canvasWidth; // Assuming 30 columns
      const gridToCanvasY = (gridY) => (gridY / 20) * canvasHeight; // Assuming 20 rows

      // Place text using grid X and Y coordinates
      ctx.fillText(studentRecord.name, gridToCanvasX(13), gridToCanvasY(9)); // Name at (12,9)
      ctx.fillText(studentRecord.graduation_date, gridToCanvasX(10), gridToCanvasY(20)); // Example positions
      ctx.fillText(studentRecord.graduation_month, gridToCanvasX(25), gridToCanvasY(20));
      ctx.fillText(studentRecord.graduation_year, gridToCanvasX(30), gridToCanvasY(20));
    };

    img.onerror = () => {
      console.error('Error loading image:', img.src);
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    draw(ctx);
  }, [studentRecord, canvasWidth, canvasHeight]);

  return <canvas ref={canvasRef} />;
};

export default DegreeOverlay;