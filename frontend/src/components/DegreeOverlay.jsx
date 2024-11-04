import React, { useEffect, useRef } from 'react';
import degreeBsMs from '../assets/degree_latest-1.jpg'; // Ensure this path is correct
import degreePHD from '../assets/PHD.png'; // Ensure this path is correct
import './DegreeOverlay.css';

const DegreeOverlay = ({ studentRecord, canvasWidth, canvasHeight, program }) => {
  const canvasRef = useRef(null);

  const draw = (ctx, dpr, imgSrc) => {
    const img = new Image();
    img.src = imgSrc;

    img.onload = () => {
      const scaledWidth = canvasWidth * dpr;
      const scaledHeight = canvasHeight * dpr;

      ctx.canvas.width = scaledWidth;
      ctx.canvas.height = scaledHeight;
      ctx.scale(dpr, dpr);
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      document.fonts.ready.then(() => {
        ctx.fillStyle = 'black';
        ctx.font = '600 20px Goteborg, regular';

        const drawText = (text, xPercent, yPercent) => {
          const x = xPercent * canvasWidth;
          const y = yPercent * canvasHeight;
          ctx.fillText(text, x, y);
        };

        drawText(studentRecord.roll_no, 0.20, 0.10);
        drawText(studentRecord.name, 0.43, 0.455);
        drawText(studentRecord.graduation_date, 0.305, 0.686);
        drawText(studentRecord.graduation_month, 0.457, 0.685);
        drawText(studentRecord.graduation_year, 0.719, 0.682);
      });
    };

    img.onerror = () => {
      console.error('Error loading image:', img.src);
    };
  };

  useEffect(() => {
    if (program) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;

      const imgSrc = program === "phd" ? degreePHD : degreeBsMs;
      draw(ctx, dpr, imgSrc);
    }
  }, [studentRecord, canvasWidth, canvasHeight, program]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />;
};

export default DegreeOverlay;
