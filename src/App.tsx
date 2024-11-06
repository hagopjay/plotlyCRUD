import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { Pencil, Trash2 } from 'lucide-react';
import { DataPoint } from './types';
import { AddPointForm } from './components/AddPointForm';
import { EditPointForm } from './components/EditPointForm';

// Generate initial synthetic data
const initialData: DataPoint[] = Array.from({ length: 22 }, (_, i) => ({
  id: `point-${i}`,
  x: Math.random() * 10,
  y: Math.random() * 10,
  label: `Point ${i + 1}`,
}));

function App() {
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);

  const handleAdd = (point: Omit<DataPoint, 'id'>) => {
    const newPoint: DataPoint = {
      ...point,
      id: `point-${Date.now()}`,
    };
    setData([...data, newPoint]);
  };

  const handleEdit = (id: string, updates: Partial<DataPoint>) => {
    setData(data.map((point) =>
      point.id === id ? { ...point, ...updates } : point
    ));
    setSelectedPoint(null);
  };

  const handleDelete = (id: string) => {
    setData(data.filter((point) => point.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Interactive Scatter Plot</h1>
          
          <div className="relative">
            <Plot
              data={[
                {
                  x: data.map((p) => p.x),
                  y: data.map((p) => p.y),
                  text: data.map((p) => p.label),
                  mode: 'markers+text',
                  type: 'scatter',
                  marker: { size: 12 },
                  textposition: 'top center',
                },
              ]}
              layout={{
                width: 800,
                height: 600,
                title: 'Interactive Data Points',
                hovermode: 'closest',
                showlegend: false,
              }}
              config={{ responsive: true }}
            />

            <div className="absolute top-12 right-4">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Data Points</h2>
                <div className="max-h-96 overflow-y-auto">
                  {data.map((point) => (
                    <div
                      key={point.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                    >
                      <span className="text-sm">
                        {point.label} ({point.x.toFixed(2)}, {point.y.toFixed(2)})
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedPoint(point)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(point.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <AddPointForm onAdd={handleAdd} />
        
        {selectedPoint && (
          <EditPointForm
            point={selectedPoint}
            onEdit={handleEdit}
            onClose={() => setSelectedPoint(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;