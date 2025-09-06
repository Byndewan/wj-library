import React from 'react';
import { useBooks } from '../hooks/useBooks';
import { useMembers } from '../hooks/useMembers';
import { useLoans } from '../hooks/useLoans';
import { Link } from 'react-router-dom';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Buku',
      value: books.length,
      icon: '📚',
      color: 'blue',
      description: `${activeBooks.length} aktif`
    },
    {
      title: 'Total Anggota',
      value: members.length,
      icon: '👥',
      color: 'green',
      description: `${activeMembers.length} aktif`
    },
    {
      title: 'Sedang Dipinjam',
      value: activeLoans.length,
      icon: '🔄',
      color: 'yellow',
      description: `${overdueLoans.length} terlambat`
    },
    {
      title: 'Koleksi',
      value: books.reduce((acc, book) => acc + (book.stock || 0), 0),
      icon: '📦',
      color: 'purple',
      description: 'Total eksemplar'
    }
  ];

  const quickActions = [
    {
      title: 'Kelola Buku',
      description: 'Tambah, edit, atau hapus buku',
      icon: '📚',
      path: '/books',
      color: 'blue'
    },
    {
      title: 'Kelola Anggota',
      description: 'Kelola data anggota perpustakaan',
      icon: '👥',
      path: '/members',
      color: 'green'
    },
    {
      title: 'Peminjaman',
      description: 'Proses peminjaman dan pengembalian',
      icon: '🔄',
      path: '/loans',
      color: 'yellow'
    },
    {
      title: 'Laporan',
      description: 'Lihat laporan dan statistik',
      icon: '📈',
      path: '/reports',
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang di Sistem Manajemen Perpustakaan</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <span className="text-sm text-gray-500">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:shadow-xl transition-all duration-300">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm text-gray-500">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
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
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className={`p-4 rounded-lg text-center transition-all duration-200 transform hover:scale-105 bg-${action.color}-50 border border-${action.color}-200 hover:bg-${action.color}-100`}
                >
                  <div className={`text-2xl mb-2`}>{action.icon}</div>
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                </Link>
              ))}
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
                    <p className="font-medium text-sm">Peminjaman #{loan.id.substring(0, 8)}</p>
                    <p className="text-xs text-gray-500">
                      {loan.status === 'BORROWED' ? 'Dipinjam' : 'Dikembalikan'} pada{' '}
                      {loan.borrowDate.toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
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
          <h2 className="text-lg font-semibold text-gray-900">Status Sistem</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl">✅</div>
              <h3 className="font-medium mt-2">Aplikasi</h3>
              <p className="text-sm text-gray-600">Berjalan normal</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl">📊</div>
              <h3 className="font-medium mt-2">Database</h3>
              <p className="text-sm text-gray-600">Tersinkronisasi</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl">🔒</div>
              <h3 className="font-medium mt-2">Keamanan</h3>
              <p className="text-sm text-gray-600">Terlindungi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;