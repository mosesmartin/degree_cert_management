import React, { useEffect, useRef } from 'react';
import degreeImg from '../assets/blank_degree_template.jpg'; // Ensure this path is correct
import './DegreeOverlay.css'

const DegreeOverlay = ({ studentRecord, canvasWidth, canvasHeight }) => {
  const canvasRef = useRef(null);

  const draw = (ctx, dpr) => {
    const img = new Image();
    img.src = degreeImg;

    img.onload = () => {
      // Scale canvas based on device pixel ratio
      const scaledWidth = canvasWidth * dpr;
      const scaledHeight = canvasHeight * dpr;

      // Adjust canvas size to DPR
      ctx.canvas.width = scaledWidth;
      ctx.canvas.height = scaledHeight;
      ctx.scale(dpr, dpr);

      // Draw the background image
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      // Wait for the font to be loaded before rendering text
      document.fonts.ready.then(() => {
        // Set text properties after the font is loaded
        ctx.fillStyle = 'black'; // Change color as needed
        ctx.font = '600 20px Goteborg, regular';

        // Function to place text using percentages
        const drawText = (text, xPercent, yPercent) => {
          const x = xPercent * canvasWidth;
          const y = yPercent * canvasHeight;
          ctx.fillText(text, x, y);
        };

        // Place the student's name and other info using relative percentages
        drawText(studentRecord.name, 0.43, 0.455); // Name at 43% width, 45.5% height
        drawText(studentRecord.graduation_date, 0.305, 0.686); // Example positions
        drawText(studentRecord.graduation_month, 0.457, 0.685);
        drawText(studentRecord.graduation_year, 0.719, 0.682);
      });
    };

    img.onerror = () => {
      console.error('Error loading image:', img.src);
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    draw(ctx, dpr);
  }, [studentRecord, canvasWidth, canvasHeight]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />;
};

export default DegreeOverlay;
