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
  Timestamp,
  limit,
  startAfter,
  DocumentSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import type { Book, Member, Loan, LoanStatus, AppUser } from '../types';

// Collection references
export const booksCollection = collection(db, 'books');
export const membersCollection = collection(db, 'members');
export const loansCollection = collection(db, 'loans');
export const usersCollection = collection(db, 'users');

export const getBooks = async (): Promise<Book[]> => {
  try {
    const snapshot = await getDocs(query(booksCollection, orderBy('title')));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Book));
  } catch (error) {
    console.error('Error getting books:', error);
    throw error;
  }
};

export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'books', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Book;
    }
    return null;
  } catch (error) {
    console.error('Error getting book:', error);
    throw error;
  }
};

export const addBook = async (book: Omit<Book, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(booksCollection, {
      ...book,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const updateBook = async (id: string, book: Partial<Book>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'books', id), {
      ...book,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const deleteBook = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'books', id));
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

export const searchBooks = async (searchTerm: string): Promise<Book[]> => {
  try {
    const books = await getBooks();
    return books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

export const getMembers = async (): Promise<Member[]> => {
  try {
    const snapshot = await getDocs(query(membersCollection, orderBy('name')));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Member));
  } catch (error) {
    console.error('Error getting members:', error);
    throw error;
  }
};

export const getMemberById = async (id: string): Promise<Member | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'members', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Member;
    }
    return null;
  } catch (error) {
    console.error('Error getting member:', error);
    throw error;
  }
};

export const addMember = async (member: Omit<Member, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(membersCollection, {
      ...member,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
};

export const updateMember = async (id: string, member: Partial<Member>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'members', id), {
      ...member,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

export const deleteMember = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'members', id));
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};

export const getLoans = async (): Promise<Loan[]> => {
  try {
    const snapshot = await getDocs(query(loansCollection, orderBy('borrowDate', 'desc')));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        borrowDate: data.borrowDate?.toDate() || new Date(),
        dueDate: data.dueDate?.toDate() || new Date(),
        returnDate: data.returnDate?.toDate()
      } as Loan;
    });
  } catch (error) {
    console.error('Error getting loans:', error);
    throw error;
  }
};

export const getLoanById = async (id: string): Promise<Loan | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'loans', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        borrowDate: data.borrowDate?.toDate() || new Date(),
        dueDate: data.dueDate?.toDate() || new Date(),
        returnDate: data.returnDate?.toDate()
      } as Loan;
    }
    return null;
  } catch (error) {
    console.error('Error getting loan:', error);
    throw error;
  }
};

export const addLoan = async (loan: Omit<Loan, 'id'>): Promise<string> => {
  try {
    const loanData = {
      ...loan,
      borrowDate: Timestamp.fromDate(loan.borrowDate),
      dueDate: Timestamp.fromDate(loan.dueDate),
      returnDate: loan.returnDate ? Timestamp.fromDate(loan.returnDate) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(loansCollection, loanData);
    
    if (loan.bookId) {
      const book = await getBookById(loan.bookId);
      if (book && book.stock !== undefined && book.stock > 0) {
        await updateBook(loan.bookId, { stock: book.stock - 1 });
      }
    }

    return docRef.id;
  } catch (error) {
    console.error('Error adding loan:', error);
    throw error;
  }
};

export const updateLoan = async (id: string, loan: Partial<Loan>): Promise<void> => {
  try {
    const updateData: any = { ...loan, updatedAt: new Date() };
    
    if (loan.borrowDate) updateData.borrowDate = Timestamp.fromDate(loan.borrowDate);
    if (loan.dueDate) updateData.dueDate = Timestamp.fromDate(loan.dueDate);
    if (loan.returnDate) updateData.returnDate = Timestamp.fromDate(loan.returnDate);
    
    await updateDoc(doc(db, 'loans', id), updateData);

    if (loan.status === 'RETURNED') {
      const existingLoan = await getLoanById(id);
      if (existingLoan?.bookId) {
        const book = await getBookById(existingLoan.bookId);
        if (book && book.stock !== undefined) {
          await updateBook(existingLoan.bookId, { stock: book.stock + 1 });
        }
      }
    }
  } catch (error) {
    console.error('Error updating loan:', error);
    throw error;
  }
};

export const deleteLoan = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'loans', id));
  } catch (error) {
    console.error('Error deleting loan:', error);
    throw error;
  }
};

export const getActiveLoans = async (): Promise<Loan[]> => {
  try {
    const snapshot = await getDocs(query(
      loansCollection, 
      where('status', '==', 'BORROWED'),
      orderBy('dueDate')
    ));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        borrowDate: data.borrowDate?.toDate() || new Date(),
        dueDate: data.dueDate?.toDate() || new Date(),
        returnDate: data.returnDate?.toDate()
      } as Loan;
    });
  } catch (error) {
    console.error('Error getting active loans:', error);
    throw error;
  }
};

export const getOverdueLoans = async (): Promise<Loan[]> => {
  try {
    const today = new Date();
    const snapshot = await getDocs(query(
      loansCollection, 
      where('status', '==', 'BORROWED'),
      where('dueDate', '<', Timestamp.fromDate(today))
    ));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        borrowDate: data.borrowDate?.toDate() || new Date(),
        dueDate: data.dueDate?.toDate() || new Date(),
        returnDate: data.returnDate?.toDate()
      } as Loan;
    });
  } catch (error) {
    console.error('Error getting overdue loans:', error);
    throw error;
  }
};

export const getLoansByMemberId = async (memberId: string): Promise<Loan[]> => {
  try {
    const snapshot = await getDocs(query(
      loansCollection, 
      where('memberId', '==', memberId),
      orderBy('borrowDate', 'desc')
    ));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        borrowDate: data.borrowDate?.toDate() || new Date(),
        dueDate: data.dueDate?.toDate() || new Date(),
        returnDate: data.returnDate?.toDate()
      } as Loan;
    });
  } catch (error) {
    console.error('Error getting member loans:', error);
    throw error;
  }
};

export const getLoansByBookId = async (bookId: string): Promise<Loan[]> => {
  try {
    const snapshot = await getDocs(query(
      loansCollection, 
      where('bookId', '==', bookId),
      orderBy('borrowDate', 'desc')
    ));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        borrowDate: data.borrowDate?.toDate() || new Date(),
        dueDate: data.dueDate?.toDate() || new Date(),
        returnDate: data.returnDate?.toDate()
      } as Loan;
    });
  } catch (error) {
    console.error('Error getting book loans:', error);
    throw error;
  }
};

export const getUsers = async (): Promise<AppUser[]> => {
  try {
    const snapshot = await getDocs(query(usersCollection, orderBy('name')));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AppUser));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const getLibraryStats = async () => {
  try {
    const [booksSnapshot, membersSnapshot, loansSnapshot, activeLoansSnapshot] = await Promise.all([
      getDocs(booksCollection),
      getDocs(membersCollection),
      getDocs(loansCollection),
      getDocs(query(loansCollection, where('status', '==', 'BORROWED')))
    ]);

    const totalBooks = booksSnapshot.size;
    const totalMembers = membersSnapshot.size;
    const totalLoans = loansSnapshot.size;
    const activeLoans = activeLoansSnapshot.size;
    const activeBooks = booksSnapshot.docs.filter(doc => doc.data().isActive).length;
    const activeMembers = membersSnapshot.docs.filter(doc => doc.data().isActive).length;

    const today = new Date();
    const overdueLoans = activeLoansSnapshot.docs.filter(doc => {
      const dueDate = doc.data().dueDate?.toDate();
      return dueDate && dueDate < today;
    }).length;

    return {
      totalBooks,
      activeBooks,
      totalMembers,
      activeMembers,
      totalLoans,
      activeLoans,
      overdueLoans
    };
  } catch (error) {
    console.error('Error getting library stats:', error);
    throw error;
  }
};