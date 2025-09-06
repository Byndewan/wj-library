import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  type UserCredential,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';
import type { AppUser, UserRole } from '../types';

export const registerUser = async (
  email: string, 
  password: string, 
  userData: Omit<AppUser, 'id' | 'email'>,
  role: UserRole = 'SISWA'
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: userData.name
    });

    const userDoc: AppUser = {
      id: userCredential.user.uid,
      email: email,
      ...userData,
      role: role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);

    return userCredential;
  } catch (error) {
    console.error('Error registrasi user:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error login user:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logout user:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error reset password:', error);
    throw error;
  }
};

export const getUserData = async (userId: string): Promise<AppUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as AppUser;
    }
    return null;
  } catch (error) {
    console.error('Error mendapatkan data user:', error);
    throw error;
  }
};

export const updateUserData = async (userId: string, userData: Partial<AppUser>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...userData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error update data user:', error);
    throw error;
  }
};

export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};