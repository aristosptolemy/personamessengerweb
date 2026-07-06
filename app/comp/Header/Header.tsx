import styles from './header.module.css'

import MenuIcon from '@mui/icons-material/Menu';

export default function HeaderArea(
  { setIsOpen }: { setIsOpen: (isOpen: boolean) => void }
) {

  return (
    <div className={styles.headerBG}>
      <div className={styles.headerMain}>
        <div className={styles.headerMenu}>
          <MenuIcon onClick={() => setIsOpen(true)} />
        </div>
        <div className={styles.headerTitle}>
        </div>
      </div>
      
    </div>
  )
}