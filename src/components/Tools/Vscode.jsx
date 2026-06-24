import Icons from "../icons/Icons"

const VSCodeData = (theme) => ({

  title: "VS Code",

  category: "Development Tool",

  logo:
    theme === "light"
      ? <Icons name="vscode" />
      : <Icons name="vscode" />,

  description: {
    polish:
      "VS Code wykorzystuję jako główne środowisko do programowania. Cenię go za lekkość, ogromną liczbę rozszerzeń oraz wsparcie dla wielu technologii w jednym miejscu.",

    english:
      "I use VS Code as my main development environment. I value it for its speed, huge extension ecosystem and support for multiple technologies in one place."
  },

  features: [
    "Extensions Marketplace",
    "Integrated Terminal",
    "Debugging",
    "Git Integration",
    "Snippets",
    "Workspace Management",
    "IntelliSense",
    "Multi-language Support"
  ],

})

export default VSCodeData