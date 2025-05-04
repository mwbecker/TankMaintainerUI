import React from 'react';
import { Tank } from '../types/types';

interface Props {
  tanks: Tank[];
}

const TankList: React.FC<Props> = ({ tanks }) => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Aquarium Tanks</h1>
      {tanks.map((tank) => (
        <div key={tank.id} className="bg-white shadow-md rounded-2xl p-6 space-y-4 border">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{tank.name}</h2>
              <p className="text-sm text-gray-600">{tank.species}</p>
            </div>
            <span className="text-sm text-gray-700">{tank.volumeGallons} gal</span>
          </div>
          <p className="text-sm text-gray-500 italic">{tank.notes}</p>

          <div>
            <h3 className="text-md font-medium mb-2">Water Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tank.parameters.map((param) => (
                <div
                  key={param.id}
                  className="p-3 border rounded-xl bg-gray-50"
                >
                  <div className="flex justify-between text-sm font-medium">
                    <span>{param.paramType}</span>
                    <span>
                      {param.value} {param.unit}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{param.notes}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(param.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TankList;