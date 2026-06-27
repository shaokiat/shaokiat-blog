// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.nightOwl;

/** @type {import('@docusaurus/types').Config} */
const config = {
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  themes: ["@docusaurus/theme-mermaid"],
  title: "Shao Kiat's Blog",
  tagline: "A leetcode a day keeps unemployment away",
  url: "https://shaokiat.github.io",
  baseUrl: "/shaokiat-blog/",
  onBrokenLinks: "throw",
  favicon: "img/moon.ico",
  organizationName: "shaokiat",
  projectName: "shaokiat-blog",

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/shaokiat/shaokiat-blog/tree/main/",
          exclude: ["**/web-dev/**", "**/web3/**", "**/data-science/**"],
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/shaokiat/shaokiat-blog/tree/main/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-VS62WFN2SY",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        // The application ID provided by Algolia
        appId: "Z5MPWY1B2N",

        // Public API key: it is safe to commit it
        apiKey: "088621958f3db9d62150802ce43e3b95",

        indexName: "shaokiat_blog",

        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: "external\\.com|domain\\.com",

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: "search",

        // Run this command to crawl page and update algolia
        // docker run -it --env-file=.env -e "CONFIG=$(cat /Users/shaokiat/Desktop/shaokiat-blog/config.json | jq -r tostring)" algolia/docsearch-scraper
      },
      metadata: [{ name: "shao kiat", content: "shao kiat, blog" }],
      colorMode: {
        defaultMode: "dark",
      },
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        hideOnScroll: true,
        title: "Shao Kiat",
        logo: {
          alt: "Shao Kiat blog logo",
          src: "img/moon.png",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Study Notes",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://linkedin.com/in/shaokiat",
            position: "right",
            className: "header-linkedin-link",
            "aria-label": "LinkedIn profile",
          },
          {
            href: "https://github.com/shaokiat",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
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
                to: "https://shaokiat.vercel.app",
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
                href: "https://shaokiat.vercel.app/resume.pdf",
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
