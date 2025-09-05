import React from 'react';
import { useBooks } from '../hooks/useBooks';
import { useMembers } from '../hooks/useMembers';
import { useLoans } from '../hooks/useLoans';

const Dashboard: React.FC = () => {
  const { books, loading: booksLoading } = useBooks();
  const { members, loading: membersLoading } = useMembers();
  const { loans, loading: loansLoading } = useLoans();

  const activeBooks = books.filter(book => book.isActive);
  const activeMembers = members.filter(member => member.isActive);
  const activeLoans = loans.filter(loan => loan.status === 'BORROWED');
  const overdueLoans = activeLoans.filter(loan => new Date() > loan.dueDate);

  if (booksLoading || membersLoading || loansLoading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Total Books</h3>
              <p className="text-2xl font-bold">{books.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Total Members</h3>
              <p className="text-2xl font-bold">{members.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Active Loans</h3>
              <p className="text-2xl font-bold">{activeLoans.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Overdue Loans</h3>
              <p className="text-2xl font-bold">{overdueLoans.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {loans.slice(0, 5).map(loan => (
              <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Loan #{loan.id.substring(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    {loan.status === 'BORROWED' ? 'Borrowed' : 'Returned'} on{' '}
                    {loan.borrowDate.toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  loan.status === 'BORROWED' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {loan.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/books" className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition duration-200">
              Manage Books
            </a>
            <a href="/members" className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition duration-200">
              Manage Members
            </a>
            <a href="/loans" className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-lg text-center transition duration-200">
              Manage Loans
            </a>
            <a href="/reports" className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition duration-200">
              View Reports
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;