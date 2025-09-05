import { useState, useEffect } from 'react';
import { 
  getLoans, 
  addLoan, 
  updateLoan, 
  deleteLoan,
  getActiveLoans,
  getOverdueLoans
} from '../firebase/firestore';
import type { Loan, LoanWithDetails } from '../types';
import { useBooks } from './useBooks';
import { useMembers } from './useMembers';

export const useLoans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loansWithDetails, setLoansWithDetails] = useState<LoanWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { books } = useBooks();
  const { members } = useMembers();

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    if (loans.length > 0 && books.length > 0 && members.length > 0) {
      const loansWithDetailsData = loans.map(loan => {
        const book = books.find(b => b.id === loan.bookId);
        const member = members.find(m => m.id === loan.memberId);
        
        return {
          ...loan,
          bookTitle: book?.title || 'Unknown Book',
          memberName: member?.name || 'Unknown Member',
          className: member?.className || 'Unknown Class'
        };
      });
      
      setLoansWithDetails(loansWithDetailsData);
    }
  }, [loans, books, members]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const snapshot = await getLoans();
      
      // Pastikan snapshot dan docs ada
      if (!snapshot || !snapshot.docs) {
        setLoans([]);
        return;
      }
      
      const loansData: Loan[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          borrowDate: data.borrowDate?.toDate() || new Date(),
          dueDate: data.dueDate?.toDate() || new Date(),
          returnDate: data.returnDate?.toDate()
        } as Loan;
      });
      setLoans(loansData);
    } catch (err) {
      setError('Failed to fetch loans');
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const createLoan = async (loanData: Omit<Loan, 'id'>) => {
    try {
      await addLoan(loanData);
      await fetchLoans();
      return true;
    } catch (err) {
      setError('Failed to create loan');
      console.error('Error creating loan:', err);
      return false;
    }
  };

  const editLoan = async (id: string, loanData: Partial<Loan>) => {
    try {
      await updateLoan(id, loanData);
      await fetchLoans();
      return true;
    } catch (err) {
      setError('Failed to update loan');
      console.error('Error updating loan:', err);
      return false;
    }
  };

  const removeLoan = async (id: string) => {
    try {
      await deleteLoan(id);
      await fetchLoans();
      return true;
    } catch (err) {
      setError('Failed to delete loan');
      console.error('Error deleting loan:', err);
      return false;
    }
  };

  const returnLoan = async (id: string) => {
    try {
      await updateLoan(id, {
        status: 'RETURNED',
        returnDate: new Date()
      });
      await fetchLoans();
      return true;
    } catch (err) {
      setError('Failed to return loan');
      console.error('Error returning loan:', err);
      return false;
    }
  };

  const fetchActiveLoans = async () => {
    try {
      setLoading(true);
      const snapshot = await getActiveLoans();
      
      // Pastikan snapshot dan docs ada
      if (!snapshot || !snapshot.docs) {
        setLoans([]);
        return;
      }
      
      const loansData: Loan[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          borrowDate: data.borrowDate?.toDate() || new Date(),
          dueDate: data.dueDate?.toDate() || new Date(),
          returnDate: data.returnDate?.toDate()
        } as Loan;
      });
      setLoans(loansData);
    } catch (err) {
      setError('Failed to fetch active loans');
      console.error('Error fetching active loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverdueLoans = async () => {
    try {
      setLoading(true);
      const snapshot = await getOverdueLoans();
      
      // Pastikan snapshot dan docs ada
      if (!snapshot || !snapshot.docs) {
        setLoans([]);
        return;
      }
      
      const loansData: Loan[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          borrowDate: data.borrowDate?.toDate() || new Date(),
          dueDate: data.dueDate?.toDate() || new Date(),
          returnDate: data.returnDate?.toDate()
        } as Loan;
      });
      setLoans(loansData);
    } catch (err) {
      setError('Failed to fetch overdue loans');
      console.error('Error fetching overdue loans:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loans,
    loansWithDetails,
    loading,
    error,
    createLoan,
    editLoan,
    removeLoan,
    returnLoan,
    refreshLoans: fetchLoans,
    fetchActiveLoans,
    fetchOverdueLoans
  };
};