import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  FiMenu, 
  FiX, 
  FiBell, 
  FiLogOut, 
  FiClock,
  FiCalendar
} from 'react-icons/fi';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'PETUGAS':
        return 'bg-red-100 text-red-800';
      case 'SISWA':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 py-3 px-4 md:px-6 flex justify-between items-center fixed top-0 right-0 left-0 lg:left-64 z-40">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>

        <div className="hidden lg:flex flex-col font-semibold">
          <div className="flex items-center text-md text-gray-600 mt-0.5">
            <FiCalendar className="mr-1.5 h-3.5 w-3.5" />
            <span className="mr-3">{formatDate(currentTime)}</span>
            <FiClock className="mr-1.5 h-3.5 w-3.5" />
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* User profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-800">{userData?.name}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(userData?.role || '')}`}>
                {userData?.role === 'ADMIN' ? 'Admin WJLRC' : 
                 userData?.role === 'PETUGAS' ? 'Petugas' : 'Siswa'}
              </span>
            </div>
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {userData?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            
            {/* Logout button */}
            <div className="relative">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition duration-200"
                title="Keluar"
                aria-label="Logout"
              >
                <FiLogOut className="h-4 w-4" />
                <span className="hidden md:block text-sm">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;