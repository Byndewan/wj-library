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

  const getStatusColor = () => {
    if (loan.status === 'RETURNED') return 'text-green-600 bg-green-100';
    if (isOverdue) return 'text-red-600 bg-red-100';
    if (isDueSoon) return 'text-yellow-600 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getStatusText = () => {
    if (loan.status === 'RETURNED') return 'Telah Dikembalikan';
    if (isOverdue) return 'Terlambat';
    if (isDueSoon) return 'Segera Jatuh Tempo';
    return 'Sedang Dipinjam';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800 mb-3 flex items-center">
                <FiBook className="mr-2 h-5 w-5" />
                Informasi Buku
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-blue-700">Judul:</span>
                  <p className="text-blue-900">{loan.bookTitle}</p>
                </div>
                <div>
                  <span className="font-semibold text-blue-700">ID Buku:</span>
                  <p className="text-blue-900 font-mono text-sm">{loan.bookId}</p>
                </div>
              </div>
            </div>

            {/* Informasi Anggota */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 mb-3 flex items-center">
                <FiUser className="mr-2 h-5 w-5" />
                Informasi Anggota
              </h3>
              <div className="space-y-2">
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
              </div>
            </div>
          </div>

          {/* Informasi Peminjaman */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
              <FiCalendar className="mr-2 h-5 w-5" />
              Informasi Peminjaman
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-semibold text-gray-700">Tanggal Pinjam:</span>
                <p className="text-gray-900">{loan.borrowDate.toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Tanggal Jatuh Tempo:</span>
                <p className={`text-gray-900 ${isOverdue ? 'text-red-600 font-bold' : ''} ${isDueSoon ? 'text-yellow-600' : ''}`}>
                  {loan.dueDate.toLocaleDateString('id-ID')}
                  {isOverdue && ' (Terlambat)'}
                  {isDueSoon && ' (Segera)'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Tanggal Kembali:</span>
                <p className="text-gray-900">
                  {loan.returnDate ? loan.returnDate.toLocaleDateString('id-ID') : 'Belum Dikembalikan'}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-purple-800 mb-3">Status</h3>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-2 rounded-full text-sm font-medium ${getStatusColor()} flex items-center`}>
                {getStatusText()}
              </span>
              {isOverdue && (
                <span className="text-red-600 text-sm flex items-center">
                  <FiAlertCircle className="mr-1 h-4 w-4" />
                  Terlambat {(Math.ceil((new Date().getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24)))} hari
                </span>
              )}
            </div>
          </div>

          {/* Catatan */}
          {loan.notes && (
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-yellow-800 mb-3">Catatan</h3>
              <p className="text-yellow-900">{loan.notes}</p>
            </div>
          )}

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