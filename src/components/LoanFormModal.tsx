import React, { useState, useEffect } from 'react';
import type { Book, Member, Loan } from '../types';
import { FiX } from 'react-icons/fi';

interface LoanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (loan: Partial<Loan>) => Promise<void>;
  books: Book[];
  members: Member[];
}

const LoanFormModal: React.FC<LoanFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  books,
  members
}) => {
  const [formData, setFormData] = useState<Partial<Loan>>({
    bookId: '',
    memberId: '',
    borrowDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'BORROWED',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        bookId: '',
        memberId: '',
        borrowDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'BORROWED',
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const availableBooks = books.filter(book => book.isActive && (book.stock || 0) > 0);
  const activeMembers = members.filter(member => member.isActive);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bookId) {
      newErrors.bookId = 'Pilih buku yang akan dipinjam';
    }

    if (!formData.memberId) {
      newErrors.memberId = 'Pilih anggota yang meminjam';
    }

    if (!formData.borrowDate) {
      newErrors.borrowDate = 'Tanggal pinjam harus diisi';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Tanggal jatuh tempo harus diisi';
    }

    if (formData.borrowDate && formData.dueDate && formData.dueDate <= formData.borrowDate) {
      newErrors.dueDate = 'Tanggal jatuh tempo harus setelah tanggal pinjam';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Terjadi kesalahan saat membuat peminjaman' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: new Date(value)
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const selectedBook = availableBooks.find(book => book.id === formData.bookId);
  const selectedMember = activeMembers.find(member => member.id === formData.memberId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Peminjaman Baru</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
              disabled={loading}
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">
                Anggota *
              </label>
              <select
                name="memberId"
                value={formData.memberId || ''}
                onChange={handleChange}
                className={`form-input ${errors.memberId ? 'border-red-500' : ''}`}
              >
                <option value="">Pilih Anggota</option>
                {activeMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.className}
                  </option>
                ))}
              </select>
              {errors.memberId && <p className="text-red-500 text-sm mt-1">{errors.memberId}</p>}
              {selectedMember && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                  <p><strong>Kelas:</strong> {selectedMember.className}</p>
                  {selectedMember.phone && <p><strong>Telepon:</strong> {selectedMember.phone}</p>}
                </div>
              )}
            </div>

            <div>
              <label className="form-label">
                Buku *
              </label>
              <select
                name="bookId"
                value={formData.bookId || ''}
                onChange={handleChange}
                className={`form-input ${errors.bookId ? 'border-red-500' : ''}`}
              >
                <option value="">Pilih Buku</option>
                {availableBooks.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.title} - {book.author} ({book.stock} tersedia)
                  </option>
                ))}
              </select>
              {errors.bookId && <p className="text-red-500 text-sm mt-1">{errors.bookId}</p>}
              {selectedBook && (
                <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                  <p><strong>Pengarang:</strong> {selectedBook.author}</p>
                  <p><strong>Genre:</strong> {selectedBook.genre}</p>
                  <p><strong>Stok:</strong> {selectedBook.stock} buku</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Tanggal Pinjam *
                </label>
                <input
                  type="date"
                  value={formData.borrowDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleDateChange('borrowDate', e.target.value)}
                  className={`form-input ${errors.borrowDate ? 'border-red-500' : ''}`}
                />
                {errors.borrowDate && <p className="text-red-500 text-sm mt-1">{errors.borrowDate}</p>}
              </div>

              <div>
                <label className="form-label">
                  Tanggal Jatuh Tempo *
                </label>
                <input
                  type="date"
                  value={formData.dueDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleDateChange('dueDate', e.target.value)}
                  className={`form-input ${errors.dueDate ? 'border-red-500' : ''}`}
                />
                {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
              </div>
            </div>

            <div>
              <label className="form-label">
                Catatan (Opsional)
              </label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={3}
                className="form-input"
                placeholder="Tambahkan catatan jika diperlukan..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Membuat...</span>
                  </div>
                ) : (
                  'Buat Peminjaman'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoanFormModal;