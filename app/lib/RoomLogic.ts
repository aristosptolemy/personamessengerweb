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



type Result = {
  ok: boolean
  text: string
  roomDocID?: string
}

type RoomData = {
  roomName: string
  roomID: string
  members: string[]
}

export const roomCreate = async (
  roomData: RoomData
): Promise<Result> => {
  try {
    const roomName = roomData.roomName?.trim() ?? ''

    const rawRoomID = roomData.roomID ?? ''

    const roomID = rawRoomID
      .toLowerCase()
      .replace(/^@/, '')
      .replace(/[^a-z0-9_]/g, '')

    if (!roomName) {
      return {
        ok: false,
        text: 'ルーム名を入力してください'
      }
    }

    if (!roomID) {
      return {
        ok: false,
        text: 'ルームIDを入力してください'
      }
    }

    const members = Array.from(
      new Set(roomData.members ?? [])
    ).filter(Boolean)

    if (members.length < 1) {
      return {
        ok: false,
        text: '作成者情報が取得できませんでした'
      }
    }

    const ownerID = members[0]

    const memberMap = members.reduce<Record<string, boolean>>(
      (result, uid) => {
        result[uid] = true
        return result
      },
      {}
    )

    const roomDocID = await runTransaction(db, async (transaction) => {
      const roomIDRef = doc(db, 'roomIDs', roomID)
      const roomIDSnap = await transaction.get(roomIDRef)

      if (roomIDSnap.exists()) {
        throw new Error('ROOM_ID_ALREADY_EXISTS')
      }

      const roomRef = doc(collection(db, 'rooms'))

      transaction.set(roomRef, {
        roomName,
        roomID,
        members,
        memberMap,
        ownerID,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      transaction.set(roomIDRef, {
        roomDocID: roomRef.id,
        ownerID,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      return roomRef.id
    })

    return {
      ok: true,
      text: 'チャットルームを作成しました',
      roomDocID
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'ROOM_ID_ALREADY_EXISTS'
    ) {
      return {
        ok: false,
        text: 'このルームIDはすでに使われています'
      }
    }

    console.error(error)

    return {
      ok: false,
      text: 'チャットルームの作成に失敗しました'
    }
  }
}

export const GroupRoomRequestSend = async (
  friendUID: string,
  MyID: string,
  roomID: string,
  roomName: string
) => {
  const data = {
    partnerID: MyID,
    type: 'groupRoom',
    roomName: roomName,
    roomID: roomID
  }

  const collect = collection(
    db, 'users', friendUID, 'Requests'
  )

  try {
    await addDoc(collect, data)
    return {ok: true, text: 'ルーム招待の送信に成功しました'}
  } catch {
    return {ok: false, text: 'ルーム招待の送信に失敗しました'}
  }
}

export const RoomDataGet = async (
  roomID: string
) => {
  const roomRef = doc(db, 'rooms', roomID)

  try {
    const snap = await getDoc(roomRef)
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