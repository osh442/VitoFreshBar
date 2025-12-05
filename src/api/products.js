// FIREBASE PRODUCT SERVICE
// =========================

import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase.js";



// Колекцията в Firestore
const PRODUCTS_REF = collection(db, "products");

// Normalize product when reading from Firestore
const normalize = (data, id) => {
  const timestamp = data.createdAt;
  return {
    id,
    title: data.title || "",
    shortText: data.shortText || "",
    description: data.description || "",
    price: data.price || 0,
    calories: data.calories || 0,
    weight: data.weight || "",
    image: data.image || "",
    authorId: data.authorId || "",
    likes: Array.isArray(data.likes) ? data.likes : [],
    category: data.category || "salads",
    isActive: data.isActive !== false,
    createdAt:
      typeof timestamp === "number"
        ? timestamp
        : timestamp?.toMillis?.() ?? null,
  };
};

// ============= GET ALL PRODUCTS =============
export const getAll = async () => {
  const snapshot = await getDocs(PRODUCTS_REF);
  return snapshot.docs.map((d) => normalize(d.data(), d.id));
};

// ============= GET ONE PRODUCT =============
export const getOne = async (id) => {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return normalize(snap.data(), snap.id);
};

// ============= CREATE PRODUCT =============
export const create = async (payload) => {
  const docRef = await addDoc(PRODUCTS_REF, {
    ...payload,
    likes: [],
    isActive: payload.isActive !== false,
    createdAt: serverTimestamp(),
  });

  const snap = await getDoc(docRef);
  return normalize(snap.data(), docRef.id);
};

// ============= UPDATE PRODUCT =============
export const update = async (id, payload) => {
  const ref = doc(db, "products", id);
  await updateDoc(ref, payload);

  const snap = await getDoc(ref);
  return normalize(snap.data(), id);
};

// ============= DELETE PRODUCT =============
export const remove = async (id) => {
  const ref = doc(db, "products", id);
  await deleteDoc(ref);
};

// ============= LIKE / UNLIKE =============
export const toggleLike = async (id, userId) => {
  if (!userId) throw new Error("Моля, влезте в профила си.");

  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();
  const likes = new Set(data.likes || []);

  likes.has(userId) ? likes.delete(userId) : likes.add(userId);

  await updateDoc(ref, { likes: Array.from(likes) });

  const updated = await getDoc(ref);
  return normalize(updated.data(), id);
};
