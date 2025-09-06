import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import type { AppUser, UserRole } from '../types';

export const createUserManual = async (
  email: string, 
  password: string, 
  name: string,
  role: UserRole = 'SISWA',
  className: string = ''
): Promise<boolean> => {
  try {
    if (!email || !password || !name) {
      throw new Error('Email, password, dan nama harus diisi');
    }

    if (password.length < 6) {
      throw new Error('Password minimal 6 karakter');
    }

    if (role === 'SISWA' && !className) {
      throw new Error('Kelas harus diisi untuk siswa');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, {
      displayName: name
    });

    const userDoc: AppUser = {
      id: userCredential.user.uid,
      name: name,
      email: email,
      role: role,
      className: className,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);

    console.log(`User created successfully: ${email}`);
    return true;
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    let errorMessage = 'Terjadi kesalahan saat membuat akun';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password terlalu lemah. Minimal 6 karakter.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Format email tidak valid.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Operasi tidak diizinkan. Hubungi administrator.';
        break;
      default:
        errorMessage = error.message || 'Terjadi kesalahan tidak diketahui';
    }
    
    throw new Error(errorMessage);
  }
};

export const generateUsernameFromEmail = (email: string): string => {
  return email.split('@')[0];
};

export const validatePasswordStrength = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password minimal 6 karakter' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Password harus mengandung huruf kecil' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password harus mengandung huruf besar' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password harus mengandung angka' };
  }
  
  return { valid: true, message: 'Password kuat' };
};

export const formatName = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return 'Administrator';
    case 'PETUGAS':
      return 'Petugas Perpustakaan';
    case 'SISWA':
      return 'Siswa';
    default:
      return 'Pengguna';
  }
};