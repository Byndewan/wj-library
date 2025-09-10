import React from 'react';
import { useBooks } from '../hooks/useBooks';
import { useMembers } from '../hooks/useMembers';
import { useLoans } from '../hooks/useLoans';
import { Link } from 'react-router-dom';
import {
  FiBook,
  FiUsers,
  FiRepeat,
  FiBookOpen,
  FiUser,
  FiRefreshCw,
  FiBarChart2,
  FiCheckCircle,
  FiShield,
  FiDatabase,
} from 'react-icons/fi';
import MonthlyStats from '../components/MonthlyStats';
import PopularBooks from '../components/PopularBooks';
import { CgSearchLoading } from 'react-icons/cg';

const Dashboard: React.FC = () => {
  const { books, loading: booksLoading } = useBooks();
  const { members, loading: membersLoading } = useMembers();
  const { loans, loading: loansLoading } = useLoans();

  const activeBooks = books.filter(book => book.isActive);
  const activeMembers = members.filter(member => member.isActive);
  const activeLoans = loans.filter(loan => loan.status === 'BORROWED');
  const overdueLoans = activeLoans.filter(loan => new Date() > loan.dueDate);

  if (booksLoading || membersLoading || loansLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Buku',
      value: books.length,
      icon: FiBook,
      color: 'red',
      description: `${activeBooks.length} aktif`
    },
    {
      title: 'Total Anggota',
      value: members.length,
      icon: FiUsers,
      color: 'green',
      description: `${activeMembers.length} aktif`
    },
    {
      title: 'Sedang Dipinjam',
      value: activeLoans.length,
      icon: FiRepeat,
      color: 'yellow',
      description: `${overdueLoans.length} terlambat`
    },
    {
      title: 'Comming Soon',
      value: "",
      icon: CgSearchLoading,
      color: 'red',
      description: 'Masih Dalam Tahap Pengembangan'
    }
  ];

  const quickActions = [
    {
      title: 'Kelola Buku',
      description: 'Tambah, edit, atau hapus buku',
      icon: FiBookOpen,
      path: '/books',
      color: 'red'
    },
    {
      title: 'Kelola Anggota',
      description: 'Kelola data anggota WJLRC',
      icon: FiUser,
      path: '/members',
      color: 'green'
    },
    {
      title: 'Peminjaman',
      description: 'Proses peminjaman dan pengembalian',
      icon: FiRefreshCw,
      path: '/loans',
      color: 'yellow'
    },
    {
      title: 'Laporan',
      description: 'Lihat laporan dan statistik',
      icon: FiBarChart2,
      path: '/reports',
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang di <strong>WJLRC Library</strong> Platform Perpustakaan Digital</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <span className="text-sm text-gray-500 font-medium">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="card hover:shadow-lg transition-all duration-300">
              <div className="card-body p-5">
                <div className="flex items-center">
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                    <IconComponent className={`text-${stat.color}-600 h-6 w-6`} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm text-gray-500">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Aksi Cepat</h2>
            <p className="text-sm text-gray-600">Akses fitur utama dengan cepat</p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.path}
                    className={`p-4 rounded-lg text-center transition-all duration-200 hover:shadow-md bg-${action.color}-50 border border-${action.color}-200 hover:bg-${action.color}-100`}
                  >
                    <div className={`text-${action.color}-600 mb-2 flex justify-center`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">{action.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
            <p className="text-sm text-gray-600">5 transaksi terakhir</p>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {loans.slice(0, 5).map(loan => (
                <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-gray-400">Peminjaman #{loan.id.substring(0, 8)}</p>
                    <p className="text-xs text-gray-500">
                      {loan.status === 'BORROWED' ? 'Dipinjam' : 'Dikembalikan'} pada{' '}
                      {loan.borrowDate.toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    loan.status === 'BORROWED' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {loan.status === 'BORROWED' ? 'Aktif' : 'Selesai'}
                  </span>
                </div>
              ))}
              
              {loans.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FiRepeat className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Belum ada aktivitas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Status Website</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex justify-center">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mt-2 text-gray-400">Aplikasi</h3>
              <p className="text-sm text-gray-600">Berjalan normal</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="flex justify-center">
                <FiDatabase className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-medium mt-2 text-gray-400">Database</h3>
              <p className="text-sm text-gray-600">Tersinkronisasi</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex justify-center">
                <FiShield className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-medium mt-2 text-gray-400">Keamanan</h3>
              <p className="text-sm text-gray-600">Terlindungi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;