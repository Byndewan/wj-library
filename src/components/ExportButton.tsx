import React from 'react';
import { exportSpreadsheet } from '../utils/exportSpreadsheet';
import type { LoanWithDetails } from '../types';
import { FiDownload } from 'react-icons/fi';

interface ExportButtonProps {
  data: LoanWithDetails[];
  filename: string;
  label: string;
  variant?: 'primary' | 'success' | 'secondary';
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  filename, 
  label, 
  variant = 'success' 
}) => {
  const handleExport = () => {
    const exportData = data.map(loan => ({
      'ID Peminjaman': loan.id,
      'Judul Buku': loan.bookTitles,
      'Nama Anggota': loan.memberName,
      'Kelas': loan.className,
      'Alamat': loan.address || '',
      'Tanggal Pinjam': loan.borrowDate.toLocaleDateString('id-ID'),
      'Tanggal Jatuh Tempo': loan.dueDate.toLocaleDateString('id-ID'),
      'Tanggal Kembali': loan.returnDate ? loan.returnDate.toLocaleDateString('id-ID') : 'Belum Dikembalikan',
      'Status': loan.status === 'BORROWED' ? 'Dipinjam' : 'Dikembalikan',
      'Keterlambatan': loan.status === 'BORROWED' && new Date() > loan.dueDate 
        ? `${Math.ceil((new Date().getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24))} hari` 
        : 'Tidak',
      'Catatan': loan.notes || ''
    }));

    exportSpreadsheet(exportData, filename);
  };

  const getButtonClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'success':
      default:
        return 'btn-success';
    }
  };

  return (
    <button
      onClick={handleExport}
      className={`${getButtonClass()} flex items-center space-x-2`}
      title="Export data ke Excel"
    >
      <FiDownload className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
};

export default ExportButton;