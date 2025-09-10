import React from 'react';
import type { LoanWithDetails } from '../types';
import { FiX, FiBook, FiUser, FiCalendar, FiClock, FiAlertCircle } from 'react-icons/fi';

interface LoanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: LoanWithDetails | null;
}

const LoanDetailModal: React.FC<LoanDetailModalProps> = ({ isOpen, onClose, loan }) => {
  if (!isOpen || !loan) return null;

  const isOverdue = loan.status === 'BORROWED' && new Date() > loan.dueDate;
  const isDueSoon = loan.status === 'BORROWED' &&
    new Date(loan.dueDate.getTime() - 3 * 24 * 60 * 60 * 1000) < new Date() &&
    !isOverdue;

  const isNonMember = !loan.memberId;

  const getStatusColor = () => {
    if (loan.status === 'RETURNED') return 'text-green-600 bg-green-100';
    if (isOverdue) return 'text-red-600 bg-red-100';
    if (isDueSoon) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusText = () => {
    if (loan.status === 'RETURNED') return 'Telah Dikembalikan';
    if (isOverdue) return 'Terlambat';
    if (isDueSoon) return 'Segera Jatuh Tempo';
    return 'Sedang Dipinjam';
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Detail Peminjaman</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Informasi Buku */}
            <div className="bg-red-50 p-1 rounded-lg">
              <div className="space-y-2">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-red-800 mb-3 flex items-center">
                    <FiBook className="mr-2 h-5 w-5" />
                    Informasi Buku ({loan.bookIds.length} buku)
                  </h3>
                  <div className="space-y-2">
                    {loan.bookTitles.map((title, index) => (
                      <div key={index}>
                        <span className="font-semibold text-red-700">Buku {index + 1}:</span>
                        <p className="text-red-900">{title}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='p-4'>
                  <span className="font-semibold text-red-700">ID Buku:</span>
                  <p className="text-red-900 font-mono text-sm truncate max-w-[200px]">
                    {loan.bookIds}
                  </p>
                </div>
              </div>
            </div>

            {/* Informasi Peminjam */}
            <div className={isNonMember ? "bg-purple-50 p-4 rounded-lg" : "bg-green-50 p-4 rounded-lg"}>
              <h3 className={`text-lg font-medium mb-3 flex items-center ${isNonMember ? "text-purple-800" : "text-green-800"
                }`}>
                <FiUser className="mr-2 h-5 w-5" />
                {isNonMember ? 'Informasi Non-Anggota' : 'Informasi Anggota'}
              </h3>
              <div className="space-y-2">
                {isNonMember ? (
                  <>
                    <div>
                      <span className="font-semibold text-purple-700">Nama:</span>
                      <p className="text-purple-900">{loan.nonMemberName}</p>
                    </div>
                    {loan.nonMemberPhone && (
                      <div>
                        <span className="font-semibold text-purple-700">Telepon:</span>
                        <p className="text-purple-900">{loan.nonMemberPhone}</p>
                      </div>
                    )}
                    {loan.nonMemberClass && (
                      <div>
                        <span className="font-semibold text-purple-700">Email:</span>
                        <p className="text-purple-900">{loan.nonMemberClass}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-purple-700">Status:</span>
                      <p className="text-purple-900">Non-Anggota</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="font-semibold text-green-700">Nama:</span>
                      <p className="text-green-900">{loan.memberName}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-green-700">Kelas:</span>
                      <p className="text-green-900">{loan.className}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-green-700">ID Anggota:</span>
                      <p className="text-green-900 font-mono text-sm">{loan.memberId}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn-outline"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailModal;