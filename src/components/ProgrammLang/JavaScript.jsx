function JavaScriptPage({ theme, language, setView }) {
    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",

                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <h1
                style={{
                    fontSize: "50px",
                    margin: 0
                }}
            >
                JavaScript Page
            </h1>
        </div>
    )
}

export default JavaScriptPage