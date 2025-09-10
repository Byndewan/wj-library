import React, { useState } from 'react';
import type { LoanWithDetails, Book } from '../types';
import LoanDetailModal from './LoanDetailModal';
import { FiClock, FiCheckCircle } from 'react-icons/fi';
import { useBooks } from '../hooks/useBooks';
import { GiOpenBook } from 'react-icons/gi';

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
  const { books } = useBooks();

  const processedLoans = loans.map(loan => {
    const booksInfo = loan.bookIds.map(bookId => {
      const book = books.find(b => b.id === bookId);
      return book?.title || 'Buku Tidak Ditemukan';
    });

    let displayName = loan.memberName || 'Unknown';
    let displayClass = loan.className || '';

    if (!loan.memberId && loan.nonMemberName) {
      displayName = `${loan.nonMemberName}`;
      displayClass = 'Non-Anggota';
    }

    return {
      ...loan,
      bookTitles: booksInfo,
      memberName: displayName,
      className: displayClass,
      nonMemberInfo: loan.nonMemberName ?
        `${loan.nonMemberName} - ${loan.nonMemberPhone || 'No Phone'}` :
        undefined
    };
  });

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="card sm:text-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-sans">
            <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Buku yang Dipinjam</th>
                <th className="px-4 py-3 text-left">Peminjam</th>
                <th className="px-4 py-3 text-left">Kelas</th>
                <th className="px-4 py-3 text-left">Tanggal Pinjam</th>
                <th className="px-4 py-3 text-left">Tanggal Jatuh Tempo</th>
                <th className="px-4 py-3 text-left">Tanggal Kembali</th>
                <th className="px-4 py-3 text-left">Status</th>
                {showReturnAction && <th className="px-4 py-3 text-left">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {processedLoans.map((loan) => {
                const isOverdue = loan.status === 'BORROWED' && new Date() > loan.dueDate;
                const isDueSoon = loan.status === 'BORROWED' &&
                  new Date(loan.dueDate.getTime() - 3 * 24 * 60 * 60 * 1000) < new Date() &&
                  !isOverdue;

                return (
                  <tr
                    key={loan.id}
                    className={`
                      hover:bg-red-50 cursor-pointer
                      ${isOverdue ? 'bg-red-50' : ''}
                      ${isDueSoon ? 'bg-yellow-50' : ''}
                      ${!loan.memberId ? 'bg-purple-50' : ''}
                    `}
                    onClick={() => handleViewDetails(loan)}
                  >
                    <td className="font-medium text-gray-900 px-2 py-3">
                      <div className="max-w-xs ml-2">
                        {loan.bookTitles.slice(0, 2).map((title, index) => (
                          <div key={index} className="text-xs flex mb-1">
                            <GiOpenBook className="mr-2 h-5 w-5 text-red-500" /> {title}
                          </div>
                        ))}
                        {loan.bookTitles.length > 2 && (
                          <div className="text-xs text-gray-500 mt-1">
                            +{loan.bookTitles.length - 2} buku lainnya...
                          </div>
                        )}
                        <div className="text-xs text-red-600 mt-1">
                          Total: {loan.bookIds.length} buku
                        </div>
                      </div>
                    </td>
                    <td className="text-gray-700 px-4 py-3">
                      {loan.memberName}
                      {!loan.memberId && (
                        <span className="ml-1 text-xs text-purple-600">(Non-Anggota)</span>
                      )}
                    </td>
                    <td className="text-gray-700 px-4 py-3">{loan.nonMemberClass ?? loan.className}</td>
                    <td className="text-gray-700 px-4 py-3">{loan.borrowDate.toLocaleDateString('id-ID')}</td>
                    <td className={`px-4 py-3 font-medium ${isOverdue ? 'text-red-600' : ''} ${isDueSoon ? 'text-yellow-600' : 'text-gray-700'}`}>
                      <div className="flex items-center">
                        {loan.dueDate.toLocaleDateString('id-ID')}
                        {isOverdue && <FiClock className="ml-1 h-4 w-4 text-red-500" />}
                        {isDueSoon && <FiClock className="ml-1 h-4 w-4 text-yellow-500" />}
                      </div>
                    </td>
                    <td className="text-gray-700 px-4 py-3">
                      {loan.returnDate ? loan.returnDate.toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${loan.status === 'BORROWED'
                          ? isOverdue
                            ? 'bg-red-100 text-red-800'
                            : isDueSoon
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                        }`}>
                        {loan.status === 'BORROWED' ? 'Dipinjam' : 'Dikembalikan'}
                      </span>
                    </td>
                    {showReturnAction && loan.status === 'BORROWED' && (
                      <td className="px-4 py-3">
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