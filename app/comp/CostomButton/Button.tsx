import styles from './Style.module.css'

type CostomButton = {
  buttonName: string
  type?: 'button' | 'submit' | 'reset'
  action?: () => void
}

export default function CostomButton({
  buttonName,
  type = 'button',
  action
}: CostomButton) {

  return (
    <button
      className={styles.ButtonBG}
      type={type}
      onClick={action}
    >
      <div className={styles.TargetArea}>
        <div className={styles.Button}>
          {buttonName}
        </div>
      </div>
    </button>
  )
}