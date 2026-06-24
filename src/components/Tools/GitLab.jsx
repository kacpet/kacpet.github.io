import Icons from "../icons/Icons"

const GitlabData = (theme) => ({

  title: "GitLab",

  category: "Development Tool",

  logo:
    theme === "light"
      ? <Icons name="gitlab" />
      : <Icons name="gitlab" />,

  description: {
    polish:
      "GitLab wykorzystuję do zarządzania repozytoriami, automatyzacji CI/CD oraz pracy zespołowej nad projektami. Szczególnie cenię wbudowane pipeline’y i integrację DevOps w jednym miejscu.",

    english:
      "I use GitLab for repository management, CI/CD automation and team collaboration. I especially value its built-in pipelines and all-in-one DevOps integration."
  },

  features: [
    "Git Repositories",
    "CI/CD Pipelines",
    "Merge Requests",
    "Branch Management",
    "Code Review",
    "Issue Tracking",
    "DevOps Integration",
    "Self-hosting option"
  ],

})

export default GitlabData