import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TankForm from './components/TankForm';
import TankList from './components/TankList';
import { Tank } from './types/types';

const App: React.FC = () => {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');

  const fetchTanks = async () => {
    try {
      const response = await axios.get<Tank[]>(
        `${import.meta.env.VITE_REACT_API_BASE_URL}/api/tanks`
      );
      setTanks(response.data);
    } catch (err) {
      console.error('Error fetching tanks:', err);
      setError('Failed to load tanks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTanks();
  }, []);

  const handleTankCreated = () => {
    fetchTanks();         // Refresh list
    setCurrentView('list'); // Go back to list view
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">TankMaintainer</h1>
        {currentView === 'list' && (
          <button
            onClick={() => setCurrentView('form')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            ➕ Add Tank
          </button>
        )}
      </header>

      {currentView === 'form' ? (
        <TankForm
        onTankCreated={handleTankCreated}
        onCancel={() => setCurrentView('list')}
      />
      ) : loading ? (
        <p>Loading tanks...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <TankList tanks={tanks} />
      )}
    </div>
  );
};

export default App;