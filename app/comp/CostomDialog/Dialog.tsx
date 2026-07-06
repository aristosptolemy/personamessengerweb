import styles from './Style.module.css'

type DialogProps = {
  children: React.ReactNode
  setFriendRequestOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Dialog(
  {
    children,
    setFriendRequestOpen
  }: DialogProps
) {

  return (
    <div
      className={styles.DialogBG}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setFriendRequestOpen(false)
        }
      }}
    >
      <div className={styles.DialogBorder}>
        <div className={styles.DialogMain}>
          <div className={styles.DialogMainBG}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}









