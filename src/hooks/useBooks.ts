import { useState, useEffect } from 'react';
import { 
  getBooks, 
  addBook, 
  updateBook, 
  deleteBook 
} from '../firebase/firestore';
import type { Book } from '../types';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const snapshot = await getBooks();
      
      // Pastikan snapshot dan docs ada
      if (!snapshot || !snapshot.docs) {
        setBooks([]);
        return;
      }
      
      const booksData: Book[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Book));
      setBooks(booksData);
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (bookData: Omit<Book, 'id'>) => {
    try {
      await addBook(bookData);
      await fetchBooks(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to create book');
      console.error(err);
      return false;
    }
  };

  const editBook = async (id: string, bookData: Partial<Book>) => {
    try {
      await updateBook(id, bookData);
      await fetchBooks();
      return true;
    } catch (err) {
      setError('Failed to update book');
      console.error(err);
      return false;
    }
  };

  const removeBook = async (id: string) => {
    try {
      await deleteBook(id);
      await fetchBooks(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to delete book');
      console.error(err);
      return false;
    }
  };

  return {
    books,
    loading,
    error,
    createBook,
    editBook,
    removeBook,
    refreshBooks: fetchBooks
  };
};