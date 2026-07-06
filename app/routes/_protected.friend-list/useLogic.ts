import { useGroup } from '@providers/GroupProvider'


import { useState, useEffect } from 'react'

import { userDataGet } from '@lib/usersLogic'


export const useLogic = () => {
  const [friendDatas, setFriendDatas] = useState([])

  const {
    userData,
    friends
  } = useGroup()

  const dataSets = async() => {
    if (!friends) return
    const result = []
    for (const row of friends) {
      const data = await userDataGet(row.id)
      result.push(data)
    }
    setFriendDatas(result)
  }

  useEffect(() => {
    if (friends) {
      dataSets()
    }
  }, [friends])


  return {
    friendDatas
  }
}





