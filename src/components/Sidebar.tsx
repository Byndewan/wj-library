import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiBook,
  FiUsers,
  FiRepeat,
  FiBarChart2,
  FiX
} from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: FiHome, description: 'Overview website' },
    { path: '/loans', label: 'Peminjaman', icon: FiRepeat, description: 'Peminjaman & pengembalian' },
    { path: '/books', label: 'Buku', icon: FiBook, description: 'Kelola koleksi buku' },
    { path: '/members', label: 'Anggota', icon: FiUsers, description: 'data anggota WJLRC' },
    { path: '/reports', label: 'Laporan', icon: FiBarChart2, description: 'Laporan dan statistik' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col w-64 bg-white text-gray-800 h-screen fixed left-0 top-0 pt-16 z-30 border-r border-gray-200">
        <div className="p-4">
          <div className="text-center mb-8 mt-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <img src="/WJ.png" alt="LOGO" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">WJLRC Library</h2>
            <p className="text-gray-500 text-sm">Platform Perpustakaan Digital</p>
          </div>

          <ul className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                      location.pathname === item.path
                        ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className={`text-lg mr-3 ${location.pathname === item.path ? 'text-red-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                    <div className="flex-1">
                      <span className="font-medium text-sm">{item.label}</span>
                      <p className="text-xs text-gray-500 group-hover:text-gray-600 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="text-center text-gray-500 text-xs">
            <p>© 2025 WJLRC Library. Supported by <a href="https://instagram.com/byndewan_" target="_blank" class="text-blue-600 hover:underline ml-1">@Abyan</a>. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white text-gray-800 z-40 transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-gray-200`}>
        <div className="p-4 pt-16">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <FiX className="h-5 w-5" />
          </button>
          
          <div className="text-center mb-8 mt-2">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <img src="/WJ.png" alt="LOGO" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">WJLRC Library</h2>
            <p className="text-gray-500 text-sm">Platform Perpustakaan Digital</p>
          </div>

          <ul className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                      location.pathname === item.path
                        ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className={`text-lg mr-3 ${location.pathname === item.path ? 'text-red-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                    <div className="flex-1">
                      <span className="font-medium text-sm">{item.label}</span>
                      <p className="text-xs text-gray-500 group-hover:text-gray-600 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;