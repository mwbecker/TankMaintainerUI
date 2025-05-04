import React, { useState } from 'react';
import axios from 'axios';

interface Tank {
  name: string;
  species: string;
  volumeGallons: number;
  notes: string;
}

interface TankFormProps {
  onTankCreated: () => void;
}

const TankForm: React.FC<TankFormProps> = ({ onTankCreated }) => {
  const [tank, setTank] = useState<Tank>({
    name: '',
    species: '',
    volumeGallons: 0,
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTank((prev) => ({
      ...prev,
      [name]: name === 'volumeGallons' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_API_BASE_URL}/api/tanks`,
        tank
      );
      setTank({ name: '', species: '', volumeGallons: 0, notes: '' });
      onTankCreated(); // Notify App to refresh + navigate back
    } catch (error) {
      console.error('Error creating tank:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 space-y-5 border border-gray-200"
    >
      <h2 className="text-xl font-bold text-center text-gray-800">Add Tank</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          name="name"
          value={tank.name}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border border-gray-300 bg-white text-gray-800 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Species</label>
        <input
          name="species"
          value={tank.species}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border border-gray-300 bg-white text-gray-800 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Volume (Gallons)</label>
        <input
          name="volumeGallons"
          type="number"
          value={tank.volumeGallons}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border border-gray-300 bg-white text-gray-800 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          value={tank.notes}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 bg-white text-gray-800 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Create Tank
      </button>
    </form>
  );
};

export default TankForm;