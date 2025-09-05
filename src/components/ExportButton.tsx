import React from 'react';
import { exportSpreadsheet } from '../utils/exportSpreadsheet';
import type { LoanWithDetails } from '../types';

interface ExportButtonProps {
  data: LoanWithDetails[];
  filename: string;
  label: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename, label }) => {
  const handleExport = () => {
    const exportData = data.map(loan => ({
      'Loan ID': loan.id,
      'Book Title': loan.bookTitle,
      'Member Name': loan.memberName,
      'Class': loan.className,
      'Borrow Date': loan.borrowDate.toLocaleDateString(),
      'Due Date': loan.dueDate.toLocaleDateString(),
      'Return Date': loan.returnDate ? loan.returnDate.toLocaleDateString() : 'Not Returned',
      'Status': loan.status,
      'Notes': loan.notes || ''
    }));

    exportSpreadsheet(exportData, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200 flex items-center"
    >
      <span className="mr-2">📊</span>
      {label}
    </button>
  );
};

export default ExportButton;