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


export const createRoom = async (
  name: string
) => {

  const addData = {
    createdAt: serverTimestamp(),
    roomName: name
  }

  const collect = collection(db, 'Rooms')

  const result = await addDoc(collect, addData)
  return result
}


export const messageSend = async (
  text: string,
  roomID: string,
  userID: string
) => {
  const data = {
    message: text,
    sendID: userID,
    sendAt: serverTimestamp(),
    updateAt: serverTimestamp()
  }

  const collect = collection(
    db, 'rooms', roomID, 'messages'
  )

  await addDoc(collect, data)

}
