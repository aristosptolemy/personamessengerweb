import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { UserData } from '@lib/LoginLogics'
import ProtectedLayout from '@layouts/ProtectedLayout/ProtectedLayout'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const [userDataLoading, setUserDataLoading] = useState(true)

  useEffect(() => {
    const setupUserData = async () => {
      if (!user) {
        setUserDataLoading(false)
        return
      }

      const localUserData = localStorage.getItem('userData')

      if (localUserData) {
        setUserDataLoading(false)
        return
      }

      try {
        const result = await UserData(user.uid)

        const data = {
          id: user.uid,
          displayName: result?.displayName ?? ''
        }

        localStorage.setItem('userData', JSON.stringify(data))
      } catch (error) {
        console.error('ユーザーデータ取得エラー:', error)
      } finally {
        setUserDataLoading(false)
      }
    }

    if (!loading) {
      setupUserData()
    }
  }, [user, loading])

  useEffect(() => {
    if (!loading && user && !user.emailVerified) {
      alert('メール認証が完了していません。確認メールをご確認ください。')
    }
  }, [user, loading])

  if (loading || userDataLoading) {
    return <div>認証状態を確認中...</div>
  }

  if (!user) {
    return <Navigate to="/Login" replace />
  }

  if (!user.emailVerified) {
    return <Navigate to="/Login" replace />
  }

  return <ProtectedLayout />
}



