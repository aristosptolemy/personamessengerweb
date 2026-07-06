import styles from './Style.module.css'
import { useEffect, useState } from 'react'
import IconArea from '@comp/Icon/IconArea'

export default function UserRow({
  target
}) {
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    if (!target || !target?.imgBinary) return

    const binary = target?.imgBinary
    if (!binary) {
      setImageUrl('')
      return
    }
    let blob: Blob | null = null
    if (typeof binary.toUint8Array === 'function') {
      blob = new Blob([binary.toUint8Array()], {
        type: 'image/webp',
      })
    } else if (binary._byteString?.binaryString) {
      const uint8Array = Uint8Array.from(
        binary._byteString.binaryString,
        (char) => char.charCodeAt(0)
      )

      blob = new Blob([uint8Array], {
        type: 'image/webp',
      })
    }
    if (!blob) {
      setImageUrl('')
      return
    }
    const url = URL.createObjectURL(blob)
    setImageUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [target])


  return (
    <div className={styles.Row}>
      <IconArea>
        {imageUrl && (
          <img
            className={styles.Img}
            src={imageUrl}
            width={170}
            height={170}
          />
        )}
      </IconArea>
    </div>
  )
}