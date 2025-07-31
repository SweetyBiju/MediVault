import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BMIGauge = ({ bmiValue = 24.5 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
        datasets: [{
          data: [18.5, 24.4, 29, 30.1], // these represent segment sizes
          backgroundColor: ['#2196f3', '#4caf50', '#ffc107', '#f44336'],
          borderWidth: 0,
        }]
      },
      options: {
        rotation: -90,
        circumference: 180,
        cutout: '80%',
        responsive: true,
        plugins: {
          legend: { display: true  },
          tooltip: { enabled: true }
        },
      },
      plugins: [{
        id: 'needle',
        afterDraw(chart) {
          const { ctx, chartArea } = chart;
          const centerX = (chartArea.left + chartArea.right) / 2;
          const centerY = chartArea.bottom-37;
          const maxBMI = 102;

          const angleDeg = (bmiValue / maxBMI) * 180-180;
          const angleRad = angleDeg * Math.PI / 180;
          const needleLength = chart.width / 2;

          const x = centerX + needleLength * Math.cos(angleRad);
          const y = centerY + needleLength * Math.sin(angleRad);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#111';
          ctx.stroke();

          // Draw circle at center
          ctx.beginPath();
          ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#111';
          ctx.fill();
          ctx.restore();
        }
      }]
    });

    return () => chart.destroy(); // cleanup on unmount
  }, [bmiValue]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 text-center hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">BMI Gauge</h3>
      <canvas ref={canvasRef} className="w-full h-48"></canvas>
      <p className="text-sm text-gray-500 mt-2">Your BMI: <strong>{bmiValue}</strong></p>
    </div>
  );
};

export default BMIGauge;
