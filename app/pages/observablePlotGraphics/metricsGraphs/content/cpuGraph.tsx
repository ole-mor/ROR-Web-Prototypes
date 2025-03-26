"use client"
import React, { useEffect, useRef, useMemo } from 'react';
import * as Plot from "@observablehq/plot";

interface PerformanceDataPoint {
  timestamp: Date;
  cpuUsage: number;
}

const generateCPUPerformanceData = (): PerformanceDataPoint[] => {
  const data: PerformanceDataPoint[] = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - (24 - i) * 60 * 60 * 1000);
    const baseLoad = 40;
    const variation = Math.sin(i * 0.2) * 8 + 30;
    const randomNoise = Math.random() * 10;
    
    data.push({
      timestamp,
      cpuUsage: Math.max(0, Math.min(100, baseLoad + variation + randomNoise))
    });
  }
  
  return data;
};

const CPUGraph: React.FC = () => {
  const plotRef = useRef<HTMLDivElement>(null);
  const performanceData = useMemo(() => generateCPUPerformanceData(), []);

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
        width: 600,
        style: {
          background: "white",  // Set background to white
          color: "black",       // Set default text color to black
        },
        height: 200,
        marginLeft: 60,
        marks: [
          Plot.areaY(performanceData, {
            x: "timestamp",
            y: "cpuUsage",
            fill: "cornflowerblue",
            opacity: 0.7
          })
        ],
        x: {
          label: "Time",
          type: "time",
          ticks: 12,
          tickFormat: "%H:%M",
          labelAnchor: "center",           // Align the label to the middle of the axis
        },
        y: {
          label: "CPU Usage (%)", 
          domain: [0, 100],
          ticks: 5,
          grid: true,
          labelAnchor: "center",           // Align the label to the middle of the axis
          labelOffset: 40                  // Adjust distance from the axis if needed
        }
      }) as unknown as SVGSVGElement;
    };
    
    // Optional: If you want to customize grid appearance
    // Add this to your CSS

    // Initial render
    plotElement = createPlot(container.offsetWidth);
    container.appendChild(plotElement);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (plotElement) container.removeChild(plotElement);
    };
  }, [performanceData]);

  return (
    <div className="p-4 rounded-lg">
      <div ref={plotRef} className="w-full overflow-x-auto"></div>
    </div>
  );
};

export default CPUGraph;