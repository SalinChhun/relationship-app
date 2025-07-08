import {useState} from "react";

export const ImageModal: React.FC<{
    images: string[]
    initialIndex: number
    onClose: () => void
}> = ({ images, initialIndex, onClose }) => {
    const [index, setIndex] = useState(initialIndex)

    const prev = () => setIndex((i) => (i > 0 ? i - 1 : images.length - 1))
    const next = () => setIndex((i) => (i < images.length - 1 ? i + 1 : 0))

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <button onClick={onClose} className="absolute top-5 right-5 text-white text-3xl">×</button>

            <button onClick={prev} className="absolute left-4 text-white text-3xl">&#10094;</button>

            <img
                src={images[index]}
                alt="Preview"
                className="max-h-[90vh] max-w-[90vw] object-contain"
            />

            <button onClick={next} className="absolute right-4 text-white text-3xl">&#10095;</button>
        </div>
    )
}
