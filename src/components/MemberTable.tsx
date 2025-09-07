import React, { useState } from 'react';
import type { Member } from '../types';
import MemberFormModal from './MemberFormModal';

  interface MemberTableProps {
    members: Member[];
    onCreate: (member: Partial<Member>) => Promise<boolean>;
    onEdit: (id: string, member: Partial<Member>) => Promise<boolean>;
    onDelete: (id: string) => Promise<boolean>;
    loading: boolean;
  }

const MemberTable: React.FC<MemberTableProps> = ({ members, onEdit, onCreate,onDelete, loading }) => {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manajemen Anggota</h2>
            <p className="text-sm text-gray-600">Kelola data anggota perpustakaan</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Cari anggota..."
              className="form-input flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary whitespace-nowrap"
            >
              + Tambah Anggota
            </button>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kelas</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Alamat</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-blue-50 cursor-pointer">
                  <td className="font-medium">{member.name}</td>
                  <td>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {member.className}
                    </span>
                  </td>
                  <td>{member.email || '-'}</td>
                  <td>{member.phone || '-'}</td>
                  <td className="max-w-xs truncate">{member.address || '-'}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      member.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-600 hover:text-blue-800 transition duration-200"
                        title="Edit anggota"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(member.id)}
                        className="text-red-600 hover:text-red-800 transition duration-200"
                        title="Hapus anggota"
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

        {filteredMembers.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-lg font-medium">Tidak ada anggota ditemukan</p>
            <p className="text-sm">
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