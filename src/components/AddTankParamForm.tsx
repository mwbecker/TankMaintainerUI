import React, { useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';

interface AddTankParamFormProps {
  tankId: string;
  onCreated: () => void;
  onCancel: () => void;
}

const AddTankParamForm: React.FC<AddTankParamFormProps> = ({ tankId, onCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    paramType: '',
    value: 0,
    unit: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      const idToken = await user.getIdToken();

      await axios.post(
        `${import.meta.env.VITE_REACT_API_BASE_URL}/api/tank-params`,
        {
          ...formData,
          timestamp: new Date().toISOString(),
          tankId,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      setFormData({ paramType: '', value: 0, unit: '', notes: '' });
      onCreated();
    } catch (err) {
      console.error('Error adding tank parameter:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="paramType" className="block text-sm font-medium text-gray-700">
            Parameter Type
          </label>
          <input
            id="paramType"
            name="paramType"
            value={formData.paramType}
            onChange={handleChange}
            required
            placeholder="e.g. PH"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700">
            Value
          </label>
          <input
            id="value"
            name="value"
            type="number"
            value={formData.value}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
            Unit
          </label>
          <input
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
            placeholder="e.g. ppm"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Optional notes"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 rounded px-4 py-2 hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTankParamForm;