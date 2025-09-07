import React from 'react';
import { FiBook, FiAward, FiTrendingUp } from 'react-icons/fi';
import { useBooks } from '../hooks/useBooks';
import { useLoans } from '../hooks/useLoans';

const PopularBooks: React.FC = () => {
  const { books } = useBooks();
  const { loansWithDetails } = useLoans();

  // Calculate book popularity based on loan count
  const bookPopularity = books.map(book => {
    const loanCount = loansWithDetails.filter(loan => loan.bookId === book.id).length;
    return {
      ...book,
      loanCount
    };
  });

  // Sort by loan count (descending) and take top 3
  const popularBooks = bookPopularity
    .filter(book => book.loanCount > 0)
    .sort((a, b) => b.loanCount - a.loanCount)
    .slice(0, 3);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiBook className="mr-2 h-5 w-5" />
          Buku Populer
        </h3>
      </div>
      <div className="card-body">
        {popularBooks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiBook className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">Belum ada data buku populer</p>
          </div>
        ) : (
          <div className="space-y-4">
            {popularBooks.map((book, index) => (
              <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {index === 0 ? <FiAward className="h-4 w-4" /> : 
                     index === 1 ? <FiTrendingUp className="h-4 w-4" /> : 
                     <FiBook className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{book.title}</p>
                    <p className="text-xs text-gray-500">{book.author}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-600">{book.loanCount}</p>
                  <p className="text-xs text-gray-500">peminjaman</p>
                </div>
              </div>
            ))}
            
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total buku:</span>
                <span className="font-semibold">{books.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600">Buku aktif:</span>
                <span className="font-semibold text-green-600">
                  {books.filter(book => book.isActive).length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularBooks;