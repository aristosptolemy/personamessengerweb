import styles from './Style.module.css'

export default function IconArea({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.IconArea}>
      <div className={styles.IconClip}>
        <div className={styles.IconFrame}>
          {children}
        </div>
      </div>
    </div>
  )
}