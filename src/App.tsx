import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tank } from './types/types';
import TankForm from './components/TankForm';
import TankList from './components/TankList';
import { auth, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [user, setUser] = useState<any>(null);

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const fetchTanks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const idToken = await user.getIdToken();

      const response = await axios.get<Tank[]>(
        `${import.meta.env.VITE_REACT_API_BASE_URL}/api/tanks`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
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
    if (user) fetchTanks();
  }, [user]);

  const handleTankCreated = () => {
    fetchTanks(); // Refresh list
    setCurrentView('list');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">TankMaintainer</h1>
          {user && <p className="text-sm text-gray-500">Hello, {user.displayName}</p>}
        </div>

        <div className="space-x-2">
          {!user ? (
            <button
              onClick={signInWithGoogle}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              🔐 Sign in with Google
            </button>
          ) : (
            <>
              <button
                onClick={() => setCurrentView(currentView === 'list' ? 'form' : 'list')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {currentView === 'list' ? '➕ Add Tank' : '← Back to List'}
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                🔓 Logout
              </button>
            </>
          )}
        </div>
      </header>

      {!user ? (
        <p className="text-center text-gray-600">Please sign in to view your tanks.</p>
      ) : loading ? (
        <p>Loading tanks...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : currentView === 'form' ? (
        <TankForm onTankCreated={handleTankCreated} onCancel={() => setCurrentView('list')} />
      ) : (
        <TankList tanks={tanks} />
      )}
    </div>
  );
};

export default App;