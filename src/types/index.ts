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
  createdAt?: Date;
  updatedAt?: Date;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRole = 'ADMIN' | 'PETUGAS' | 'SISWA';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  memberId?: string;
  isActive: boolean;
  className?: string;
  phone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoanWithDetails extends Loan {
  bookTitle: string;
  memberName: string;
  className: string;
}

export interface BookWithAvailability extends Book {
  available: number;
}

export interface LibraryStats {
  totalBooks: number;
  activeBooks: number;
  totalMembers: number;
  activeMembers: number;
  totalLoans: number;
  activeLoans: number;
  overdueLoans: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  filter?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BookFormData {
  code: string;
  title: string;
  author: string;
  genre: string;
  publisher?: string;
  year?: number;
  stock?: number;
  isActive: boolean;
}

export interface MemberFormData {
  name: string;
  className: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
}

export interface LoanFormData {
  bookId: string;
  memberId: string;
  borrowDate: Date;
  dueDate: Date;
  notes?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  className?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
}

export interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  overdueLoans: number;
  recentLoans: LoanWithDetails[];
  popularBooks: Book[];
}

export interface LoanReport {
  period: string;
  totalLoans: number;
  returnedLoans: number;
  overdueLoans: number;
  mostBorrowedBook?: string;
  mostActiveMember?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface LibrarySettings {
  loanDuration: number; // in days
  maxLoansPerMember: number;
  overdueFinePerDay: number;
  libraryName: string;
  libraryAddress: string;
  libraryPhone: string;
  libraryEmail: string;
}