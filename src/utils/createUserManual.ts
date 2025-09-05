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
    // Buat user di Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile dengan nama
    await updateProfile(userCredential.user, {
      displayName: name
    });

    // Simpan data user tambahan di Firestore
    const userDoc: AppUser = {
      id: userCredential.user.uid,
      name: name,
      email: email,
      role: role,
      className: className,
      isActive: true
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);

    console.log(`User created successfully: ${email}`);
    return true;
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      alert('Email sudah terdaftar. Silakan gunakan email lain.');
    } else if (error.code === 'auth/weak-password') {
      alert('Password terlalu lemah. Minimal 6 karakter.');
    } else {
      alert('Terjadi kesalahan saat membuat akun: ' + error.message);
    }
    
    return false;
  }
};