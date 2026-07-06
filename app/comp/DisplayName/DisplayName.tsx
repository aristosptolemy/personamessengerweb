import styles from './Style.module.css'


export default function DisplayArea({ children }: { children: React.ReactNode }) {

  return (
    <div className={styles.MainArea}>
      <div className={styles.TitleBorder}>
        <div className={styles.TitleArea}>
          <div className={styles.TitleBG}>
            <div className={styles.Title}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}