// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Shao Kiat's Blog",
  tagline: "A leetcode a day keeps unemployment away - Unknown",
  url: "https://shaokiat.github.io",
  baseUrl: "/shaokiat-blog/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "shaokiat", // Usually your GitHub org/user name.
  projectName: "shaokiat-blog", // Usually your repo name.

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/shaokiat/shaokiat-blog/tree/main/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/shaokiat/shaokiat-blog/tree/main/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "dark",
      },
      navbar: {
        title: "Shao Kiat",
        logo: {
          alt: "My Site Logo",
          src: "img/moon.png",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Docs",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            to: "/projects",
            label: "Projects",
            position: "right",
          },
          {
            label: "Resume",
            href: "https://shaokiat.github.io/shaokiat-blog/pdf/resume.pdf",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Content",
            items: [
              {
                label: "Home",
                to: "/",
              },
              {
                label: "Docs",
                to: "/docs/intro",
              },
              {
                label: "Blog",
                to: "/blog",
              },
            ],
          },
          {
            title: "Discover",
            items: [
              {
                label: "Porfolio Website",
                to: "https://www.shaokiat.ml",
              },
              {
                label: "GitHub",
                to: "https://github.com/shaokiat",
              },
            ],
          },
          {
            title: "Contact Me",
            items: [
              {
                label: "LinkedIn",
                to: "https://linkedin.com/in/shaokiat",
              },
              {
                label: "Email",
                href: "mailto:shaokiat@u.nus.edu",
              },
              {
                label: "Resume",
                href: "https://shaokiat.github.io/shaokiat-blog/pdf/resume.pdf",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Lim Shao Kiat. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
