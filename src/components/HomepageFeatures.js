import React from "react";
import Link from "@docusaurus/Link";
import styles from "./HomepageFeatures.module.css";

const CONTENT_AREAS = [
  {
    icon: "⚡",
    title: "GenAI & Agents",
    description:
      "Hands-on evaluation of GenAI workflows and agentic systems — starting with AI slide deck generation tools.",
    link: "/docs/genai-agents/intro",
    cta: "Explore",
  },
  {
    icon: "☁️",
    title: "GCP Cloud Architect",
    description:
      "Exam prep for Google Professional Cloud Architect — reference decision guides, service comparisons, and official case study walkthroughs.",
    link: "/docs/google-professional-cloud-architect/intro",
    cta: "View Notes",
  },
  {
    icon: "🧮",
    title: "Algorithms & DSA",
    description:
      "LeetCode patterns, data structures, and interview prep topics organised by problem type.",
    link: "/docs/algorithms/arrays",
    cta: "Study Now",
  },
  {
    icon: "✍️",
    title: "Blog",
    description:
      "Longer-form writeups on AI/ML projects, engineering lessons, and things I'm figuring out.",
    link: "/blog",
    cta: "Read Posts",
  },
];

const SKILLS = [
  {
    category: "LLM & Agents",
    items: ["Python", "LangChain", "RAG", "MCP", "OpenAI", "Claude API"],
  },
  {
    category: "ML & Data Science",
    items: ["PyTorch", "Computer Vision", "MLflow", "Pandas", "scikit-learn"],
  },
  {
    category: "Cloud & Infra",
    items: ["GCP", "Terraform", "Docker", "Kubernetes", "BigQuery", "Vertex AI"],
  },
  {
    category: "Engineering",
    items: ["React", "Node.js", "PostgreSQL", "FastAPI", "TypeScript"],
  },
];

function ContentCard({ icon, title, description, link, cta }) {
  return (
    <div className={styles.contentCard}>
      <span className={styles.cardIcon}>{icon}</span>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{description}</p>
      <Link className={styles.cardCta} to={link}>
        {cta} →
      </Link>
    </div>
  );
}

function SkillGroup({ category, items }) {
  return (
    <div className={styles.skillGroup}>
      <h4 className={styles.skillCategory}>{category}</h4>
      <div className={styles.skillTags}>
        {items.map((item) => (
          <span key={item} className={styles.skillTag}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <>
      <section className={styles.contentSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What's Here</h2>
          <div className={styles.contentGrid}>
            {CONTENT_AREAS.map((area) => (
              <ContentCard key={area.title} {...area} />
            ))}
          </div>
        </div>
      </section>
      <section className={styles.skillsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Tech Stack</h2>
          <div className={styles.skillsGrid}>
            {SKILLS.map((group) => (
              <SkillGroup key={group.category} {...group} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
