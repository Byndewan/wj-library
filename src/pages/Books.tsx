import React from 'react';
import BookTable from '../components/BookTable';
import { useBooks } from '../hooks/useBooks';
import type { Book } from '../types';

const Books: React.FC = () => {
  const { books, loading, error, createBook, editBook, removeBook } = useBooks();

  const handleCreateBook = async (bookData: Partial<Book>) => {
    return await createBook(bookData as Omit<Book, 'id'>);
  };

  const handleEditBook = async (id: string, bookData: Partial<Book>) => {
    return await editBook(id, bookData);
  };

  const handleDeleteBook = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      return await removeBook(id);
    }
    return false;
  };

  if (error) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <div className="flex items-center">
          <span className="text-xl mr-2">⚠️</span>
          <div>
            <h3 className="font-semibold">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Manajemen Buku</h1>
        <p className="text-gray-600">Kelola koleksi buku perpustakaan</p>
      </div>

      <BookTable
        books={books}
        onCreate={handleCreateBook}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
        loading={loading}
      />
    </div>
  );
};

export default Books;