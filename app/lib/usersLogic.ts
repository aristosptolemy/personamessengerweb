import { db } from './firebase'


import {
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  runTransaction,
  where,
  collection,
  query,
  limit,
  type Timestamp,
} from 'firebase/firestore'


export const userDataGet = async(userID: string) => {
  const userRef = doc(db, 'users', userID)
  try {
    const snap = await getDoc(userRef)
    if (!snap.exists()) {
      return null
    }
    return {
      id: snap.id,
      ...snap.data()
    }
  } catch {
    return null
  }
}

type Result = {
  ok: boolean
  text: string
}

export const userDataSet = async (
  userID: string,
  userData: any
): Promise<Result> => {
  try {
    const rawSearchID = userData.searchID ?? ''

    const searchID = rawSearchID
      .toLowerCase()
      .replace(/^@/, '')
      .replace(/[^a-z0-9_]/g, '')

    if (!searchID) {
      return {
        ok: false,
        text: '検索IDを入力してください'
      }
    }

    const userRef = doc(db, 'users', userID)
    const newSearchIDRef = doc(db, 'searchIDs', searchID)

    await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userRef)
      const newSearchIDSnap = await transaction.get(newSearchIDRef)

      const oldSearchID = userSnap.exists()
        ? userSnap.data().searchID
        : null

      if (newSearchIDSnap.exists()) {
        const searchIDData = newSearchIDSnap.data()

        if (searchIDData.uid !== userID) {
          throw new Error('SEARCH_ID_ALREADY_EXISTS')
        }
      }

      if (oldSearchID && oldSearchID !== searchID) {
        const oldSearchIDRef = doc(db, 'searchIDs', oldSearchID)
        transaction.delete(oldSearchIDRef)
      }

      transaction.set(newSearchIDRef, {
        uid: userID,
        updatedAt: serverTimestamp()
      }, { merge: true })

      transaction.set(userRef, {
        ...userData,
        searchID,
        updatedAt: serverTimestamp()
      }, { merge: true })
    })

    return {
      ok: true,
      text: 'プロフィールデータの保存に成功しました'
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'SEARCH_ID_ALREADY_EXISTS'
    ) {
      return {
        ok: false,
        text: 'この検索IDはすでに使われています'
      }
    }

    return {
      ok: false,
      text: 'プロフィールデータの保存に失敗しました'
    }
  }
}

export const userSearch = async (
  searchID: string
) => {

  const q = query(
    collection(db, 'users'),
    where('searchID', '==', searchID),
    limit(1)
  )

  const snap = await getDocs(q)

  if (snap.empty) {
    return null
  }

  const userDoc = snap.docs[0]

  return {
    id: userDoc.id,
    ...userDoc.data()
  }
}