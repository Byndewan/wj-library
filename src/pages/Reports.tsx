import React, { useState } from 'react';
import LoanTable from '../components/LoanTable';
import ExportButton from '../components/ExportButton';
import { useLoans } from '../hooks/useLoans';

const Reports: React.FC = () => {
  const { loansWithDetails, loading, error, fetchActiveLoans, fetchOverdueLoans, refreshLoans } = useLoans();
  const [filter, setFilter] = useState<'all' | 'active' | 'overdue'>('all');

  const handleFilterChange = (newFilter: 'all' | 'active' | 'overdue') => {
    setFilter(newFilter);
    if (newFilter === 'active') {
      fetchActiveLoans();
    } else if (newFilter === 'overdue') {
      fetchOverdueLoans();
    } else {
      refreshLoans();
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <div className="flex items-center">
          <span className="text-xl mr-2">⚠️</span>
          <div>
            <h3 className="font-semibold">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const activeLoans = loansWithDetails.filter(loan => loan.status === 'BORROWED');
  const overdueLoans = activeLoans.filter(loan => new Date() > loan.dueDate);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Laporan</h1>
          <p className="text-gray-600">Data dan statistik peminjaman buku</p>
        </div>
        <ExportButton
          data={loansWithDetails}
          filename={`laporan-peminjaman-${new Date().toISOString().split('T')[0]}.xlsx`}
          label="Export Excel"
          variant="primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total</h3>
          <p className="text-2xl font-bold">{loansWithDetails.length}</p>
          <p className="text-sm text-blue-600">Semua Peminjaman</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Selesai</h3>
          <p className="text-2xl font-bold">
            {loansWithDetails.filter(loan => loan.status === 'RETURNED').length}
          </p>
          <p className="text-sm text-green-600">Telah Dikembalikan</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Aktif</h3>
          <p className="text-2xl font-bold">{activeLoans.length}</p>
          <p className="text-sm text-yellow-600">Sedang Dipinjam</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">Terlambat</h3>
          <p className="text-2xl font-bold">{overdueLoans.length}</p>
          <p className="text-sm text-red-600">Melewati Jatuh Tempo</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Data Peminjaman</h2>
              <p className="text-sm text-gray-600">Filter berdasarkan status peminjaman</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  filter === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => handleFilterChange('active')}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  filter === 'active' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Aktif ({activeLoans.length})
              </button>
              <button
                onClick={() => handleFilterChange('overdue')}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  filter === 'overdue' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Terlambat ({overdueLoans.length})
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          <LoanTable
            loans={loansWithDetails}
            showReturnAction={false}
            loading={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Statistik Bulanan</h3>
          </div>
          <div className="card-body">
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📈</div>
              <p>Fitur statistik bulanan akan segera hadir</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Buku Populer</h3>
          </div>
          <div className="card-body">
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🏆</div>
              <p>Fitur buku populer akan segera hadir</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;