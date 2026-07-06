import styles from './Style.module.css'

type MessageAreaProps = {
  children: React.ReactNode
  isMine?: boolean
}

export default function ChatMessageArea({
  children,
  isMine = false
}: MessageAreaProps) {
  return (
    <div
      className={`${styles.InputMainArea} ${isMine ? styles.Mine : styles.Other}`}
    >
      <div className={styles.ArrowArea}>
        <div className={styles.ArrowBG}>
          <div className={styles.ArrowW} />
        </div>
      </div>

      <div className={styles.Border}>
        <div className={styles.TargetArea}>
          {children}
        </div>
      </div>
    </div>
  )
}