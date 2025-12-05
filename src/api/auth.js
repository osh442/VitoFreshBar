import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, db } from '../firebase';

const USERS_REF = collection(db, 'users');

const ERROR_MESSAGES = {
  'auth/user-not-found': 'Невалиден имейл или парола.',
  'auth/wrong-password': 'Невалиден имейл или парола.',
  'auth/invalid-login-credentials': 'Невалиден имейл или парола.',
  'auth/invalid-credential': 'Невалиден имейл или парола.',
  'auth/email-already-in-use': 'Потребител с този имейл вече съществува.',
  'auth/invalid-email': 'Моля, въведи валиден имейл.',
  'auth/missing-email': 'Имейлът е задължителен.',
  'auth/missing-password': 'Моля, въведи парола.',
  'auth/weak-password': 'Паролата трябва да е поне 6 символа.',
  'auth/too-many-requests': 'Твърде много опити. Опитай отново по-късно.',
};

const mapFirebaseError = (error, fallbackMessage) => {
  const code = error?.code;
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  return error?.message || fallbackMessage || 'Възникна неочаквана грешка. Опитай отново.';
};

const applyAdminRole = (user) => {
  if (!user) {
    return user;
  }

  return user.isAdmin
    ? {
        ...user,
        role: 'admin',
      }
    : user;
};

const mapUserSnap = (snap) => {
  if (!snap?.exists()) {
    return null;
  }

  const data = snap.data();
  const mapped = {
    id: snap.id,
    name: data.name || data.email?.split('@')[0] || 'VitoFreshBar Guest',
    email: data.email,
    phone: data.phone || '',
    role: data.role || (data.isAdmin ? 'admin' : 'user'),
    password: data.password || '',
    isAdmin: data.isAdmin === true,
  };

  return applyAdminRole(mapped);
};

const readUserProfile = async (uid) => {
  if (!uid) {
    return null;
  }

  const snap = await getDoc(doc(USERS_REF, uid));
  return mapUserSnap(snap);
};

const findProfileByEmail = async (email) => {
  const q = query(USERS_REF, where('email', '==', email), limit(1));
  const result = await getDocs(q);
  return mapUserSnap(result.docs[0]);
};

const ensureUserProfile = async (firebaseUser) => {
  if (!firebaseUser) {
    return null;
  }

  let profile = await readUserProfile(firebaseUser.uid);
  if (profile) {
    return profile;
  }

  await setDoc(doc(USERS_REF, firebaseUser.uid), {
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'VitoFreshBar Guest',
    email: firebaseUser.email,
    phone: firebaseUser.phoneNumber || '',
    role: 'user',
    isAdmin: false,
    createdAt: serverTimestamp(),
  });

  profile = await readUserProfile(firebaseUser.uid);
  return profile;
};

const publicUser = ({ id, name, email, phone = '', role = 'user', isAdmin = false }) =>
  applyAdminRole({
    id,
    name,
    email,
    phone,
    role,
    isAdmin,
  });

const buildToken = async (firebaseUser) => {
  if (!firebaseUser) {
    return null;
  }

  if (firebaseUser.getIdToken) {
    return firebaseUser.getIdToken();
  }

  return firebaseUser.accessToken || null;
};

export const login = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await ensureUserProfile(credential.user);

    if (!profile) {
      throw new Error('Липсват данни за потребителя.');
    }

    return {
      user: publicUser(profile),
      token: await buildToken(credential.user),
    };
  } catch (error) {
    if (
      error?.code === 'auth/user-not-found' ||
      error?.code === 'auth/invalid-login-credentials' ||
      error?.code === 'auth/invalid-credential'
    ) {
      const existingProfile = await findProfileByEmail(email);
      if (existingProfile?.password) {
        if (existingProfile.password !== password) {
          throw new Error('Невалиден имейл или парола.');
        }

        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          const profile = await ensureUserProfile(credential.user);
          return {
            user: publicUser(profile),
            token: await buildToken(credential.user),
          };
        } catch (creationError) {
          if (creationError?.code === 'auth/email-already-in-use') {
            throw new Error('Невалиден имейл или парола.');
          }
          throw creationError;
        }
      }
    }

    throw new Error(mapFirebaseError(error, 'Неуспешен опит за вход.'));
  }
};

export const register = async (name, email, password, phone = '') => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = credential.user.uid;

    await setDoc(doc(USERS_REF, userId), {
      name: name?.trim() || email.split('@')[0] || 'VitoFreshBar Guest',
      email,
      phone: phone?.trim() || '',
      password,
      role: 'user',
      isAdmin: false,
      createdAt: serverTimestamp(),
    });

    const profile = await readUserProfile(userId);

    return {
      user: publicUser(profile),
      token: await buildToken(credential.user),
    };
  } catch (error) {
    throw new Error(mapFirebaseError(error, 'Неуспешна регистрация.'));
  }
};

export const logout = () => firebaseSignOut(auth);

export const fetchUserProfile = (uid) => readUserProfile(uid);
