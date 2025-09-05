import React, { useState } from 'react';
import type { Book } from '../types';
import BookFormModal from './BookFormModal';

interface BookTableProps {
  books: Book[];
  onEdit: (id: string, book: Partial<Book>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  loading: boolean;
}

const BookTable: React.FC<BookTableProps> = ({ books, onEdit, onDelete, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleSubmit = async (bookData: Partial<Book>) => {
    if (editingBook) {
      const success = await onEdit(editingBook.id, bookData);
      if (success) {
        handleCloseModal();
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading books...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Book Management</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search books..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
          >
            Add Book
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6">Code</th>
              <th className="py-3 px-6">Title</th>
              <th className="py-3 px-6">Author</th>
              <th className="py-3 px-6">Genre</th>
              <th className="py-3 px-6">Publisher</th>
              <th className="py-3 px-6">Year</th>
              <th className="py-3 px-6">Stock</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {filteredBooks.map((book, index) => (
              <tr 
                key={book.id} 
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
              >
                <td className="py-3 px-6">{book.code}</td>
                <td className="py-3 px-6">{book.title}</td>
                <td className="py-3 px-6">{book.author}</td>
                <td className="py-3 px-6">{book.genre}</td>
                <td className="py-3 px-6">{book.publisher || '-'}</td>
                <td className="py-3 px-6">{book.year || '-'}</td>
                <td className="py-3 px-6">{book.stock || 0}</td>
                <td className="py-3 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs ${book.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {book.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-6 flex space-x-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(book.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBooks.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No books found. {searchTerm && 'Try a different search term.'}
        </div>
      )}

      <BookFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingBook || undefined}
        title={editingBook ? 'Edit Book' : 'Add New Book'}
      />
    </div>
  );
};

export default BookTable;