import styles from './Style.module.css'

type CostomButton = {
  type?: 'button' | 'submit' | 'reset'
  action?: () => void
  children : React.ReactNode
}

export default function CostomButton({
  type = 'button',
  action,
  children
}: CostomButton) {

  return (
    <button
      className={styles.ButtonBG}
      type={type}
      onClick={action}
    >
      <div className={styles.TargetArea}>
        <div className={styles.Button}>
          {children}
        </div>
      </div>
    </button>
  )
}