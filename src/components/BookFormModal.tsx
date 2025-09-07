import React, { useState, useEffect } from 'react';
import type { Book } from '../types';
import { FiX } from 'react-icons/fi';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: Partial<Book>) => Promise<void>;
  initialData?: Book;
  title: string;
}

const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title
}) => {
  const [formData, setFormData] = useState<Partial<Book>>({
    code: '',
    title: '',
    author: '',
    genre: '',
    publisher: '',
    year: undefined,
    stock: 0,
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        code: '',
        title: '',
        author: '',
        genre: '',
        publisher: '',
        year: undefined,
        stock: 0,
        isActive: true
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code?.trim()) {
      newErrors.code = 'Kode buku harus diisi';
    }

    if (!formData.title?.trim()) {
      newErrors.title = 'Judul buku harus diisi';
    }

    if (!formData.author?.trim()) {
      newErrors.author = 'Pengarang harus diisi';
    }

    if (!formData.genre?.trim()) {
      newErrors.genre = 'Genre harus diisi';
    }

    if (formData.stock !== undefined && formData.stock < 0) {
      newErrors.stock = 'Stok tidak boleh negatif';
    }

    if (formData.year && (formData.year < 1000 || formData.year > new Date().getFullYear())) {
      newErrors.year = 'Tahun tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Terjadi kesalahan saat menyimpan data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : parseInt(value)) : value
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
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
                Kode Buku *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code || ''}
                onChange={handleChange}
                className={`form-input ${errors.code ? 'border-red-500' : ''}`}
                placeholder="Masukkan kode buku"
                disabled={!!initialData?.code}
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="form-label">
                Judul Buku *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className={`form-input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Masukkan judul buku"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="form-label">
                Pengarang *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author || ''}
                onChange={handleChange}
                className={`form-input ${errors.author ? 'border-red-500' : ''}`}
                placeholder="Masukkan nama pengarang"
              />
              {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
            </div>

            <div>
              <label className="form-label">
                Genre *
              </label>
              <input
                type="text"
                name="genre"
                value={formData.genre || ''}
                onChange={handleChange}
                className={`form-input ${errors.genre ? 'border-red-500' : ''}`}
                placeholder="Masukkan genre buku"
              />
              {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Tahun Terbit
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year || ''}
                  onChange={handleChange}
                  className={`form-input ${errors.year ? 'border-red-500' : ''}`}
                  placeholder="Tahun"
                  min="1000"
                  max={new Date().getFullYear()}
                />
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="form-label">
                  Stok
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock || 0}
                  onChange={handleChange}
                  className={`form-input ${errors.stock ? 'border-red-500' : ''}`}
                  placeholder="Jumlah stok"
                  min="0"
                />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
              </div>
            </div>

            <div>
              <label className="form-label">
                Penerbit
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher || ''}
                onChange={handleChange}
                className="form-input"
                placeholder="Masukkan nama penerbit"
              />
            </div>

            <div>
              <label className="form-label">
                Status
              </label>
              <select
                name="isActive"
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isActive: e.target.value === 'true'
                }))}
                className="form-input"
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
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
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  initialData ? 'Perbarui' : 'Simpan'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookFormModal;