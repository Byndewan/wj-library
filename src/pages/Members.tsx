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
    return await removeMember(id);
  };

  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
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