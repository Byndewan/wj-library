// components/BookTable.tsx
import React, { useState } from 'react';
import type { Book } from '../types';
import BookFormModal from './BookFormModal';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiBook } from 'react-icons/fi';

interface BookTableProps {
  books: Book[];
  onCreate: (book: Partial<Book>) => Promise<boolean>;
  onEdit: (id: string, book: Partial<Book>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  loading: boolean;
}

const BookTable: React.FC<BookTableProps> = ({ books, onEdit, onCreate, onDelete, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.code.toLowerCase().includes(searchTerm.toLowerCase())
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
      if (success) handleCloseModal();
    } else {
      const success = await onCreate(bookData);
      if (success) handleCloseModal();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manajemen Buku</h2>
            <p className="text-sm text-gray-600">Kelola koleksi buku perpustakaan</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari buku..."
                className="form-input pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary whitespace-nowrap"
            >
              <FiPlus className="h-4 w-4" />
              Tambah Buku
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-sans">
            <thead className="bg-gray-100 text-sm font-semibold text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Kode</th>
                <th className="px-4 py-3 text-left">Judul</th>
                <th className="px-4 py-3 text-left">Pengarang</th>
                <th className="px-4 py-3 text-left">Genre</th>
                <th className="px-4 py-3 text-left">Penerbit</th>
                <th className="px-4 py-3 text-left">Tahun</th>
                <th className="px-4 py-3 text-left">Stok</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-blue-50 cursor-pointer">
                  <td className="font-mono text-sm text-gray-600 px-4 py-3">{book.code}</td>
                  <td className="font-medium text-gray-900 px-4 py-3">{book.title}</td>
                  <td className="text-gray-700 px-4 py-3">{book.author}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {book.genre}
                    </span>
                  </td>
                  <td className="text-gray-700 px-4 py-3">{book.publisher || '-'}</td>
                  <td className="text-gray-700 px-4 py-3">{book.year || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      (book.stock || 0) > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.stock || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      book.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-600 hover:text-blue-800 transition duration-200 p-1.5 rounded-md hover:bg-blue-50"
                        title="Edit buku"
                      >
                        <FiEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(book.id)}
                        className="text-red-600 hover:text-red-800 transition duration-200 p-1.5 rounded-md hover:bg-red-50"
                        title="Hapus buku"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBooks.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <FiBook className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Tidak ada buku ditemukan</p>
            <p className="text-sm mt-1">
              {searchTerm ? 'Coba gunakan kata kunci lain' : 'Mulai dengan menambahkan buku pertama'}
            </p>
          </div>
        )}
      </div>

      <BookFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingBook || undefined}
        title={editingBook ? 'Edit Buku' : 'Tambah Buku Baru'}
      />
    </div>
  );
};

export default BookTable;