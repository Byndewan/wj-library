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

      if (!loanData.bookIds || loanData.bookIds.length === 0) {
        return {
          success: false,
          error: 'Pilih minimal 1 buku'
        };
      }

      for (const bookId of loanData.bookIds) {
        const book = books.find(b => b.id === bookId);
        if (!book || !book.isActive || (book.stock || 0) <= 0) {
          return {
            success: false,
            error: `Buku "${book?.title || bookId}" tidak tersedia`
          };
        }
      }

      if (loanData.memberId) {
        const member = members.find(m => m.id === loanData.memberId);
        if (!member || !member.isActive) {
          return {
            success: false,
            error: 'Anggota tidak aktif'
          };
        }
      }
      else if (loanData.nonMemberName) {
        if (!loanData.nonMemberName.trim()) {
          return {
            success: false,
            error: 'Nama peminjam non-anggota harus diisi'
          };
        }
        if (!loanData.nonMemberPhone?.trim()) {
          return {
            success: false,
            error: 'Nomor telepon peminjam non-anggota harus diisi'
          };
        }
      } else {
        return {
          success: false,
          error: 'Harap pilih anggota atau isi data non-anggota'
        };
      }

      const loanToCreate: any = {
      ...loanData,
        status: 'BORROWED',
        isMemberLoan: !!loanData.memberId,
        totalBooks: loanData.bookIds.length
      };

      if (loanData.memberId) {
        delete loanToCreate.nonMemberName;
        delete loanToCreate.nonMemberPhone;
        delete loanToCreate.nonMemberClass;
      } else {
        delete loanToCreate.memberId;
      }

      const loanId = await addLoan(loanToCreate);
      
      await fetchLoans();
      
      return {
        success: true,
        data: loanId,
        message: loanData.memberId ? 'Peminjaman berhasil dibuat' : 'Peminjaman non-anggota berhasil dibuat'
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal membuat peminjaman';
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
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal mengembalikan buku';
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
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal menghapus peminjaman';
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

  const getNonMemberLoans = useCallback(async (): Promise<Loan[]> => {
    try {
      const allLoans = await getLoans();
      return allLoans.filter(loan => !loan.memberId && loan.nonMemberName);
    } catch (err) {
      console.error('Error getting non-member loans:', err);
      return [];
    }
  }, []);

  const searchNonMemberLoans = useCallback(async (searchTerm: string): Promise<Loan[]> => {
    try {
      const nonMemberLoans = await getNonMemberLoans();
      return nonMemberLoans.filter(loan =>
        loan.nonMemberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.nonMemberPhone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.nonMemberClass?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (err) {
      console.error('Error searching non-member loans:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    if (loans.length > 0 && books.length > 0 && members.length > 0) {
      const enrichedLoans: LoanWithDetails[] = loans.map(loan => {
        const book = books.find(b => b.id === loan.bookId);
        
        if (loan.memberId) {
          const member = members.find(m => m.id === loan.memberId);
          return {
            ...loan,
            bookTitle: book?.title || 'Buku Tidak Ditemukan',
            memberName: member?.name || 'Anggota Tidak Ditemukan',
            className: member?.className || '-',
            nonMemberInfo: undefined
          };
        } 
        else if (loan.nonMemberName) {
          return {
            ...loan,
            bookTitle: book?.title || 'Buku Tidak Ditemukan',
            memberName: `${loan.nonMemberName} (Non-Anggota)`,
            className: 'Non-Anggota',
            nonMemberInfo: `${loan.nonMemberName} - ${loan.nonMemberPhone || 'No Phone'}${loan.nonMemberClass ? ` - ${loan.nonMemberClass}` : ''}`
          };
        }
        else {
          return {
            ...loan,
            bookTitle: book?.title || 'Buku Tidak Ditemukan',
            memberName: 'Peminjam Tidak Diketahui',
            className: '-',
            nonMemberInfo: undefined
          };
        }
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
    getNonMemberLoans,
    searchNonMemberLoans,
    refreshLoans: fetchLoans
  };
};