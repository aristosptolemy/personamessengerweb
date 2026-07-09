import { db } from './firebase'


import {
  doc,
  serverTimestamp,
  collection,
  writeBatch,
  arrayUnion
} from 'firebase/firestore'


export const RequestsGet = async (
  UserID: string
) => {
  const collections = collection(db, 'users', UserID, 'Requests')
}


export const Completion = async (
  MyID: string,
  friendID: string,
  requestID: string
) => {
  const roomRef = doc(collection(db, 'rooms'))
  const roomID = roomRef.id

  const batch = writeBatch(db)

  const myFriendRef = doc(db, 'users', MyID, 'friends', friendID)
  const friendRef = doc(db, 'users', friendID, 'friends', MyID)
  const requestRef = doc(db, 'users', MyID, 'Requests', requestID)
  
  batch.set(roomRef, {
    createdAt: serverTimestamp(),
    members: [MyID, friendID],
    memberMap: {
      [MyID]: true,
      [friendID]: true,
    },
    roomName: ``
  })

  batch.set(myFriendRef, {
    uid: friendID,
    roomID,
    createdAt: serverTimestamp(),
    status: 'active',
  })

  batch.set(friendRef, {
    uid: MyID,
    roomID,
    createdAt: serverTimestamp(),
    status: 'active',
  })

  batch.delete(requestRef)

  await batch.commit()



  return roomID
}




export const RoomCompletion = async (
  MyID: string,
  RoomID: string,
  requestID: string
) => {
  const batch = writeBatch(db)

  const roomRef = doc(db, 'rooms', RoomID)

  const requestRef = doc(
    db,
    'users',
    MyID,
    'Requests',
    requestID
  )

  batch.update(roomRef, {
    members: arrayUnion(MyID),
    [`memberMap.${MyID}`]: true,
    updatedAt: serverTimestamp(),
  })

  batch.delete(requestRef)

  await batch.commit()

  return RoomID
}
