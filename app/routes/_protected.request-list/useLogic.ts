import { useGroup } from '@providers/GroupProvider'



export const useLogic = () => {
  const {
    requests,
    userData
  } = useGroup()

  return {
    requests,
    userData
  }
}





