import "./About.css";
import face from "./img/face.jpg";

function About({ theme, language }) {
    const text = {
        polish: {
            subtitle: "Technik programista",
            availability: "Dostępny do pracy",
            description:
                "W tym roku ukończyłem szkołę średnią. Interesuję się programowaniem i lubię stale rozwijać swoje umiejętności w tym kierunku, ucząc się nowych rzeczy i realizując własne projekty. Drugą moją pasją jest badminton, który trenuję regularnie od ponad 10 lat, a także posiadam uprawnienia instruktorskie w tej dyscyplinie.",
        },
        english: {
            subtitle: "Programmer",
            availability: "Available for work",
            description:
                "This year I graduated from high school. I am interested in programming and I enjoy continuously developing my skills in this field by learning new things and building personal projects. My second passion is badminton, which I have been training regularly for over 10 years, and I also hold coaching qualifications in this sport.",
        },
    };

    const t = text[language] || text.polish;

    return (
        <section className={`about ${theme}`}>
            <div className="about-overlay"></div>

            <div className="about-content">
                {/* LEFT SIDE */}
                <div className="about-left">
                    <div className="about-title-box">
                        <div>
                            <h1 className="about-title">Kacper Makulus</h1>

                            <div className="subtitle-row">
                                <h2 className="about-subtitle">{t.subtitle}</h2>

                                <div className="availability-badge">
                                    <span className="status-dot"></span>
                                    {t.availability}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="about-box">
                        <p className="about-description">{t.description}</p>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="about-right">
                    <div className="image-frame">
                        <div className="about-image-placeholder">
                            <img src={face} alt="Me" className="about-image" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
