export const resizeProfileImage = async (file: File, size = 230) => {
        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = reader.result as string;
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("Unable to resize image");
        }

        const sourceSize = Math.min(image.width, image.height);
        const sourceX = (image.width - sourceSize) / 2;
        const sourceY = (image.height - sourceSize) / 2;

        context.drawImage(
            image,
            sourceX,
            sourceY,
            sourceSize,
            sourceSize,
            0,
            0,
            size,
            size,
        );

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, file.type || "image/png", 0.92);
        });

        if (!blob) {
            throw new Error("Failed to resize image");
        }

        return new File([blob], file.name, {
            type: blob.type || file.type,
            lastModified: Date.now(),
        });
    };