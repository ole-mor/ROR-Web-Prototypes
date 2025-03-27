"use client"
import React, { useEffect, useRef, useMemo } from 'react';
import * as Plot from "@observablehq/plot";

interface PriceDataPoint {
  timestamp: Date;
  price: number;
  type: string;
}

const generatePricePredictionData = (): PriceDataPoint[] => {
  const startDate = new Date(2024, 2, 1);
  const currentDate = new Date(2024, 2, 1);
  const data: PriceDataPoint[] = [];

  // Seed for consistent random generation
  let seed = 42;
  const pseudoRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Actual historical data (March 1st to March 15th)
  let actualPrice = 30000;
  for (let i = 0; i < 17; i++) {
    const timestamp = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    
    const trendFactor = Math.sin(i * 0.2) * 500;
    const randomNoise = (pseudoRandom() - 0.5) * 300;
    
    actualPrice += trendFactor + randomNoise;
    
    data.push({
      timestamp,
      price: Math.max(0, Math.min(44000, actualPrice)),
      type: 'actual'
    });
  }

  // Predicted historical data (March 1st to March 15th)
  let predictedPrice = 31000;
  for (let i = 0; i < 15; i++) {
    const timestamp = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    
    const trendFactor = Math.sin(i * 0.3) * 600;
    const randomNoise = (pseudoRandom() - 0.5) * 400;
    
    predictedPrice += trendFactor + randomNoise;
    
    data.push({
      timestamp,
      price: Math.max(0, Math.min(44000, predictedPrice)),
      type: 'predicted_historical'
    });
  }

  // Future predicted data (March 15th to April 15th)
  let futurePredictedPrice = predictedPrice;
  for (let i = 0; i < 30; i++) {
    const timestamp = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);
    
    const trendFactor = Math.sin(i * 0.4) * 700;
    const growthTrend = i * 70;
    const randomNoise = (pseudoRandom() - 0.5) * 500;
    
    futurePredictedPrice += trendFactor + growthTrend + randomNoise;
    
    data.push({
      timestamp,
      price: Math.max(0, Math.min(44000, futurePredictedPrice)),
      type: 'predicted_future'
    });
  }

  return data;
};

const PricePredictionGraph: React.FC = () => {
  const plotRef = useRef<HTMLDivElement>(null);
  const data = useMemo(() => generatePricePredictionData(), []);

  useEffect(() => {
    const container = plotRef.current;
    if (!container) return;

    let plotElement: HTMLElement | SVGSVGElement | null = null;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (plotElement) container.removeChild(plotElement);
        plotElement = createPlot(width);
        container.appendChild(plotElement);
      }
    });

    const createPlot = (width: number) => {
      return Plot.plot({
        width: 400,
        height: 150,
        style: {
            background: "white",  // Set background to white
            color: "black",       // Set default text color to black
          },
        marginLeft: 60,
        marks: [
          // Area for actual data
          Plot.areaY(data.filter(d => d.type === 'actual'), {
            x: "timestamp",
            y2: "price",
            z: "type",
            fill: "cornflowerblue",
            fillOpacity: 1
          }),
          // Line for actual data
          Plot.lineY(data.filter(d => d.type === 'actual'), {
            x: "timestamp",
            y: "price",
            z: "type",
            stroke: "cornflowerblue",
            strokeWidth: 1
          }),
        
          
          // Area for future predicted data
          Plot.areaY(data.filter(d => d.type === 'predicted_future'), {
            x: "timestamp",
            y2: "price",
            z: "type",
            fill: "lightgreen",
            fillOpacity: 0.1
          }),
          // Line for future predicted data
          Plot.lineY(data.filter(d => d.type === 'predicted_future'), {
            x: "timestamp",
            y: "price",
            z: "type",
            stroke: "lightgreen",
            strokeWidth: 1
          })
        ],
        x: {
          label: "Date",
          type: "time",
          ticks: 5,
          tickFormat: "%b %d",
          labelAnchor: "center",

        },
        y: {
          label: "Price (kr)",
          domain: [0, 44000],
          ticks: 5,
          grid: true,
          labelAnchor: "center",
          labelOffset: 60
        }
      }) as unknown as SVGSVGElement;
    };

    // Initial render
    plotElement = createPlot(container.offsetWidth);
    container.appendChild(plotElement);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (plotElement) container.removeChild(plotElement);
    };
  }, [data]);

  return (
    <div className="p-4 rounded-lg">
      <div ref={plotRef} className="w-full overflow-x-auto"></div>
      <div className="text-center mt-2 text-sm text-gray-600">
      </div>
    </div>
  );
};

export default PricePredictionGraph;