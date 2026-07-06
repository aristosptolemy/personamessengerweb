import { Bytes } from "firebase/firestore";

/**
 * 画像ファイルをWebP形式に圧縮・リサイズし、FirestoreのBytes型に変換する関数
 * @param file 入力された画像ファイル (PNGやJPEGなど)
 * @param maxWidth 変換後の最大横幅 (アスペクト比を維持)
 * @param quality 圧縮品質 (0.0 ～ 1.0)
 * @returns Firestoreが扱えるBytes型を内包したPromise
 */
export const convertToWebPBytes = (
  file: File,
  maxWidth: number = 400,
  quality: number = 0.85
): Promise<Bytes> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // アスペクト比を維持したまま、指定のmaxWidthに縮小
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context の取得に失敗しました"));
          return;
        }

        // Canvasに画像を描画
        ctx.drawImage(img, 0, 0, width, height);

        // CanvasからWebP形式のBlobを出力
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("WebP変換に失敗しました"));
              return;
            }

            // BlobをArrayBufferに変換
            const blobReader = new FileReader();
            blobReader.readAsArrayBuffer(blob);
            blobReader.onloadend = () => {
              const arrayBuffer = blobReader.result as ArrayBuffer;
              const uint8Array = new Uint8Array(arrayBuffer);
              
              // 【追加】ここでFirestoreのBytes型にラップする
              const firebaseBytes = Bytes.fromUint8Array(uint8Array);
              resolve(firebaseBytes);
            };
            blobReader.onerror = () => reject(blobReader.error);
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
    };

    reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました"));
  });
};