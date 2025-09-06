import React from 'react';
import MemberTable from '../components/MemberTable';
import { useMembers } from '../hooks/useMembers';

const Members: React.FC = () => {
  const { members, loading, error, createMember, editMember, removeMember } = useMembers();

  const handleCreateMember = async (memberData: Partial<Member>) => {
    return await createMember(memberData as Omit<Member, 'id'>);
  };

  const handleEditMember = async (id: string, memberData: Partial<Member>) => {
    return await editMember(id, memberData);
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      return await removeMember(id);
    }
    return false;
  };

  if (error) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <div className="flex items-center">
          <span className="text-xl mr-2">⚠️</span>
          <div>
            <h3 className="font-semibold">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Manajemen Anggota</h1>
        <p className="text-gray-600">Kelola data anggota perpustakaan</p>
      </div>

      <MemberTable
        members={members}
        onEdit={handleEditMember}
        onDelete={handleDeleteMember}
        loading={loading}
      />
    </div>
  );
};

export default Members;