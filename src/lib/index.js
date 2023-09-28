import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from 'firebase/auth';

import { auth } from '../Firebase/instalfirebase';

export const authStateChanged = (callback) => {
  onAuthStateChanged(auth, callback);
};

export const authLogin = (email, senha) => signInWithEmailAndPassword(auth, email, senha);

const authProvedor = new GoogleAuthProvider();
export const authLoginGoogle = () => signInWithPopup(auth, authProvedor);

export const newUser = async (email, senha, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
  await updateProfile(userCredential.user, { displayName });
};

export const logout = async () => {
  await signOut(auth);
};
