/* ============================================================
   ADD YOUR PROJECTS HERE
   Copy one block, paste it below, and change the details.
   The home page and the "All projects" page update by themselves.

   title       : project name
   description : 1-2 lines about what it does
   tools       : tools used, e.g. "Power BI, Excel"
   domain      : category, used to group projects on the All projects page
                 (e.g. "Sales", "Finance", "Healthcare", "HR", "E-commerce")
   link        : link to GitHub / Power BI report / Kaggle / case study
   image       : (optional) path to a screenshot, e.g. "images/sales.png"
                 If empty, a clean placeholder graphic is shown.
   thumb       : placeholder style if no image: "bars", "table" or "line"
   featured    : true = also shown in the carousel on the home page
   ============================================================ */

const PROJECTS = [
  {
    title: "Sales dashboard",
    description: "Interactive Power BI report tracking revenue, trends and top products.",
    tools: "Power BI, Excel",
    domain: "Sales",
    link: "#",
    image: "",
    thumb: "bars",
    featured: true
  },
  {
    title: "SQL business analysis",
    description: "Queries that answer key business questions from a multi-table database.",
    tools: "SQL",
    domain: "Sales",
    link: "#",
    image: "",
    thumb: "table",
    featured: true
  },
  {
    title: "Exploratory data analysis",
    description: "Cleaned a raw dataset and found patterns using Python.",
    tools: "Python, Pandas",
    domain: "Finance",
    link: "#",
    image: "",
    thumb: "line",
    featured: true
  },
  {
    title: "HR attrition analysis",
    description: "Dashboard showing why employees leave and which teams are most affected.",
    tools: "Power BI, SQL",
    domain: "HR",
    link: "#",
    image: "",
    thumb: "bars",
    featured: true
  },
  {
    title: "Patient visits report",
    description: "Excel report tracking hospital visits, wait times and departments.",
    tools: "Excel",
    domain: "Healthcare",
    link: "#",
    image: "",
    thumb: "table",
    featured: false
  },
  {
    title: "Customer churn analysis",
    description: "Python analysis predicting which customers are likely to leave.",
    tools: "Python, Pandas",
    domain: "E-commerce",
    link: "#",
    image: "",
    thumb: "line",
    featured: false
  }
];
