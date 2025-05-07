import React, { useState } from 'react';
import { Tank } from '../types/types';
import AddTankParamForm from './AddTankParamForm';
import AddWaterChangeForm from './AddWaterChangeForm';

interface Props {
  tanks: Tank[];
  onRefresh: () => void; // Call this after a form submits to re-fetch the updated tanks
}

const TankList: React.FC<Props> = ({ tanks, onRefresh }) => {
  const [openTankId, setOpenTankId] = useState<string | null>(null);
  const [showParamFormId, setShowParamFormId] = useState<string | null>(null);
  const [showWaterChangeFormId, setShowWaterChangeFormId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenTankId((prev) => (prev === id ? null : id));
    setShowParamFormId(null);
    setShowWaterChangeFormId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Aquarium Tanks</h1>
      {tanks.map((tank) => {
        const recentParams = [...tank.parameters]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);

        const recentWaterChanges = [...tank.waterChanges]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        const isOpen = openTankId === tank.id;

        return (
          <div key={tank.id} className="bg-white shadow-md rounded-2xl p-6 space-y-4 border">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAccordion(tank.id)}
            >
              <div>
                <h2 className="text-xl font-semibold">{tank.name}</h2>
                <p className="text-sm text-gray-600">{tank.species}</p>
              </div>
              <span className="text-sm text-gray-700">{tank.volumeGallons} gal</span>
            </div>

            <p className="text-sm text-gray-500 italic">{tank.notes}</p>

            {isOpen && (
              <div className="space-y-6 mt-4">
                {/* Parameters */}
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium">Water Parameters (latest 5)</h3>
                    <button
                      onClick={() =>
                        setShowParamFormId((prev) => (prev === tank.id ? null : tank.id))
                      }
                      className="text-blue-600 hover:underline text-sm"
                    >
                      ➕ Add
                    </button>
                  </div>
                  {showParamFormId === tank.id && (
                    <AddTankParamForm
                      tankId={tank.id}
                      onCreated={() => {
                        setShowParamFormId(null);
                        onRefresh();
                      }}
                      onCancel={() => setShowParamFormId(null)}
                    />
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {recentParams.map((param) => (
                      <div key={param.id} className="p-3 border rounded-xl bg-gray-50">
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

                {/* Water Changes */}
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium">Water Changes (latest 5)</h3>
                    <button
                      onClick={() =>
                        setShowWaterChangeFormId((prev) => (prev === tank.id ? null : tank.id))
                      }
                      className="text-blue-600 hover:underline text-sm"
                    >
                      ➕ Add
                    </button>
                  </div>
                  {showWaterChangeFormId === tank.id && (
                    <AddWaterChangeForm
                      tankId={tank.id}
                      onCreated={() => {
                        setShowWaterChangeFormId(null);
                        onRefresh();
                      }}
                      onCancel={() => setShowWaterChangeFormId(null)}
                    />
                  )}
                  <ul className="text-sm list-disc pl-6 space-y-1 mt-4">
                    {recentWaterChanges.map((wc) => (
                      <li key={wc.id}>
                        {new Date(wc.date).toLocaleDateString()} — {wc.volumeGallons} gal —{' '}
                        <span className="italic text-gray-500">{wc.notes}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TankList;