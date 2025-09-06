import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊', description: 'Overview sistem' },
    { path: '/books', label: 'Buku', icon: '📚', description: 'Kelola koleksi buku' },
    { path: '/members', label: 'Anggota', icon: '👥', description: 'Data anggota perpustakaan' },
    { path: '/loans', label: 'Peminjaman', icon: '🔄', description: 'Transaksi peminjaman' },
    { path: '/reports', label: 'Laporan', icon: '📈', description: 'Laporan dan statistik' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white h-screen fixed left-0 top-0 pt-16 z-30 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🏫</span>
            </div>
            <h2 className="text-lg font-bold">Perpustakaan</h2>
            <p className="text-blue-200 text-sm">Sistem Manajemen</p>
          </div>

          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-4 rounded-xl transition-all duration-200 group ${
                    location.pathname === item.path
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'hover:bg-white/10 text-blue-100 hover:text-white'
                  }`}
                >
                  <span className="text-xl mr-4">{item.icon}</span>
                  <div className="flex-1">
                    <span className="font-medium">{item.label}</span>
                    <p className="text-xs text-blue-200 group-hover:text-white/80">
                      {item.description}
                    </p>
                  </div>
                  {location.pathname === item.path && (
                    <div className="w-1 h-6 bg-white rounded-full"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-blue-700/50">
          <div className="text-center text-blue-200 text-xs">
            <p>© 2024 Perpustakaan Digital</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 pt-16">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🏫</span>
            </div>
            <h2 className="text-lg font-bold">Perpustakaan</h2>
            <p className="text-blue-200 text-sm">Sistem Manajemen</p>
          </div>

          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose} // mobile boleh langsung close
                  className={`flex items-center p-4 rounded-xl transition-all duration-200 group ${
                    location.pathname === item.path
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'hover:bg-white/10 text-blue-100 hover:text-white'
                  }`}
                >
                  <span className="text-xl mr-4">{item.icon}</span>
                  <div className="flex-1">
                    <span className="font-medium">{item.label}</span>
                    <p className="text-xs text-blue-200 group-hover:text-white/80">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
