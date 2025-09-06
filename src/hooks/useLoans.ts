import { useState, useEffect, useCallback } from 'react';
import { 
  getLoans, 
  addLoan, 
  updateLoan, 
  deleteLoan,
  getActiveLoans,
  getOverdueLoans,
  getLoanById,
  getLoansByMemberId,
  getLoansByBookId
} from '../firebase/firestore';
import type { Loan, LoanWithDetails, LoanFormData, ApiResponse } from '../types';
import { useBooks } from './useBooks';
import { useMembers } from './useMembers';

export const useLoans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loansWithDetails, setLoansWithDetails] = useState<LoanWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const { books } = useBooks();
  const { members } = useMembers();

  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loansData = await getLoans();
      setLoans(loansData);
    } catch (err) {
      setError('Gagal memuat data peminjaman');
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getLoan = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const loan = await getLoanById(id);
      setSelectedLoan(loan);
      return loan;
    } catch (err) {
      setError('Gagal mengambil data peminjaman');
      console.error('Error getting loan:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createLoan = useCallback(async (loanData: LoanFormData): Promise<ApiResponse<string>> => {
    try {
      setLoading(true);
      setError(null);

      const book = books.find(b => b.id === loanData.bookId);
      if (!book || !book.isActive || (book.stock || 0) <= 0) {
        return {
          success: false,
          error: 'Buku tidak tersedia untuk dipinjam'
        };
      }

      const member = members.find(m => m.id === loanData.memberId);
      if (!member || !member.isActive) {
        return {
          success: false,
          error: 'Anggota tidak aktif'
        };
      }

      const loanId = await addLoan({
        ...loanData,
        status: 'BORROWED'
      });
      
      await fetchLoans();
      
      return {
        success: true,
        data: loanId,
        message: 'Peminjaman berhasil dibuat'
      };
    } catch (err) {
      const errorMsg = 'Gagal membuat peminjaman';
      setError(errorMsg);
      console.error('Error creating loan:', err);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  }, [books, members, fetchLoans]);

  const returnLoan = useCallback(async (id: string): Promise<ApiResponse<void>> => {
    try {
      setLoading(true);
      setError(null);

      await updateLoan(id, {
        status: 'RETURNED',
        returnDate: new Date()
      });
      
      await fetchLoans();
      
      return {
        success: true,
        message: 'Buku berhasil dikembalikan'
      };
    } catch (err) {
      const errorMsg = 'Gagal mengembalikan buku';
      setError(errorMsg);
      console.error('Error returning loan:', err);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  }, [fetchLoans]);

  const removeLoan = useCallback(async (id: string): Promise<ApiResponse<void>> => {
    try {
      setLoading(true);
      setError(null);

      await deleteLoan(id);
      await fetchLoans();
      
      return {
        success: true,
        message: 'Peminjaman berhasil dihapus'
      };
    } catch (err) {
      const errorMsg = 'Gagal menghapus peminjaman';
      setError(errorMsg);
      console.error('Error deleting loan:', err);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  }, [fetchLoans]);

  const fetchActiveLoans = useCallback(async () => {
    try {
      setLoading(true);
      const activeLoans = await getActiveLoans();
      setLoans(activeLoans);
    } catch (err) {
      setError('Gagal memuat peminjaman aktif');
      console.error('Error fetching active loans:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOverdueLoans = useCallback(async () => {
    try {
      setLoading(true);
      const overdueLoans = await getOverdueLoans();
      setLoans(overdueLoans);
    } catch (err) {
      setError('Gagal memuat peminjaman terlambat');
      console.error('Error fetching overdue loans:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMemberLoans = useCallback(async (memberId: string) => {
    try {
      return await getLoansByMemberId(memberId);
    } catch (err) {
      console.error('Error getting member loans:', err);
      return [];
    }
  }, []);

  const getBookLoans = useCallback(async (bookId: string) => {
    try {
      return await getLoansByBookId(bookId);
    } catch (err) {
      console.error('Error getting book loans:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    if (loans.length > 0 && books.length > 0 && members.length > 0) {
      const enrichedLoans: LoanWithDetails[] = loans.map(loan => {
        const book = books.find(b => b.id === loan.bookId);
        const member = members.find(m => m.id === loan.memberId);
        
        return {
          ...loan,
          bookTitle: book?.title || 'Buku Tidak Ditemukan',
          memberName: member?.name || 'Anggota Tidak Ditemukan',
          className: member?.className || '-'
        };
      });
      
      setLoansWithDetails(enrichedLoans);
    }
  }, [loans, books, members]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  return {
    loans,
    loansWithDetails,
    loading,
    error,
    selectedLoan,
    getLoan,
    createLoan,
    returnLoan,
    removeLoan,
    fetchActiveLoans,
    fetchOverdueLoans,
    getMemberLoans,
    getBookLoans,
    refreshLoans: fetchLoans
  };
};