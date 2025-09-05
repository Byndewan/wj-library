import React from 'react';
import BookTable from '../components/BookTable';
import { useBooks } from '../hooks/useBooks';

const Books: React.FC = () => {
  const { books, loading, error, createBook, editBook, removeBook } = useBooks();

  const handleCreateBook = async (bookData: Partial<Book>) => {
    return await createBook(bookData as Omit<Book, 'id'>);
  };

  const handleEditBook = async (id: string, bookData: Partial<Book>) => {
    return await editBook(id, bookData);
  };

  const handleDeleteBook = async (id: string) => {
    return await removeBook(id);
  };

  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <BookTable
        books={books}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
        loading={loading}
      />
    </div>
  );
};

export default Books;