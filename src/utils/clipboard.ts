type CopyResult = {
  ok: boolean;
  message?: string;
};

export const copyToClipboard = async (text: string): Promise<CopyResult> => {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return { ok: true };
    } catch {
      return fallbackCopy(text);
    }
  }

  return fallbackCopy(text);
};

export const copyImageDataUrlToClipboard = async (dataUrl: string): Promise<CopyResult> => {
  if (!navigator.clipboard || typeof navigator.clipboard.write !== "function" || typeof ClipboardItem === "undefined") {
    const fallback = await copyToClipboard(dataUrl);
    if (fallback.ok) {
      return {
        ok: false,
        message: "Браузер скопировал только DataURL-текст. Вставка как изображение недоступна.",
      };
    }
    return fallback;
  }

  try {
    const sourceBlob = await dataUrlToBlob(dataUrl);
    const sourceMimeType = sourceBlob.type || "image/png";

    if (sourceMimeType === "image/svg+xml") {
      try {
        await writeBlobToClipboard(sourceBlob, "image/svg+xml");
        return { ok: true };
      } catch {
        const pngBlob = await convertSvgBlobToPng(sourceBlob);
        await writeBlobToClipboard(pngBlob, "image/png");
        return { ok: true };
      }
    }

    await writeBlobToClipboard(sourceBlob, sourceMimeType);
    return { ok: true };
  } catch {
    const fallback = await copyToClipboard(dataUrl);
    if (fallback.ok) {
      return {
        ok: false,
        message: "Изображение не удалось скопировать как файл. Скопирован DataURL-текст.",
      };
    }
    return fallback;
  }
};

const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const response = await fetch(dataUrl);
  return response.blob();
};

const writeBlobToClipboard = async (blob: Blob, mimeType: string): Promise<void> => {
  await navigator.clipboard.write([
    new ClipboardItem({
      [mimeType]: blob,
    }),
  ]);
};

const convertSvgBlobToPng = async (svgBlob: Blob): Promise<Blob> => {
  const svgUrl = URL.createObjectURL(svgBlob);
  try {
    const image = await loadImage(svgUrl);
    const width = Math.max(1, image.naturalWidth || image.width || 512);
    const height = Math.max(1, image.naturalHeight || image.height || 512);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2D context is not available");
    }

    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const pngBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });

    if (!pngBlob) {
      throw new Error("Failed to convert SVG to PNG");
    }
    return pngBlob;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
};

const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = url;
  });

const fallbackCopy = (text: string): CopyResult => {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (copied) {
      return { ok: true };
    }
    return { ok: false, message: "Копирование не поддерживается в этом контексте браузера." };
  } catch {
    return { ok: false, message: "Не удалось скопировать в буфер обмена." };
  }
};
