import "./ImageSlider.css";
import { useEffect, useState } from "react";

const AUTO_TIME = 4000;
const ANIMATION_TIME = 500;

function ImageSlider({ project, theme, language }) {
    const images =
        language === "polish"
            ? theme === "dark"
                ? project.imgsDarkPL
                : project.imgsLightPL
            : theme === "dark"
              ? project.imgsDarkENG
              : project.imgsLightENG;

    const [current, setCurrent] = useState(0);
    const [next, setNext] = useState(null);
    const [direction, setDirection] = useState("next");
    const [animating, setAnimating] = useState(false);

    const changeSlide = (index, dir = "next") => {
        if (animating) return;
        if (index === current) return;

        setDirection(dir);
        setNext(index);
        setAnimating(true);

        setTimeout(() => {
            setCurrent(index);
            setNext(null);
            setAnimating(false);
        }, ANIMATION_TIME);
    };

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            changeSlide((current + 1) % images.length, "next");
        }, AUTO_TIME);

        return () => clearInterval(interval);
    }, [current, images]);

    return (
        <div className="image-slider">
            <div className="slider-window">
                {!animating && <img src={images[current]} className="slide current" alt="" />}

                {animating && (
                    <>
                        <img src={images[current]} className={`slide current slide-out-${direction}`} alt="" />

                        <img src={images[next]} className={`slide next slide-in-${direction}`} alt="" />
                    </>
                )}
            </div>

            {images.length > 1 && (
                <div className="slider-dots">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`slider-dot ${index === current ? "active" : ""}`}
                            onClick={() => changeSlide(index, index > current ? "next" : "prev")}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ImageSlider;
