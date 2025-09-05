export interface Book {
  id: string;
  code: string;
  title: string;
  author: string;
  genre: string;
  publisher?: string;
  year?: number;
  stock?: number;
  isActive: boolean;
}

export interface Member {
  id: string;
  name: string;
  className: string;
  phone?: string;
  email?: string;
  address?: string;
  userId?: string;
  isActive: boolean;
}

export type UserRole = 'ADMIN' | 'PETUGAS' | 'SISWA';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  memberId?: string;
  isActive: boolean;
}

export type LoanStatus = 'BORROWED' | 'RETURNED';

export interface Loan {
  id: string;
  bookId: string;
  memberId: string;
  staffId?: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: LoanStatus;
  notes?: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  isActive: boolean;
}

export interface LoanWithDetails extends Loan {
  bookTitle: string;
  memberName: string;
  className: string;
}

export interface BookWithAvailability extends Book {
  available: number;
}