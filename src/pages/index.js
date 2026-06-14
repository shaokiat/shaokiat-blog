import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import HomepageFeatures from "../components/HomepageFeatures";

const HOBBIES = [
  { icon: "🏂", label: "Snowboarding" },
  { icon: "🏍️", label: "Motorcycling" },
  { icon: "🤿", label: "Diving" },
  { icon: "📱", label: "Photography" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/shaokiat" },
  { label: "LinkedIn", href: "https://linkedin.com/in/shaokiat" },
  { label: "Portfolio", href: "https://shaokiat.vercel.app" },
  { label: "Instagram", href: "https://instagram.com/gentlefogg" },
  { label: "Email", href: "mailto:shaokiat@gmail.com" },
];

function HomepageHero() {
  return (
    <section className={styles.hero}>
      <div className={clsx("container", styles.heroContainer)}>
        <div className={styles.heroLeft}>
        <p className={styles.greeting}>Hi, I'm</p>
        <h1 className={styles.name}>Shao Kiat</h1>
        <div className={styles.roleBadge}>Data Scientist</div>
        <p className={styles.tagline}>
          I build AI that makes it to production and document what I learn along the way.
        </p>
        <p className={styles.tagline2}>
          🎓 AI advocate at heart. I give back by volunteering as an AI Explorer Trainer at Micron, helping everyday people get comfortable with AI.
        </p>
        <div className={styles.ctaRow}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Study Notes
          </Link>
          <Link
            className="button button--outline button--primary button--lg"
            to="/blog"
          >
            Blog Posts
          </Link>
        </div>
        <div className={styles.hobbyRow}>
          {HOBBIES.map(({ icon, label }) => (
            <span key={label} className={styles.hobbyChip}>
              {icon} {label}
            </span>
          ))}
        </div>
        <div className={styles.socialRow}>
          {SOCIAL_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>
          ))}
        </div>
        </div>
        <div className={styles.heroRight}>
          <img
            src="/shaokiat-blog/img/hero.png"
            alt="Shao Kiat"
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout description="Technical notes and blog by Lim Shao Kiat — GCP, AI/ML, algorithms, and more.">
      <HomepageHero />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
