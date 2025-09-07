import React, { useState } from 'react';
import LoanTable from '../components/LoanTable';
import LoanFormModal from '../components/LoanFormModal';
import { useLoans } from '../hooks/useLoans';
import { useBooks } from '../hooks/useBooks';
import { useMembers } from '../hooks/useMembers';
import { FiPlus } from 'react-icons/fi';

const Loans: React.FC = () => {
  const { loansWithDetails, loading, error, createLoan, returnLoan } = useLoans();
  const { books, loading: booksLoading } = useBooks();
  const { members, loading: membersLoading } = useMembers();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateLoan = async (loanData: any) => {
    return await createLoan(loanData);
  };

  const handleReturnLoan = async (id: string) => {
    return await returnLoan(id);
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

  const isLoading = loading || booksLoading || membersLoading;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Manajemen Peminjaman</h1>
          <p className="text-gray-600">Kelola transaksi peminjaman buku</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary whitespace-nowrap"
          disabled={isLoading}
        >
          <FiPlus className="h-4 w-4" />
          Peminjaman Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Peminjaman</h3>
          <p className="text-2xl font-bold text-gray-600">{loansWithDetails.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Sedang Dipinjam</h3>
          <p className="text-2xl font-bold text-gray-600">
            {loansWithDetails.filter(loan => loan.status === 'BORROWED').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">Terlambat</h3>
          <p className="text-2xl font-bold text-gray-600">
            {loansWithDetails.filter(loan => 
              loan.status === 'BORROWED' && new Date() > loan.dueDate
            ).length}
          </p>
        </div>
      </div>

      <LoanTable
        loans={loansWithDetails}
        onReturn={handleReturnLoan}
        loading={isLoading}
      />

      <LoanFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateLoan}
        books={books.filter(book => book.isActive && (book.stock || 0) > 0)}
        members={members.filter(member => member.isActive)}
      />
    </div>
  );
};

export default Loans;