import styles from './Style.module.css'





export default function InputArea({ children }: { children: React.ReactNode }) {

  return (
    <div className={styles.InputMainArea}>
      <div className={styles.Border}>
        <div className={styles.TargetArea}>
          {children}
        </div>
      </div>
    </div>
  )
}