import styles from './Style.module.css'




export default function MessageArea(
  { children }: { children: React.ReactNode }
) {


  return (
    <div className={styles.InputMainArea}>
      <div className={styles.ArrowArea}>
        <div className={styles.ArrowBG}>
          <div className={styles.ArrowW}/>
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