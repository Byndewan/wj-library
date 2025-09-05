import React, { useState, useEffect } from 'react';
import type { Book, Member, Loan } from '../types';

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
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
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
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: new Date(value)
    }));
  };

  const availableBooks = books.filter(book => book.isActive && (book.stock || 0) > 0);
  const activeMembers = members.filter(member => member.isActive);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">New Loan</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member *
              </label>
              <select
                name="memberId"
                value={formData.memberId || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Member</option>
                {activeMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.className}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Book *
              </label>
              <select
                name="bookId"
                value={formData.bookId || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Book</option>
                {availableBooks.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.title} by {book.author} ({book.stock} available)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Borrow Date *
                </label>
                <input
                  type="date"
                  value={formData.borrowDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleDateChange('borrowDate', e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.dueDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleDateChange('dueDate', e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Loan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoanFormModal;