"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[792],{89:function(e,n,o){o.r(n),o.d(n,{frontMatter:function(){return r},contentTitle:function(){return l},metadata:function(){return d},toc:function(){return u},default:function(){return p}});var t=o(7462),s=o(3366),a=(o(7294),o(3905)),i=["components"],r={sidebar_position:1},l="Manage Docs Versions",d={unversionedId:"tutorial-extras/manage-docs-versions",id:"tutorial-extras/manage-docs-versions",isDocsHomePage:!1,title:"Manage Docs Versions",description:"Docusaurus can manage multiple versions of your docs.",source:"@site/docs/tutorial-extras/manage-docs-versions.md",sourceDirName:"tutorial-extras",slug:"/tutorial-extras/manage-docs-versions",permalink:"/shaokiat-blog/docs/tutorial-extras/manage-docs-versions",editUrl:"https://github.com/facebook/docusaurus/edit/main/website/docs/tutorial-extras/manage-docs-versions.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Congratulations!",permalink:"/shaokiat-blog/docs/tutorial-basics/congratulations"},next:{title:"Translate your site",permalink:"/shaokiat-blog/docs/tutorial-extras/translate-your-site"}},u=[{value:"Create a docs version",id:"create-a-docs-version",children:[],level:2},{value:"Add a Version Dropdown",id:"add-a-version-dropdown",children:[],level:2},{value:"Update an existing version",id:"update-an-existing-version",children:[],level:2}],c={toc:u};function p(e){var n=e.components,r=(0,s.Z)(e,i);return(0,a.kt)("wrapper",(0,t.Z)({},c,r,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"manage-docs-versions"},"Manage Docs Versions"),(0,a.kt)("p",null,"Docusaurus can manage multiple versions of your docs."),(0,a.kt)("h2",{id:"create-a-docs-version"},"Create a docs version"),(0,a.kt)("p",null,"Release a version 1.0 of your project:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"npm run docusaurus docs:version 1.0\n")),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"docs")," folder is copied into ",(0,a.kt)("inlineCode",{parentName:"p"},"versioned_docs/version-1.0")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"versions.json")," is created."),(0,a.kt)("p",null,"Your docs now have 2 versions:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"1.0")," at ",(0,a.kt)("inlineCode",{parentName:"li"},"http://localhost:3000/docs/")," for the version 1.0 docs"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"current")," at ",(0,a.kt)("inlineCode",{parentName:"li"},"http://localhost:3000/docs/next/")," for the ",(0,a.kt)("strong",{parentName:"li"},"upcoming, unreleased docs"))),(0,a.kt)("h2",{id:"add-a-version-dropdown"},"Add a Version Dropdown"),(0,a.kt)("p",null,"To navigate seamlessly across versions, add a version dropdown."),(0,a.kt)("p",null,"Modify the ",(0,a.kt)("inlineCode",{parentName:"p"},"docusaurus.config.js")," file:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="docusaurus.config.js"',title:'"docusaurus.config.js"'},"module.exports = {\n  themeConfig: {\n    navbar: {\n      items: [\n        // highlight-start\n        {\n          type: 'docsVersionDropdown',\n        },\n        // highlight-end\n      ],\n    },\n  },\n};\n")),(0,a.kt)("p",null,"The docs version dropdown appears in your navbar:"),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Docs Version Dropdown",src:o(8730).Z})),(0,a.kt)("h2",{id:"update-an-existing-version"},"Update an existing version"),(0,a.kt)("p",null,"It is possible to edit versioned docs in their respective folder:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"versioned_docs/version-1.0/hello.md")," updates ",(0,a.kt)("inlineCode",{parentName:"li"},"http://localhost:3000/docs/hello")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"docs/hello.md")," updates ",(0,a.kt)("inlineCode",{parentName:"li"},"http://localhost:3000/docs/next/hello"))))}p.isMDXComponent=!0},8730:function(e,n,o){n.Z=o.p+"assets/images/docsVersionDropdown-dda80f009a926fb2dd92bab8faa6c4d8.png"}}]);