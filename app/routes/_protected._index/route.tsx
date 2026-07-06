import styles from './Style.module.css'
import { useEffect } from 'react'
import { userDataGet } from '@lib/usersLogic'

import { useNavigate } from 'react-router'

export default function Main() {
  const navigate = useNavigate()
  const localData = localStorage.getItem('userData')
  const userID = localData ? JSON.parse(localData) : null

  const userDataCheck = async() => {
    const localData = await userDataGet(userID.id)
    localStorage.setItem('userData', JSON.stringify(localData))
    if (!localData) {
      navigate(`/user-setting/${userID.id}`)
    } else {
      navigate('/chat-rooms')
    }
  }

  useEffect(() => {
    if (!userID) return
    userDataCheck()
  }, [userID])

  return (
    <div className={styles.BG}>
      
    </div>
  )
}


