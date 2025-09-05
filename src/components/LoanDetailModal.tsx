import React from 'react';
import type { LoanWithDetails } from '../types';

interface LoanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanWithDetails | null;
}

const LoanDetailModal: React.FC<LoanDetailModalProps> = ({ isOpen, onClose, loan }) => {
  if (!isOpen || !loan) return null;

  const isOverdue = loan.status === 'BORROWED' && new Date() > loan.dueDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Loan Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Book Information</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Title:</span> {loan.bookTitle}</p>
                <p><span className="font-semibold">Book ID:</span> {loan.bookId}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Member Information</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Name:</span> {loan.memberName}</p>
                <p><span className="font-semibold">Class:</span> {loan.className}</p>
                <p><span className="font-semibold">Member ID:</span> {loan.memberId}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Loan Dates</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Borrow Date:</span> {loan.borrowDate.toLocaleDateString()}</p>
                <p><span className="font-semibold">Due Date:</span> 
                  <span className={isOverdue ? 'text-red-600 font-bold ml-2' : ''}>
                    {loan.dueDate.toLocaleDateString()}
                    {isOverdue && ' (Overdue)'}
                  </span>
                </p>
                {loan.returnDate && (
                  <p><span className="font-semibold">Return Date:</span> {loan.returnDate.toLocaleDateString()}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Status</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    loan.status === 'BORROWED' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {loan.status}
                  </span>
                </p>
                {loan.notes && (
                  <p><span className="font-semibold">Notes:</span> {loan.notes}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailModal;