import React, { useEffect, useRef } from 'react';
import degreeImg from '../assets/blank_degree_template.jpg';
import './DegreeOverlay.css'
const DegreeOverlay = ({ studentRecord, canvasWidth, canvasHeight }) => {
  const canvasRef = useRef(null);

  const draw = (ctx) => {
    const img = new Image();
    img.src = degreeImg;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = 'Black'; // Change color as needed
      ctx.font = 'normal 600 24px Goteborg,regular';
      ctx.fillText(studentRecord.name, canvasWidth * 0.42, canvasHeight * 0.46);
      ctx.fillText(studentRecord.graduation_date, canvasWidth * 0.29, canvasHeight * 0.69);
      ctx.fillText(studentRecord.graduation_month, canvasWidth * 0.44, canvasHeight * 0.69);
      ctx.fillText(studentRecord.graduation_year, canvasWidth * 0.71, canvasHeight * 0.683);
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
