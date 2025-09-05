import React, { useState } from 'react';
import type { LoanWithDetails } from '../types';
import LoanDetailModal from './LoanDetailModal';

interface LoanTableProps {
  loans: LoanWithDetails[];
  onReturn?: (id: string) => Promise<boolean>;
  loading: boolean;
  showReturnAction?: boolean;
}

const LoanTable: React.FC<LoanTableProps> = ({ 
  loans, 
  onReturn, 
  loading, 
  showReturnAction = true 
}) => {
  const [selectedLoan, setSelectedLoan] = useState<LoanWithDetails | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewDetails = (loan: LoanWithDetails) => {
    setSelectedLoan(loan);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedLoan(null);
  };

  const handleReturn = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReturn) {
      await onReturn(id);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading loans...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6">Book Title</th>
                <th className="py-3 px-6">Member Name</th>
                <th className="py-3 px-6">Class</th>
                <th className="py-3 px-6">Borrow Date</th>
                <th className="py-3 px-6">Due Date</th>
                <th className="py-3 px-6">Return Date</th>
                <th className="py-3 px-6">Status</th>
                {showReturnAction && <th className="py-3 px-6">Actions</th>}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {loans.map((loan, index) => {
                const isOverdue = loan.status === 'BORROWED' && new Date() > loan.dueDate;
                
                return (
                  <tr 
                    key={loan.id} 
                    className={`
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
                      hover:bg-gray-100 cursor-pointer
                      ${isOverdue ? 'bg-red-50 text-red-600' : ''}
                    `}
                    onClick={() => handleViewDetails(loan)}
                  >
                    <td className="py-3 px-6">{loan.bookTitle}</td>
                    <td className="py-3 px-6">{loan.memberName}</td>
                    <td className="py-3 px-6">{loan.className}</td>
                    <td className="py-3 px-6">{loan.borrowDate.toLocaleDateString()}</td>
                    <td className={`py-3 px-6 ${isOverdue ? 'font-bold' : ''}`}>
                      {loan.dueDate.toLocaleDateString()}
                      {isOverdue && ' ⚠️'}
                    </td>
                    <td className="py-3 px-6">
                      {loan.returnDate ? loan.returnDate.toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        loan.status === 'BORROWED' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    {showReturnAction && loan.status === 'BORROWED' && (
                      <td className="py-3 px-6">
                        <button
                          onClick={(e) => handleReturn(loan.id, e)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Return
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {loans.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No loans found.
          </div>
        )}
      </div>

      <LoanDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        loan={selectedLoan}
      />
    </>
  );
};

export default LoanTable;