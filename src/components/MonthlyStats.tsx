import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import { useLoans } from '../hooks/useLoans';

const MonthlyStats: React.FC = () => {
  const { loansWithDetails } = useLoans();
  
  // Calculate monthly statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyLoans = loansWithDetails.filter(loan => {
    const loanDate = loan.borrowDate;
    return loanDate.getMonth() === currentMonth && loanDate.getFullYear() === currentYear;
  });

  const activeLoans = monthlyLoans.filter(loan => loan.status === 'BORROWED');
  const returnedLoans = monthlyLoans.filter(loan => loan.status === 'RETURNED');
  const overdueLoans = monthlyLoans.filter(loan => 
    loan.status === 'BORROWED' && new Date() > loan.dueDate
  );

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiBarChart2 className="mr-2 h-5 w-5" />
          Statistik {monthNames[currentMonth]} {currentYear}
        </h3>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{monthlyLoans.length}</p>
            <p className="text-sm text-red-600">Total Peminjaman</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{returnedLoans.length}</p>
            <p className="text-sm text-green-600">Dikembalikan</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{activeLoans.length}</p>
            <p className="text-sm text-yellow-600">Aktif</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{overdueLoans.length}</p>
            <p className="text-sm text-red-600">Terlambat</p>
          </div>
        </div>
        
        {monthlyLoans.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <FiBarChart2 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Belum ada data peminjaman bulan ini</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tingkat pengembalian:</span>
              <span className="text-sm font-semibold">
                {monthlyLoans.length > 0 
                  ? `${Math.round((returnedLoans.length / monthlyLoans.length) * 100)}%` 
                  : '0%'
                }
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ 
                  width: `${monthlyLoans.length > 0 
                    ? Math.round((returnedLoans.length / monthlyLoans.length) * 100) 
                    : 0
                  }%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyStats;