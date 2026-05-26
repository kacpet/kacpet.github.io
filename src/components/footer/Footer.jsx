import './Footer.css'

function Footer({ theme, language }) {

    return (
        <footer className={`footer ${theme}`}>

            <div className="footer-content">

                <div className="footer-item">
                    <span className="footer-label">
                        Facebook
                    </span>

                    <a
                        href="https://www.facebook.com/kacper.makulus?locale=pl_PL"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Facebook
                    </a>
                </div>

                <div className="footer-item">
                    <span className="footer-label">
                        E-mail
                    </span>

                    <a href="mailto:kacpermakulus@gmail.com">
                        kacpermakulus@gmail.com
                    </a>
                </div>

                <div className="footer-item">
                    <span className="footer-label">
                        {language === "polish"
                            ? "Telefon"
                            : "Phone"}
                    </span>

                    <a href="tel:+48 725 532 818">
                        +48 725 532 818
                    </a>
                </div>

            </div>

        </footer>
    )
}

export default Footer