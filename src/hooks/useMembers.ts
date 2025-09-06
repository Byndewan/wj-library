import { useState, useEffect, useCallback } from 'react';
import { 
  getMembers, 
  addMember, 
  updateMember, 
  deleteMember,
  getMemberById
} from '../firebase/firestore';
import type { Member, MemberFormData, ApiResponse } from '../types';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const membersData = await getMembers();
      setMembers(membersData);
    } catch (err) {
      setError('Gagal memuat data anggota');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMember = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const member = await getMemberById(id);
      setSelectedMember(member);
      return member;
    } catch (err) {
      setError('Gagal mengambil data anggota');
      console.error('Error getting member:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMember = useCallback(async (memberData: MemberFormData): Promise<ApiResponse<string>> => {
    try {
      setLoading(true);
      setError(null);
      
      if (memberData.email) {
        const existingMember = members.find(member => member.email === memberData.email);
        if (existingMember) {
          return {
            success: false,
            error: 'Email sudah digunakan oleh anggota lain'
          };
        }
      }

      const memberId = await addMember(memberData);
      await fetchMembers();
      
      return {
        success: true,
        data: memberId,
        message: 'Anggota berhasil ditambahkan'
      };
    } catch (err) {
      const errorMsg = 'Gagal menambahkan anggota';
      setError(errorMsg);
      console.error('Error creating member:', err);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  }, [members, fetchMembers]);

  const editMember = useCallback(async (id: string, memberData: Partial<MemberFormData>): Promise<ApiResponse<void>> => {
    try {
      setLoading(true);
      setError(null);

      if (memberData.email) {
        const existingMember = members.find(member => 
          member.email === memberData.email && member.id !== id
        );
        if (existingMember) {
          return {
            success: false,
            error: 'Email sudah digunakan oleh anggota lain'
          };
        }
      }

      await updateMember(id, memberData);
      await fetchMembers();
      
      return {
        success: true,
        message: 'Anggota berhasil diperbarui'
      };
    } catch (err) {
      const errorMsg = 'Gagal memperbarui anggota';
      setError(errorMsg);
      console.error('Error updating member:', err);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  }, [members, fetchMembers]);

  const removeMember = useCallback(async (id: string): Promise<ApiResponse<void>> => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Check if member has active loans before deleting
      // For now, we'll just delete the member

      await deleteMember(id);
      await fetchMembers();
      
      return {
        success: true,
        message: 'Anggota berhasil dihapus'
      };
    } catch (err) {
      const errorMsg = 'Gagal menghapus anggota';
      setError(errorMsg);
      console.error('Error deleting member:', err);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  }, [fetchMembers]);

  const getActiveMembers = useCallback(() => {
    return members.filter(member => member.isActive);
  }, [members]);

  const searchMembers = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) {
      return members;
    }
    return members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    loading,
    error,
    selectedMember,
    getMember,
    createMember,
    editMember,
    removeMember,
    getActiveMembers,
    searchMembers,
    refreshMembers: fetchMembers
  };
};