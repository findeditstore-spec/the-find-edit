"use client";

import { TouchEvent, useState } from "react";

type ProductImageGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProductImageGallery({
  images,
  alt,
}: ProductImageGalleryProps) {
  const validImages = images.filter(Boolean).slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  if (validImages.length === 0) {
    return (
      <div className="aspect-square overflow-hidden rounded-[2rem] bg-[#F2EFE9]" />
    );
  }

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? validImages.length - 1 : current - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current === validImages.length - 1 ? 0 : current + 1
    );
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchStart(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStart === null) {
      return;
    }

    const touchEnd = event.changedTouches[0]?.clientX ?? touchStart;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > 40) {
      if (distance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    setTouchStart(null);
  };

  return (
    <div
      className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#F2EFE9]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={validImages[activeIndex]}
        alt={alt}
        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
      />

      {validImages.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm shadow-sm transition hover:bg-white md:block"
          >
            ←
          </button>

          <button
            type="button"
            aria-label="Next image"
            onClick={goToNext}
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm shadow-sm transition hover:bg-white md:block"
          >
            →
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/80 px-2.5 py-1.5 backdrop-blur-sm">
            {validImages.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show image ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  index === activeIndex
                    ? "bg-[#176B6B]"
                    : "bg-[#B8B8B2]"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}