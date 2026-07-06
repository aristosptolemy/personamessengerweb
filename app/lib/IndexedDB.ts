import { openDB, type IDBPDatabase } from 'idb'
import { Timestamp } from 'firebase/firestore'
import type { Message } from '~/hooks/useChatRoomListener'

type CachedMessage = {
  roomID: string
  id: string
  sendID: string
  message: string
  sendAtMillis: number
  updatedAtMillis: number
}

type Meta = {
  key: string
  value: number
}

const DB_NAME = 'chat-db'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase> | null = null

const isBrowser = () => {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined'
}

const getDB = () => {
  if (!isBrowser()) {
    return null
  }

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('messages')) {
          const messagesStore = db.createObjectStore('messages', {
            keyPath: ['roomID', 'id'],
          })

          messagesStore.createIndex('roomID', 'roomID')
          messagesStore.createIndex('roomID_sendAtMillis', [
            'roomID',
            'sendAtMillis',
          ])
        }

        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', {
            keyPath: 'key',
          })
        }
      },
    })
  }

  return dbPromise
}

const toMillis = (timestamp?: Timestamp | null) => {
  return timestamp ? timestamp.toMillis() : Date.now()
}

export const saveMessagesToIndexedDB = async (
  roomID: string,
  messages: Message[]
) => {
  const db = await getDB()

  if (!db) return

  const tx = db.transaction('messages', 'readwrite')
  const store = tx.objectStore('messages')

  for (const message of messages) {
    const cachedMessage: CachedMessage = {
      roomID,
      id: message.id,
      sendID: message.sendID,
      message: message.message,
      sendAtMillis: toMillis(message.sendAt),
      updatedAtMillis: toMillis(message.updatedAt ?? message.sendAt),
    }

    await store.put(cachedMessage)
  }

  await tx.done
}

export const getMessagesFromIndexedDB = async (
  roomID: string
): Promise<Message[]> => {
  const db = await getDB()

  if (!db) return []

  const index = db.transaction('messages').store.index('roomID')
  const cachedMessages = await index.getAll(roomID) as CachedMessage[]

  return cachedMessages
    .sort((a, b) => a.sendAtMillis - b.sendAtMillis)
    .map((message) => ({
      id: message.id,
      sendID: message.sendID,
      message: message.message,
      sendAt: Timestamp.fromMillis(message.sendAtMillis),
      updatedAt: Timestamp.fromMillis(message.updatedAtMillis),
    }))
}

export const getLastSyncedAt = async (
  roomID: string
): Promise<number> => {
  const db = await getDB()

  if (!db) return 0

  const meta = await db.get(
    'meta',
    `room:${roomID}:lastSyncedAt`
  ) as Meta | undefined

  return meta?.value ?? 0
}

export const setLastSyncedAt = async (
  roomID: string,
  value: number
) => {
  const db = await getDB()

  if (!db) return

  await db.put('meta', {
    key: `room:${roomID}:lastSyncedAt`,
    value,
  })
}