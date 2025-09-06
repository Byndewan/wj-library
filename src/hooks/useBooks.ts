import { useState, useEffect, useCallback } from 'react';
import { 
  getBooks, 
  addBook, 
  updateBook, 
  deleteBook,
  getBookById,
  searchBooks
} from '../firebase/firestore';
import type { Book, BookFormData, ApiResponse } from '../types';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const booksData = await getBooks();
      setBooks(booksData);
    } catch (err) {
      setError('Gagal memuat data buku');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getBook = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const book = await getBookById(id);
      setSelectedBook(book);
      return book;
    } catch (err) {
      setError('Gagal mengambil data buku');
      console.error('Error getting book:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBook = useCallback(async (bookData: BookFormData): Promise<ApiResponse<string>> => {
    try {
      setLoading(true);
      setError(null);
      
      const existingBook = books.find(book => book.code === bookData.code);
      if (existingBook) {
        return {
          success: false,
          error: 'Kode buku sudah digunakan'
        };
      }

      const bookId = await addBook(bookData);
      await fetchBooks();
      
      return {
        success: true,
        data: bookId,
        message: 'Buku berhasil ditambahkan'
      };
    } catch (err) {
      const errorMsg = 'Gagal menambahkan buku';
      setError(errorMsg);
      console.error('Error creating book:', err);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  }, [books, fetchBooks]);

  const editBook = useCallback(async (id: string, bookData: Partial<BookFormData>): Promise<ApiResponse<void>> => {
    try {
      setLoading(true);
      setError(null);

      if (bookData.code) {
        const existingBook = books.find(book => book.code === bookData.code && book.id !== id);
        if (existingBook) {
          return {
            success: false,
            error: 'Kode buku sudah digunakan'
          };
        }
      }

      await updateBook(id, bookData);
      await fetchBooks();
      
      return {
        success: true,
        message: 'Buku berhasil diperbarui'
      };
    } catch (err) {
      const errorMsg = 'Gagal memperbarui buku';
      setError(errorMsg);
      console.error('Error updating book:', err);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  }, [books, fetchBooks]);

  const removeBook = useCallback(async (id: string): Promise<ApiResponse<void>> => {
    try {
      setLoading(true);
      setError(null);

      const book = books.find(b => b.id === id);
      if (book && (book.stock || 0) < 1) {
        return {
          success: false,
          error: 'Tidak dapat menghapus buku yang sedang dipinjam'
        };
      }

      await deleteBook(id);
      await fetchBooks();
      
      return {
        success: true,
        message: 'Buku berhasil dihapus'
      };
    } catch (err) {
      const errorMsg = 'Gagal menghapus buku';
      setError(errorMsg);
      console.error('Error deleting book:', err);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  }, [books, fetchBooks]);

  const searchBooksByTerm = useCallback(async (searchTerm: string): Promise<Book[]> => {
    try {
      if (!searchTerm.trim()) {
        return books;
      }
      return await searchBooks(searchTerm);
    } catch (err) {
      console.error('Error searching books:', err);
      return books;
    }
  }, [books]);

  const getAvailableBooks = useCallback(() => {
    return books.filter(book => book.isActive && (book.stock || 0) > 0);
  }, [books]);

  const getBooksByGenre = useCallback((genre: string) => {
    return books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
  }, [books]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    loading,
    error,
    selectedBook,
    getBook,
    createBook,
    editBook,
    removeBook,
    searchBooks: searchBooksByTerm,
    getAvailableBooks,
    getBooksByGenre,
    refreshBooks: fetchBooks
  };
};