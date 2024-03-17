"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[7708],{2895:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return s},default:function(){return u},frontMatter:function(){return l},metadata:function(){return c},toc:function(){return p}});var i=n(3117),a=n(102),r=(n(7294),n(3905)),o=["components"],l={},s="Predictive Maintenance",c={unversionedId:"data-science/predictive-maintenance",id:"data-science/predictive-maintenance",title:"Predictive Maintenance",description:"Introduction",source:"@site/docs/data-science/predictive-maintenance.mdx",sourceDirName:"data-science",slug:"/data-science/predictive-maintenance",permalink:"/shaokiat-blog/docs/data-science/predictive-maintenance",draft:!1,editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/docs/data-science/predictive-maintenance.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Trees",permalink:"/shaokiat-blog/docs/algorithms/trees"},next:{title:"Why I Chose Docusaurus",permalink:"/shaokiat-blog/docs/web-dev/docusaurus"}},d={},p=[{value:"Introduction",id:"introduction",level:2},{value:"What is Predictive Maintenance?",id:"what-is-predictive-maintenance",level:3},{value:"Why is it important?",id:"why-is-it-important",level:3},{value:"What is the Outlook for Predictive Maintenance?",id:"what-is-the-outlook-for-predictive-maintenance",level:3},{value:"A Data Scientist Role in Predictive Maintenance",id:"a-data-scientist-role-in-predictive-maintenance",level:2},{value:"Data Collection and Preparation",id:"data-collection-and-preparation",level:3},{value:"Predictive Modelling",id:"predictive-modelling",level:3},{value:"Deployment and Monitoring",id:"deployment-and-monitoring",level:3},{value:"Challenges and Personal Takeaways",id:"challenges-and-personal-takeaways",level:3}],m={toc:p};function u(e){var t=e.components,n=(0,a.Z)(e,o);return(0,r.kt)("wrapper",(0,i.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"predictive-maintenance"},"Predictive Maintenance"),(0,r.kt)("h2",{id:"introduction"},"Introduction"),(0,r.kt)("h3",{id:"what-is-predictive-maintenance"},"What is Predictive Maintenance?"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Predictive maintenance")," is a ",(0,r.kt)("strong",{parentName:"p"},"proactive")," maintenance strategy that employs data and analytics to predict when an equipment is likely to fail,\nallowing repairs or replacements to be scheduled just before the failure happens."),(0,r.kt)("p",null,"This approach contrasts with traditional ",(0,r.kt)("strong",{parentName:"p"},"reactive maintenance"),", where equipment is serviced only after it breaks down, and ",(0,r.kt)("strong",{parentName:"p"},"preventive maintenance"),",\nwhich involves scheduled maintenance tasks regardless of the equipment's actual condition."),(0,r.kt)("div",{align:"center"},(0,r.kt)("img",{src:"/shaokiat-blog/img/pdm/maintenance_comp.jpeg",alt:"maintenance types",width:"500"})),(0,r.kt)("div",{align:"center",width:"700",textAlign:"left",style:{}},"Source:",(0,r.kt)("a",{href:"https://www.assetinfinity.com/blog/reactive-vs-preventive-vs-predictive"}," ","Asset Infinity")),(0,r.kt)("h3",{id:"why-is-it-important"},"Why is it important?"),(0,r.kt)("p",null,"Predictive maintenance is key strategy employed by industries to optimize the performance of their assets and machinery. Here\nare some reasons why predictive maintenance is crucial to the industries:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Cost Savings")),(0,r.kt)("p",{parentName:"li"},"Predictive maintenance allows organization to address potential issues before they lead to equipment failure, allowing for\noptimal scheduling of maintenance during planned downtime, thereby reducing downtime cost.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Optimizes Equipment Utilization ")),(0,r.kt)("p",{parentName:"li"},"By addressing problems proactively during planned maintenance windows, organization can ensure that equipment remains operational\nfor more extended periods. Additionally, with continuous monitoring of equipment health through sensors, organizations can also ensure\nthat assets are operating at their optimal performance levels, maximizing utilization.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Extends Equipment Lifespan")),(0,r.kt)("p",{parentName:"li"},"Instead of following a fixed schedule, predictive maintenance relies on the actual condition of equipment to determine when a\nmaintenance is necessary. This condition-based approach, optimizes maintenance intervals, and preserves critical components,\ntherefore ensures the overall longevity and reliability of the entire system."))),(0,r.kt)("h3",{id:"what-is-the-outlook-for-predictive-maintenance"},"What is the Outlook for Predictive Maintenance?"),(0,r.kt)("p",null,"According to the Predictive Maintenance and Asset Performance Market Report 2023-2028,\nthe global predictive maintenance market stands at ",(0,r.kt)("strong",{parentName:"p"},"$5.5 billion")," in 2022, with an estimated CAGR of 17% until 2028.\nThis indicates a strong anticipated growth in the predictive maintenance market, suggesting that more industries are\nrecognizing its benefits."),(0,r.kt)("p",null,"The adoption of predictive maintenance aligns closely with the principles of the Fourth Industrial Revolution, often referred\nto as Industry 4.0."),(0,r.kt)("div",{className:"admonition admonition-important alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"Industry 4.0")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},(0,r.kt)("a",{parentName:"p",href:"https://www.mckinsey.com/featured-insights/mckinsey-explainers/what-are-industry-4-0-the-fourth-industrial-revolution-and-4ir"},(0,r.kt)("strong",{parentName:"a"},"Industry4.0")),"\nis defined as the integration of intelligent digital technologies, data analytics and automation into manufacturing and industrial processes.\nSome Industry4.0 technologies used in Predictive Maintenance includes:"),(0,r.kt)("ul",{parentName:"div"},(0,r.kt)("li",{parentName:"ul"},"Industrial Internet of Things (IIOT)"),(0,r.kt)("li",{parentName:"ul"},"Machine Learning"),(0,r.kt)("li",{parentName:"ul"},"Cloud Automation")))),(0,r.kt)("div",{align:"center"},(0,r.kt)("img",{src:"/shaokiat-blog/img/pdm/market_snapshot.png",alt:"Market Snapshot",width:"700"})),(0,r.kt)("div",{align:"center",width:"700",textAlign:"left",style:{}},"Source:",(0,r.kt)("a",{href:"https://iot-analytics.com/predictive-maintenance-market/"}," ","IOT Analytics")),(0,r.kt)("br",null),(0,r.kt)("h2",{id:"a-data-scientist-role-in-predictive-maintenance"},"A Data Scientist Role in Predictive Maintenance"),(0,r.kt)("h3",{id:"data-collection-and-preparation"},"Data Collection and Preparation"),(0,r.kt)("h3",{id:"predictive-modelling"},"Predictive Modelling"),(0,r.kt)("h3",{id:"deployment-and-monitoring"},"Deployment and Monitoring"),(0,r.kt)("h3",{id:"challenges-and-personal-takeaways"},"Challenges and Personal Takeaways"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"How to perform Predictive Maintenance"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"Data Collection and Preparation"),(0,r.kt)("li",{parentName:"ul"},"Predictive Modelling",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"Statistical Modelling"),(0,r.kt)("li",{parentName:"ul"},"Machine Learning"),(0,r.kt)("li",{parentName:"ul"},"Time Series Analysis"))),(0,r.kt)("li",{parentName:"ul"},"Deployment and Monitoring"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Challenges and Personal Takeaways"))))}u.isMDXComponent=!0},3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return u}});var i=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=i.createContext({}),c=function(e){var t=i.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=c(e.components);return i.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},m=i.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),m=c(n),u=a,h=m["".concat(s,".").concat(u)]||m[u]||p[u]||r;return n?i.createElement(h,o(o({ref:t},d),{},{components:n})):i.createElement(h,o({ref:t},d))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,o=new Array(r);o[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var c=2;c<r;c++)o[c]=n[c];return i.createElement.apply(null,o)}return i.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);