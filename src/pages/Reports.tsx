import React, { useState } from 'react';
import LoanTable from '../components/LoanTable';
import ExportButton from '../components/ExportButton';
import MonthlyStats from '../components/MonthlyStats';
import PopularBooks from '../components/PopularBooks';
import { useLoans } from '../hooks/useLoans';
import { FiAlertTriangle } from 'react-icons/fi';

const Reports: React.FC = () => {
  const { loansWithDetails, loading, error, refreshLoans } = useLoans();
  const [filter, setFilter] = useState<'all' | 'active' | 'overdue'>('all');
  const activeLoans = loansWithDetails.filter(loan => loan.status === 'BORROWED');
  const overdueLoans = activeLoans.filter(loan => new Date() > loan.dueDate);

  const handleFilterChange = (newFilter: 'all' | 'active' | 'overdue') => {
    setFilter(newFilter);
    refreshLoans();
  };

  const filteredLoans =
    filter === 'active' ? activeLoans :
    filter === 'overdue' ? overdueLoans :
    loansWithDetails;

  if (error) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <div className="flex items-center">
          <FiAlertTriangle className="h-5 w-5 mr-2" />
          <div>
            <h3 className="font-semibold">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <FiAlertTriangle className="text-blue-600 h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-800">Total</h3>
              <p className="text-2xl font-bold text-gray-600">{loansWithDetails.length}</p>
              <p className="text-xs text-blue-600">Semua Peminjaman</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <FiAlertTriangle className="text-green-600 h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-green-800">Selesai</h3>
              <p className="text-2xl font-bold text-gray-600">
                {loansWithDetails.filter(loan => loan.status === 'RETURNED').length}
              </p>
              <p className="text-xs text-green-600">Telah Dikembalikan</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <FiAlertTriangle className="text-yellow-600 h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">Aktif</h3>
              <p className="text-2xl font-bold text-gray-600">{activeLoans.length}</p>
              <p className="text-xs text-yellow-600">Sedang Dipinjam</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <FiAlertTriangle className="text-red-600 h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-800">Terlambat</h3>
              <p className="text-2xl font-bold text-gray-600">{overdueLoans.length}</p>
              <p className="text-xs text-red-600">Melewati Jatuh Tempo</p>
            </div>
          </div>
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
                className={`px-4 py-2 rounded-lg transition duration-200 ${filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Semua
              </button>
              <button
                onClick={() => handleFilterChange('active')}
                className={`px-4 py-2 rounded-lg transition duration-200 ${filter === 'active'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Aktif ({activeLoans.length})
              </button>
              <button
                onClick={() => handleFilterChange('overdue')}
                className={`px-4 py-2 rounded-lg transition duration-200 ${filter === 'overdue'
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
            loans={filteredLoans}
            showReturnAction={false}
            loading={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyStats />
        <PopularBooks />
      </div>

    </div>
  );
};

export default Reports;