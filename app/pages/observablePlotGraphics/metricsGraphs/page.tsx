import React from 'react';
import { CPUGraph } from './content';

export default function ObservablePlotGraphicsPage() {
  return (
    <div className="min-h-screen flex items-center bg-white justify-center p-4">
      <div className="w-full max-w-4xl">
        <CPUGraph />
      </div>
    </div>
  );
}