import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const dotsBase =
    "h-2 w-2 rounded-full border border-white/20 transition-all";
const arrowBtn =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10";

const Carousel = ({
    images = [],
    autoPlay = true,
    interval = 3800,
    className = "",
}) => {
    const safeImages = useMemo(
        () =>
            images.length
                ? images
                : [
                    "https://picsum.photos/1200/600?random=11",
                    "https://picsum.photos/1200/600?random=12",
                    "https://picsum.photos/1200/600?random=13",
                ],
        [images]
    );

    const [index, setIndex] = useState(0);
    const timer = useRef(null);

    const prev = () => setIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
    const next = () => setIndex((i) => (i + 1) % safeImages.length);

    useEffect(() => {
        if (!autoPlay) return;
        timer.current && clearInterval(timer.current);
        timer.current = setInterval(next, interval);
        return () => clearInterval(timer.current);
    }, [index, autoPlay, interval, safeImages.length]);

    return (
        <section className={"mx-auto max-w-7xl px-4 " + className}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c0f17]">
                {/* slides */}
                <div
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {safeImages.map((src, i) => (
                        <div key={i} className="min-w-full">
                            <img
                                src={src}
                                alt={`Slide ${i + 1}`}
                                className="h-[420px] w-full object-cover opacity-90"
                            />
                        </div>
                    ))}
                </div>

                {/* arrows */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
                    <button
                        onClick={prev}
                        className={arrowBtn + " pointer-events-auto"}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-5 w-5 text-white" />
                    </button>
                    <button
                        onClick={next}
                        className={arrowBtn + " pointer-events-auto"}
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-5 w-5 text-white" />
                    </button>
                </div>

                {/* dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2">
                        {safeImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={
                                    dotsBase +
                                    " " +
                                    (i === index ? "h-2.5 w-6 bg-white/80" : "bg-white/20")
                                }
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Carousel;
