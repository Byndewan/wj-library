import { useState, useEffect } from 'react';
import { 
  getMembers, 
  addMember, 
  updateMember, 
  deleteMember 
} from '../firebase/firestore';
import type { Member } from '../types';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const snapshot = await getMembers();
      
      if (!snapshot || !snapshot.docs) {
        setMembers([]);
        return;
      }
      
      const membersData: Member[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Member));
      setMembers(membersData);
    } catch (err) {
      setError('Failed to fetch members');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const createMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      await addMember(memberData);
      await fetchMembers();
      return true;
    } catch (err) {
      setError('Failed to create member');
      console.error(err);
      return false;
    }
  };

  const editMember = async (id: string, memberData: Partial<Member>) => {
    try {
      await updateMember(id, memberData);
      await fetchMembers();
      return true;
    } catch (err) {
      setError('Failed to update member');
      console.error(err);
      return false;
    }
  };

  const removeMember = async (id: string) => {
    try {
      await deleteMember(id);
      await fetchMembers();
      return true;
    } catch (err) {
      setError('Failed to delete member');
      console.error(err);
      return false;
    }
  };

  return {
    members,
    loading,
    error,
    createMember,
    editMember,
    removeMember,
    refreshMembers: fetchMembers
  };
};