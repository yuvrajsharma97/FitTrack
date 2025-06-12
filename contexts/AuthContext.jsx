'use client';

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/Firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        setUser(docSnap.exists() ? docSnap.data() : user);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        email,
        createdAt: serverTimestamp(),
      });
      toast.success("Signup successful!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out");
      router.push("/auth/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const updateUserProfile = async (data) => {
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { ...user, ...data, updatedAt: serverTimestamp() });
      setUser((prev) => ({ ...prev, ...data }));
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, authLoading, login, signup, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
