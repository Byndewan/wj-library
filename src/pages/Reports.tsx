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
      <div className="p-6 bg-red-100 text-red-700 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <ExportButton
          data={loansWithDetails}
          filename="library-loans-report.xlsx"
          label="Export to Excel"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-md transition duration-200 ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Loans
          </button>
          <button
            onClick={() => handleFilterChange('active')}
            className={`px-4 py-2 rounded-md transition duration-200 ${
              filter === 'active' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active Loans
          </button>
          <button
            onClick={() => handleFilterChange('overdue')}
            className={`px-4 py-2 rounded-md transition duration-200 ${
              filter === 'overdue' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Overdue Loans
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Total Loans</h3>
            <p className="text-2xl font-bold">{loansWithDetails.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800">Active Loans</h3>
            <p className="text-2xl font-bold">
              {loansWithDetails.filter(loan => loan.status === 'BORROWED').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800">Overdue Loans</h3>
            <p className="text-2xl font-bold">
              {loansWithDetails.filter(loan => 
                loan.status === 'BORROWED' && new Date() > loan.dueDate
              ).length}
            </p>
          </div>
        </div>

        <LoanTable
          loans={loansWithDetails}
          showReturnAction={false}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Reports;