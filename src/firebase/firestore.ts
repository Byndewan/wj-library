import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import type { Book, Member, Loan, LoanStatus } from '../types';

// Books Collection
export const booksCollection = collection(db, 'books');

export const getBooks = () => getDocs(booksCollection);
export const addBook = (book: Omit<Book, 'id'>) => addDoc(booksCollection, book);
export const updateBook = (id: string, book: Partial<Book>) => updateDoc(doc(db, 'books', id), book);
export const deleteBook = (id: string) => deleteDoc(doc(db, 'books', id));

// Members Collection
export const membersCollection = collection(db, 'members');

export const getMembers = () => getDocs(membersCollection);
export const addMember = (member: Omit<Member, 'id'>) => addDoc(membersCollection, member);
export const updateMember = (id: string, member: Partial<Member>) => updateDoc(doc(db, 'members', id), member);
export const deleteMember = (id: string) => deleteDoc(doc(db, 'members', id));

// Loans Collection
export const loansCollection = collection(db, 'loans');

export const getLoans = () => getDocs(loansCollection);

export const addLoan = async (loan: Omit<Loan, 'id'>) => {
  const loanData = {
    ...loan,
    borrowDate: Timestamp.fromDate(loan.borrowDate),
    dueDate: Timestamp.fromDate(loan.dueDate),
    returnDate: loan.returnDate ? Timestamp.fromDate(loan.returnDate) : null
  };
  return await addDoc(loansCollection, loanData);
};

export const updateLoan = async (id: string, loan: Partial<Loan>) => {
  const updateData: any = { ...loan };
  
  // Handle date conversions
  if (loan.borrowDate) updateData.borrowDate = Timestamp.fromDate(loan.borrowDate);
  if (loan.dueDate) updateData.dueDate = Timestamp.fromDate(loan.dueDate);
  if (loan.returnDate) updateData.returnDate = Timestamp.fromDate(loan.returnDate);
  
  return await updateDoc(doc(db, 'loans', id), updateData);
};

export const deleteLoan = (id: string) => deleteDoc(doc(db, 'loans', id));

// Query functions dengan error handling
export const getLoansByMemberId = (memberId: string) => {
  try {
    return query(loansCollection, where('memberId', '==', memberId));
  } catch (error) {
    console.error('Error creating member loans query:', error);
    throw error;
  }
};

export const getLoansByBookId = (bookId: string) => {
  try {
    return query(loansCollection, where('bookId', '==', bookId));
  } catch (error) {
    console.error('Error creating book loans query:', error);
    throw error;
  }
};

export const getActiveLoans = () => {
  try {
    return query(loansCollection, where('status', '==', 'BORROWED'));
  } catch (error) {
    console.error('Error creating active loans query:', error);
    throw error;
  }
};

export const getOverdueLoans = () => {
  try {
    const today = new Date();
    return query(
      loansCollection, 
      where('status', '==', 'BORROWED'),
      where('dueDate', '<', Timestamp.fromDate(today))
    );
  } catch (error) {
    console.error('Error creating overdue loans query:', error);
    throw error;
  }
};