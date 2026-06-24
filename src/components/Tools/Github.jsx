import Icons from "../icons/Icons"

const GithubData = (theme) => ({

  title: "GitHub",

  category: "tool",

  logo:
    theme === "light"
      ? <Icons name="github light" />
      : <Icons name="github dark" />,

  description: {
    polish:
      "GitHub wykorzystuję do zarządzania projektami, kontroli wersji oraz współpracy nad aplikacjami frontendowymi i backendowymi.",

    english:
      "I use GitHub for project management, version control and collaboration on frontend and backend applications."
  },


  features: [
    "Git",
    "Version Control",
    "Repositories",
    "Pull Requests",
    "Branching",
    "Code Review",
    "GitHub Actions",
    "Team Collaboration"
  ],
})

export default GithubData