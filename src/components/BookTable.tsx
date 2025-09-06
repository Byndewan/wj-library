import React, { useState } from 'react';
import type { Book } from '../types';
import BookFormModal from './BookFormModal';

interface BookTableProps {
  books: Book[];
  onCreate: (book: Partial<Book>) => Promise<boolean>;
  onEdit: (id: string, book: Partial<Book>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  loading: boolean;
}

const BookTable: React.FC<BookTableProps> = ({ books, onEdit, onCreate,onDelete, loading }) => {
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
            <input
              type="text"
              placeholder="Cari buku..."
              className="form-input flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary whitespace-nowrap"
            >
              + Tambah Buku
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Judul</th>
                <th>Pengarang</th>
                <th>Genre</th>
                <th>Penerbit</th>
                <th>Tahun</th>
                <th>Stok</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-blue-50 cursor-pointer">
                  <td className="font-mono text-sm">{book.code}</td>
                  <td className="font-medium">{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {book.genre}
                    </span>
                  </td>
                  <td>{book.publisher || '-'}</td>
                  <td>{book.year || '-'}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      (book.stock || 0) > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.stock || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      book.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-600 hover:text-blue-800 transition duration-200"
                        title="Edit buku"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(book.id)}
                        className="text-red-600 hover:text-red-800 transition duration-200"
                        title="Hapus buku"
                      >
                        🗑️
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
            <div className="text-4xl mb-4">📚</div>
            <p className="text-lg font-medium">Tidak ada buku ditemukan</p>
            <p className="text-sm">
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