import React, { useState } from 'react';
import type { LoanWithDetails } from '../types';
import LoanDetailModal from './LoanDetailModal';
import { FiClock, FiCheckCircle } from 'react-icons/fi';

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
    if (onReturn && confirm('Apakah buku ini sudah di kembalikan?')) {
      await onReturn(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Judul Buku</th>
                <th>Nama Anggota</th>
                <th>Kelas</th>
                <th>Tanggal Pinjam</th>
                <th>Tanggal Jatuh Tempo</th>
                <th>Tanggal Kembali</th>
                <th>Status</th>
                {showReturnAction && <th>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const isOverdue = loan.status === 'BORROWED' && new Date() > loan.dueDate;
                const isDueSoon = loan.status === 'BORROWED' && 
                  new Date(loan.dueDate.getTime() - 3 * 24 * 60 * 60 * 1000) < new Date() &&
                  !isOverdue;
                
                return (
                  <tr 
                    key={loan.id} 
                    className={`
                      hover:bg-blue-50 cursor-pointer
                      ${isOverdue ? 'bg-red-50' : ''}
                      ${isDueSoon ? 'bg-yellow-50' : ''}
                    `}
                    onClick={() => handleViewDetails(loan)}
                  >
                    <td className="font-medium text-gray-900">{loan.bookTitle}</td>
                    <td className="text-gray-700">{loan.memberName}</td>
                    <td className="text-gray-700">{loan.className}</td>
                    <td className="text-gray-700">{loan.borrowDate.toLocaleDateString('id-ID')}</td>
                    <td className={`font-medium ${isOverdue ? 'text-red-600' : ''} ${isDueSoon ? 'text-yellow-600' : 'text-gray-700'}`}>
                      <div className="flex items-center">
                        {loan.dueDate.toLocaleDateString('id-ID')}
                        {isOverdue && <FiClock className="ml-1 h-4 w-4 text-red-500" />}
                        {isDueSoon && <FiClock className="ml-1 h-4 w-4 text-yellow-500" />}
                      </div>
                    </td>
                    <td className="text-gray-700">
                      {loan.returnDate ? loan.returnDate.toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        loan.status === 'BORROWED' 
                          ? isOverdue 
                            ? 'bg-red-100 text-red-800' 
                            : isDueSoon
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {loan.status === 'BORROWED' ? 'Dipinjam' : 'Dikembalikan'}
                      </span>
                    </td>
                    {showReturnAction && loan.status === 'BORROWED' && (
                      <td>
                        <button
                          onClick={(e) => handleReturn(loan.id, e)}
                          className="btn-success text-xs py-1.5 px-3 flex items-center"
                          title="Kembalikan buku"
                        >
                          <FiCheckCircle className="h-3.5 w-3.5 mr-1" />
                          Kembalikan
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
          <div className="text-center py-12 text-gray-500">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiClock className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-lg font-medium">Tidak ada data peminjaman</p>
            <p className="text-sm mt-1">Belum ada transaksi peminjaman buku</p>
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