import { db, auth } from './firebase'

import {
  setPersistence,
  sendEmailVerification,
  sendPasswordResetEmail,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'

import {
  doc,
  getDoc
} from 'firebase/firestore'

const domain = import.meta.env.VITE_APP_URL

export const register = async (email: string, password: string) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await sendEmailVerification(cred.user, {
      url: `${domain}/login`,
      handleCodeInApp: false,
    })
    return {
      ok: true,
      user: cred.user,
    }
  } catch (error: any) {
    return {
      ok: false,
      code: error.code,
      message: error.message,
    }
  }
}

export const login = async (email: string, password: string) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password)

    if (!cred.user.emailVerified) {
      await sendEmailVerification(cred.user, {
        url: `${domain}/login`,
        handleCodeInApp: false,
      })
      
      return {
        ok: false,
        code: 'email-not-verified',
        user: cred.user,
        message: 'メール認証が完了していません。',
      }
    }

    return {
      ok: true,
      user: cred.user,
    }
  } catch (error: any) {
    return {
      ok: false,
      code: error.code,
      message: error.message,
    }
  }
  
  // await setPersistence(auth, browserLocalPersistence)
  // const cred = await signInWithEmailAndPassword(auth, email, password)
  // return cred.user
}

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: `${domain}/login`,
      handleCodeInApp: false,
    })
    return {
      ok: true,
    }
  } catch (error: any) {
    return {
      ok: false,
      code: error.code,
      message: error.message,
    }
  }
}

export const UserData = async(userID: string) => {
  const ref = doc(db, 'users', userID)
  const snap = await getDoc(ref)
  return snap.data()
}