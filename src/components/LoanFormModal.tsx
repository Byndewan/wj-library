import React, { useState, useEffect } from 'react';
import type { Book, Member, Loan } from '../types';
import { FiX, FiUser, FiUserPlus, FiBook, FiPlus, FiTrash2 } from 'react-icons/fi';

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
    bookIds: [],
    memberId: '',
    nonMemberName: '',
    nonMemberPhone: '',
    nonMemberClass: '',
    // address: '',
    borrowDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'BORROWED',
    notes: '',
    isMemberLoan: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedBookId, setSelectedBookId] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        bookIds: [],
        memberId: '',
        nonMemberName: '',
        nonMemberPhone: '',
        nonMemberClass: '',
        // address: '',
        borrowDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'BORROWED',
        notes: '',
        isMemberLoan: false
      });
      setErrors({});
    }
  }, [isOpen]);

  const availableBooks = books.filter(book => book.isActive && (book.stock || 0) > 0);
  const activeMembers = members.filter(member => member.isActive);

  const addBookToList = () => {
    if (selectedBookId && !formData.bookIds?.includes(selectedBookId)) {
      setFormData(prev => ({
        ...prev,
        bookIds: [...(prev.bookIds || []), selectedBookId]
      }));
      setSelectedBookId('');
    }
  };

  const removeBookFromList = (bookIdToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      bookIds: prev.bookIds?.filter(id => id !== bookIdToRemove) || []
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bookIds || formData.bookIds.length === 0) {
      newErrors.bookIds = 'Pilih minimal 1 buku';
    }

    if (formData.isMemberLoan) {
      if (!formData.memberId) {
        newErrors.memberId = 'Pilih anggota yang meminjam';
      }
    } else {
      if (!formData.nonMemberName?.trim()) {
        newErrors.nonMemberName = 'Nama peminjam harus diisi';
      }
      if (!formData.nonMemberPhone?.trim()) {
        newErrors.nonMemberPhone = 'Nomor telepon harus diisi';
      }
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
      const submitData = { ...formData };

      if (formData.isMemberLoan) {
        delete submitData.nonMemberName;
        delete submitData.nonMemberPhone;
        delete submitData.nonMemberClass;
      } else {
        delete submitData.memberId;
      }

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Terjadi kesalahan saat membuat peminjaman' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="isMemberLoan"
                  checked={formData.isMemberLoan === false}
                  onChange={() => setFormData(prev => ({ ...prev, isMemberLoan: false }))}
                  className="sr-only"
                />
                <div className={`px-4 py-2 rounded-lg border-2 ${!formData.isMemberLoan
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}>
                  <FiUserPlus className="inline mr-2" />
                  Non-Anggota
                </div>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="isMemberLoan"
                  checked={formData.isMemberLoan === true}
                  onChange={() => setFormData(prev => ({ ...prev, isMemberLoan: true }))}
                  className="sr-only"
                />
                <div className={`px-4 py-2 rounded-lg border-2 ${formData.isMemberLoan
                  ? 'bg-red-100 border-red-500 text-red-700'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}>
                  <FiUser className="inline mr-2" />
                  Anggota
                </div>
              </label>
            </div>

            {formData.isMemberLoan && (
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
                  <div className="mt-2 p-2 bg-red-50 rounded text-sm">
                    <p><strong>Kelas:</strong> {selectedMember.className}</p>
                    {selectedMember.phone && <p><strong>Telepon:</strong> {selectedMember.phone}</p>}
                  </div>
                )}
              </div>
            )}

            {!formData.isMemberLoan && (
              <div className="space-y-3">
                <div>
                  <label className="form-label">
                    Nama Peminjam *
                  </label>
                  <input
                    type="text"
                    name="nonMemberName"
                    value={formData.nonMemberName || ''}
                    onChange={handleChange}
                    className={`form-input ${errors.nonMemberName ? 'border-red-500' : ''}`}
                    placeholder="Nama lengkap peminjam"
                  />
                  {errors.nonMemberName && <p className="text-red-500 text-sm mt-1">{errors.nonMemberName}</p>}
                </div>

                <div>
                  <label className="form-label">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    name="nonMemberPhone"
                    value={formData.nonMemberPhone || ''}
                    onChange={handleChange}
                    className={`form-input ${errors.nonMemberPhone ? 'border-red-500' : ''}`}
                    placeholder="08xxxxxxxxxx"
                  />
                  {errors.nonMemberPhone && <p className="text-red-500 text-sm mt-1">{errors.nonMemberPhone}</p>}
                </div>

                <div>
                  <label className="form-label">
                    Kelas
                  </label>
                  <input
                    type="text"
                    name="nonMemberClass"
                    value={formData.nonMemberClass || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="X RPL 1"
                  />
                </div>
                {/* <div>
                  <label className="form-label">
                    Alamat (Opsional)
                  </label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    rows={3}
                    className="form-input"
                    placeholder="Tambahkan catatan jika diperlukan..."
                  />
                </div> */}
              </div>
            )}

            <div>
              <p className='mb-1 form-label'>Pilih Judul Buku :</p>
              <div className="flex gap-2 mb-3">
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="flex-1 form-input"
                >
                  <option value="">Pilih Disini</option>
                  {availableBooks.map(book => (
                    <option key={book.id} value={book.id} disabled={formData.bookIds?.includes(book.id)}>
                      {book.title} - {book.author} ({book.stock} tersedia)
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addBookToList}
                  disabled={!selectedBookId}
                  className="btn-primary whitespace-nowrap px-4"
                >
                  <FiPlus className="h-4 w-4" />
                  Tambah
                </button>
              </div>
            </div>

            {errors.bookIds && <p className="text-red-500 text-sm mt-1">{errors.bookIds}</p>}

            {formData.bookIds && formData.bookIds.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Buku yang dipilih:</h4>
                <div className="space-y-2">
                  {formData.bookIds.map(bookId => {
                    const book = availableBooks.find(b => b.id === bookId);
                    return (
                      <div key={bookId} className="flex items-center justify-between bg-white p-2 rounded border">
                        <div>
                          <p className="font-medium">{book?.title}</p>
                          <p className="text-sm text-gray-600">{book?.author}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBookFromList(bookId)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Total: {formData.bookIds.length} buku
                </p>
              </div>
            )}

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
      </div >
    </div >
  );
};

export default LoanFormModal;