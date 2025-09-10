import React, { useState } from 'react';
import type { Member } from '../types';
import MemberFormModal from './MemberFormModal';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiUsers } from 'react-icons/fi';

interface MemberTableProps {
  members: Member[];
  onCreate: (member: Partial<Member>) => Promise<boolean>;
  onEdit: (id: string, member: Partial<Member>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  loading: boolean;
}

const MemberTable: React.FC<MemberTableProps> = ({ members, onEdit, onCreate, onDelete, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleSubmit = async (memberData: Partial<Member>) => {
    if (editingMember) {
      const success = await onEdit(editingMember.id, memberData);
      if (success) {
        handleCloseModal();
      }
    } else {
      const success = await onCreate(memberData);
      if (success) {
        handleCloseModal();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manajemen Anggota</h2>
            <p className="text-sm text-gray-600">Kelola data anggota WJLRC</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari anggota..."
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
              Tambah Anggota
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-sans force-sm">
            <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Kelas</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Telepon</th>
                <th className="px-4 py-3 text-left">Alamat</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-red-50 cursor-pointer">
                  <td className="font-medium text-gray-900 px-4 py-3">{member.name}</td>
                  <td className="px-1 py-3">
                    <span className="p-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {member.className}
                    </span>
                  </td>
                  <td className="text-gray-700 px-4 py-3">{member.email || '-'}</td>
                  <td className="text-gray-700 px-4 py-3">{member.phone || '-'}</td>
                  <td className="max-w-xs truncate text-gray-700 px-4 py-3">{member.address || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      member.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-red-600 hover:text-red-800 transition duration-200 p-1.5 rounded-md hover:bg-red-50"
                        title="Edit anggota"
                      >
                        <FiEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(member.id)}
                        className="text-red-600 hover:text-red-800 transition duration-200 p-1.5 rounded-md hover:bg-red-50"
                        title="Hapus anggota"
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

        {filteredMembers.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <FiUsers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Tidak ada anggota ditemukan</p>
            <p className="text-sm mt-1">
              {searchTerm ? 'Coba gunakan kata kunci lain' : 'Mulai dengan menambahkan anggota pertama'}
            </p>
          </div>
        )}
      </div>

      <MemberFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingMember || undefined}
        title={editingMember ? 'Edit Anggota' : 'Tambah Anggota Baru'}
      />
    </div>
  );
};

export default MemberTable;