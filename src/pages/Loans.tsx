import React, { useState } from 'react';
import LoanTable from '../components/LoanTable';
import LoanFormModal from '../components/LoanFormModal';
import { useLoans } from '../hooks/useLoans';
import { useBooks } from '../hooks/useBooks';
import { useMembers } from '../hooks/useMembers';

const Loans: React.FC = () => {
  const { loansWithDetails, loading, error, createLoan, returnLoan } = useLoans();
  const { books } = useBooks();
  const { members } = useMembers();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateLoan = async (loanData: any) => {
    return await createLoan(loanData);
  };

  const handleReturnLoan = async (id: string) => {
    return await returnLoan(id);
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
        <h1 className="text-2xl font-bold">Loan Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
        >
          New Loan
        </button>
      </div>

      <LoanTable
        loans={loansWithDetails}
        onReturn={handleReturnLoan}
        loading={loading}
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