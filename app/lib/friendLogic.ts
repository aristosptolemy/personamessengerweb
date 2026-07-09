import { db } from './firebase'


import {
  doc,
  getDoc,
  addDoc,
  getDocs,
  serverTimestamp,
  runTransaction,
  where,
  collection,
  query,
  limit,
  type Timestamp,
} from 'firebase/firestore'




export const friendRequestSend = async (
  friendUID: string,
  MyID: string,
  message: string
) => {
  const data = {
    partnerID: MyID,
    message: message,
    type: 'friend'
  }

  const collect = collection(
    db, 'users', friendUID, 'Requests'
  )
  try {
    await addDoc(collect, data)
    return {ok: true, text: 'フレンド依頼の送信に成功しました'}
  } catch {
    return {ok: false, text: 'フレンド依頼の送信に失敗しました'}
  }
  
}

