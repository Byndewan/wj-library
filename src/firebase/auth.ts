import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  type UserCredential,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import type { AppUser, UserRole } from '../types';

// Function to set custom claims (roles)
export const setCustomUserClaims = async (userId: string, role: UserRole): Promise<void> => {
  // Note: This requires a Firebase Cloud Function to set custom claims
  // This is just a placeholder - in real implementation, you'd call a cloud function
  // console.log(`Setting role ${role} for user ${userId}`);
  
  // Store user role in Firestore as well
  await setDoc(doc(db, 'users', userId), {
    role: role,
    updatedAt: new Date()
  }, { merge: true });
};

// Register user with role
export const registerUser = async (
  email: string, 
  password: string, 
  userData: Omit<AppUser, 'id'>,
  role: UserRole = 'SISWA'
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, {
      displayName: userData.name
    });

    await setCustomUserClaims(userCredential.user.uid, role);

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      ...userData,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return userCredential;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getUserRole = async (userId: string): Promise<UserRole> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().role as UserRole;
    }
    return 'SISWA';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'SISWA';
  }
};

export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};