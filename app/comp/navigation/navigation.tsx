import styles from "./navigation.module.css";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from "react-router-dom";
import { Lists } from './navigationList'
import Tooltip from '@mui/material/Tooltip';

const iconSize = 40

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Navigation(
  {isOpen, setIsOpen}: Props
) {
  const navigate = useNavigate();
  return (
    <div
      className={` ${styles.navigationBG} ${isOpen ? styles.openBG : styles.closedBG}`}
      onClick={() => setIsOpen(false)}
    >
      <aside
        className={` ${styles.navigation} ${isOpen ? styles.open : styles.closed}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.navigationMain}>
          <div
            className={styles.navigationTitle}
            onClick={() => navigate('/')}
          >
            {/* <img
              src="/app-icon.png"
              alt="app-icon"
              width={iconSize}
              height={iconSize}
            /> */}
            <div
              className={`${isOpen ? styles.Titleopen : styles.Titleclosed}`}
            >
              MENU
            </div>
          </div>
          <div className={styles.navigationRows}>
            {Lists.map((row, index) => (
              <Tooltip
                title={row.name}
                key={index}
                placement="right"
              >
                <div
                  className={styles.navigationRow}
                  onClick={() => navigate(row.link)}
                >
                  {row.icon}
                  <div
                    className={styles.navigationLink}
                  >
                    {isOpen ? row.name : ''}
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
        <div className={styles.navigationFooter}>
          <div className={styles.navigationToggle}>
            {isOpen ? <ArrowBackIosNewIcon onClick={() => setIsOpen(false)} /> : <ArrowForwardIosIcon onClick={() => setIsOpen(true)} />}
          </div>
        </div>
      </aside>
    </div>
  )
}




