import * as XLSX from 'xlsx';
import type { LoanWithDetails } from '../types';

export const exportSpreadsheet = (data: any[], filename: string): void => {
  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    XLSX.writeFile(workbook, filename);
    
    console.log(`Exported ${data.length} records to ${filename}`);
  } catch (error) {
    console.error('Error exporting spreadsheet:', error);
    throw new Error('Gagal mengekspor data ke Excel');
  }
};

export const exportLoansToExcel = (loans: LoanWithDetails[], filename: string = `laporan-peminjaman-${new Date().toISOString().split('T')[0]}.xlsx`): void => {
  const exportData = loans.map(loan => ({
    'ID Peminjaman': loan.id,
    'Judul Buku': loan.bookTitle,
    'Nama Anggota': loan.memberName,
    'Kelas': loan.className,
    'Tanggal Pinjam': loan.borrowDate.toLocaleDateString('id-ID'),
    'Tanggal Jatuh Tempo': loan.dueDate.toLocaleDateString('id-ID'),
    'Tanggal Kembali': loan.returnDate ? loan.returnDate.toLocaleDateString('id-ID') : 'Belum Dikembalikan',
    'Status': loan.status === 'BORROWED' ? 'Dipinjam' : 'Dikembalikan',
    'Lama Peminjaman': loan.status === 'RETURNED' && loan.returnDate
      ? `${Math.ceil((loan.returnDate.getTime() - loan.borrowDate.getTime()) / (1000 * 60 * 60 * 24))} hari`
      : 'Masih Dipinjam',
    'Keterlambatan': loan.status === 'BORROWED' && new Date() > loan.dueDate
      ? `${Math.ceil((new Date().getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24))} hari`
      : 'Tidak',
    'Catatan': loan.notes || '-'
  }));

  exportSpreadsheet(exportData, filename);
};

export const exportBooksToExcel = (books: any[], filename: string = `laporan-buku-${new Date().toISOString().split('T')[0]}.xlsx`): void => {
  const exportData = books.map(book => ({
    'Kode Buku': book.code,
    'Judul': book.title,
    'Pengarang': book.author,
    'Genre': book.genre,
    'Penerbit': book.publisher || '-',
    'Tahun Terbit': book.year || '-',
    'Stok': book.stock || 0,
    'Status': book.isActive ? 'Aktif' : 'Nonaktif',
    'Tersedia': (book.stock || 0) > 0 ? 'Ya' : 'Tidak'
  }));

  exportSpreadsheet(exportData, filename);
};

export const exportMembersToExcel = (members: any[], filename: string = `laporan-anggota-${new Date().toISOString().split('T')[0]}.xlsx`): void => {
  const exportData = members.map(member => ({
    'Nama': member.name,
    'Kelas': member.className,
    'Email': member.email || '-',
    'Telepon': member.phone || '-',
    'Alamat': member.address || '-',
    'Status': member.isActive ? 'Aktif' : 'Nonaktif'
  }));

  exportSpreadsheet(exportData, filename);
};

export const formatDateForExcel = (date: Date): string => {
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const autoAdjustColumns = (worksheet: XLSX.WorkSheet): void => {
  const colWidths: number[] = [];
  
  XLSX.utils.sheet_to_json(worksheet, { header: 1 }).forEach((row: any) => {
    row.forEach((cell: any, colIndex: number) => {
      const length = cell ? cell.toString().length : 10;
      if (!colWidths[colIndex] || colWidths[colIndex] < length) {
        colWidths[colIndex] = length;
      }
    });
  });
  
  worksheet['!cols'] = colWidths.map(width => ({ width: width + 2 }));
};