import { useEffect, useState } from 'react'
import { Outlet, useLocation } from "react-router"
import styles from "./style.module.css";
import Navigation from "@comp/navigation/navigation";
import HeaderArea from "@comp/Header/Header";
import { Toaster } from 'react-hot-toast';

export default function ProtectedLayout() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isGroupSettingPage = location.pathname === "/group-setting"

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <main>
      <Toaster />

      <div className={styles.Main}>
        {!isGroupSettingPage && (
          <div className={styles.Navigation}>
            <Navigation
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </div>
        )}

        <div className={styles.Content}>
          {!isGroupSettingPage && (
            <div className={styles.Header}>
              <HeaderArea
                setIsOpen={setIsOpen}
              />
            </div>
          )}

          <div className={styles.ContentArea}>
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
}