import Icons from "../icons/Icons";

const FigmaData = (theme) => ({
    title: "Figma",

    category: "Design Tool",

    logo: theme === "light" ? <Icons name="figma" /> : <Icons name="figma" />,

    description: {
        polish: "Figma wykorzystuję do projektowania interfejsów użytkownika, tworzenia prototypów oraz współpracy nad designem w czasie rzeczywistym. Jest bardzo wygodna do pracy zespołowej i UI/UX.",

        english:
            "I use Figma for designing user interfaces, creating prototypes and real-time collaboration on UI/UX design. It is especially useful for team-based design work.",
    },

    features: [
        "UI/UX Design",
        "Prototyping",
        "Real-time Collaboration",
        "Component System",
        "Auto Layout",
        "Design Systems",
        "Developer Handoff",
        "Vector Editing",
    ],
});

export default FigmaData;
