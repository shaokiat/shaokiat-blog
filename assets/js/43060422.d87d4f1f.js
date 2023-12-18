"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[2591],{3979:function(e,t,a){a.r(t),a.d(t,{assets:function(){return h},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return r},metadata:function(){return c},toc:function(){return p}});var n=a(3117),i=a(102),o=(a(7294),a(3905)),s=["components"],r={slug:"dating-app-analysis",title:"An Analysis: Swipe Left on BTO-at-35",authors:["shaokiat"],tags:[]},l=void 0,c={permalink:"/shaokiat-blog/blog/dating-app-analysis",editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/blog/2023-08-02-an-analysis-on-dating-apps.mdx",source:"@site/blog/2023-08-02-an-analysis-on-dating-apps.mdx",title:"An Analysis: Swipe Left on BTO-at-35",description:"These observations and views are purely personal experiences and opinions, so do take them lightly. \ud83c\udf1d",date:"2023-08-02T00:00:00.000Z",formattedDate:"August 2, 2023",tags:[],readingTime:4.615,truncated:!1,authors:[{name:"Lim Shao Kiat",title:"Author",url:"https://shaokiat.vercel.app",imageURL:"https://github.com/shaokiat.png",key:"shaokiat"}],frontMatter:{slug:"dating-app-analysis",title:"An Analysis: Swipe Left on BTO-at-35",authors:["shaokiat"],tags:[]},nextItem:{title:"A Refreshing View",permalink:"/shaokiat-blog/blog/view"}},h={authorsImageUrls:[void 0]},p=[{value:"Preamble",id:"preamble",level:2},{value:"Part I: The Game of Swipes",id:"part-i-the-game-of-swipes",level:2},{value:"Why are men getting fewer matches?",id:"why-are-men-getting-fewer-matches",level:3},{value:"What is the result of these?",id:"what-is-the-result-of-these",level:3},{value:"What is my strategy?",id:"what-is-my-strategy",level:3},{value:"Part II: Match Statistics",id:"part-ii-match-statistics",level:2},{value:"Sankey Chart of Dating App Statistics",id:"sankey-chart-of-dating-app-statistics",level:4},{value:"What could be optimized?",id:"what-could-be-optimized",level:3},{value:"Pie Chart of Dating App Statistics",id:"pie-chart-of-dating-app-statistics",level:4},{value:"Limitation",id:"limitation",level:3},{value:"Conclusion",id:"conclusion",level:2}],d={toc:p};function m(e){var t=e.components,a=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,n.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"disclaimer")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"These observations and views are purely personal experiences and opinions, so do take them lightly. \ud83c\udf1d"))),(0,o.kt)("h2",{id:"preamble"},"Preamble"),(0,o.kt)("p",null,"Amidst a whirlwind of wedding invitations and constant discussions about BTO, there is me - the singleton in a symphony of couples.\nBefore my parents start arranging blind dates and marriages, I have decided to venture into the world of digital dating,\nimmersing myself in a dance of swipes, profiles, and digital dialogues."),(0,o.kt)("p",null,"As I embark on my journey as a data scientist, a whimsical thought struck me - why not delve into the depths of my own real-life encounters and subject them to analysis?"),(0,o.kt)("p",null,"And what dataset could be more interesting than my own dating app experience? So for the month of July 2023, I began tracking\nthe statistics of my experience with dating apps in Singapore, as a 25-year-old male navigating the realm of these apps as a free user."),(0,o.kt)("h2",{id:"part-i-the-game-of-swipes"},"Part I: The Game of Swipes"),(0,o.kt)("p",null,"First of all, we should all understand the phenomenon of the dating app scene. I happened to chance upon this fantastic video that explains the situation with such accuracy, using models and assumptions\u2014a language spoken by data scientists and statisticians."),(0,o.kt)("p",null,"Please give the video a watch before continuing, and I will be summarizing the learning points from this video and my observations from it as well."),(0,o.kt)("div",{className:"dating-app-container"},(0,o.kt)("iframe",{height:"100%",width:"90%",src:"https://www.youtube.com/embed/x3lypVnJ0HM",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:!0}),(0,o.kt)("div",null,"Source: Memeable Data on Youtube")),(0,o.kt)("h3",{id:"why-are-men-getting-fewer-matches"},"Why are men getting fewer matches?"),(0,o.kt)("p",null,"The median number of matches for men is skewed by the imbalance of several factors:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Significantly more men than women uses dating apps (Gender imbalance)"),(0,o.kt)("li",{parentName:"ol"},"Men give more likes than women (Engagement bias)"),(0,o.kt)("li",{parentName:"ol"},"A small share of users get a big share of the likes (Engagement imbalance)")),(0,o.kt)("h3",{id:"what-is-the-result-of-these"},"What is the result of these?"),(0,o.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Men")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"As men don't get as many likes, they start giving likes more generously to improve their chances of getting matched."),(0,o.kt)("p",{parentName:"div"},"Studies indicate that dating apps can have a negative impact on self-esteem, with a stronger effect on men."))),(0,o.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"Women")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"Women are overwhelmed with choices, making them think more carefully about who they give likes to, and since guys are so\ngenerous with their likes, there is a good chance he is not even genuinely interested."),(0,o.kt)("p",{parentName:"div"},"Women often have to find strategies to deal with intrusive behavior from men."))),(0,o.kt)("h3",{id:"what-is-my-strategy"},"What is my strategy?"),(0,o.kt)("p",null,"Given my conviction that I do not inhabit the upper echelon of the top 15%, I have instinctively embraced the approach outlined earlier.\nConsequently, my strategy revolves around dedicating extra effort towards crafting an impeccable dating profile and adopting a more\ngenerous stance when giving out likes."),(0,o.kt)("h2",{id:"part-ii-match-statistics"},"Part II: Match Statistics"),(0,o.kt)("p",null,"Below is a Sankey Chart of the statistics for the month of July 2023."),(0,o.kt)("h4",{id:"sankey-chart-of-dating-app-statistics"},"Sankey Chart of Dating App Statistics"),(0,o.kt)("div",{style:{textAlign:"center",display:"flex",justifyContent:"space-evenly"}},(0,o.kt)("img",{src:"/shaokiat-blog/img/blog/sankey-dating-app.png",alt:"sankey chart",width:"800"})),(0,o.kt)("br",null),(0,o.kt)("h3",{id:"what-could-be-optimized"},"What could be optimized?"),(0,o.kt)("p",null,"From the observation of the sankey chart:"),(0,o.kt)("p",null,"Firstly, a significant portion, accounting for 30% of the total matches, did not transition into any form of\nmessaging. Given my proactive role in initiating conversations, this observation suggests the possibility of\nbeing more discerning and deliberate when doling out likes."),(0,o.kt)("p",null,"Secondly, among the matches that did progress to messaging, approximately 27% failed to elicit any response.\nThis statistic sheds light on the potential room for improvement in crafting more compelling opening messages to\nengage and capture the interest of potential matches."),(0,o.kt)("h4",{id:"pie-chart-of-dating-app-statistics"},"Pie Chart of Dating App Statistics"),(0,o.kt)("div",{style:{textAlign:"center",display:"flex",justifyContent:"space-evenly"}},(0,o.kt)("img",{src:"/shaokiat-blog/img/blog/pie-chart.png",alt:"sankey chart",width:"500"})),(0,o.kt)("br",null),(0,o.kt)("p",null,"In terms of statistics, OKC has the worst Match-to-Conversation ratio of only 21.4%. This data point places it at the bottom of the list among\nthe three platforms. Interestingly, this numerical finding aligns seamlessly with my personal experience that I had with the platform\nin terms of user experience and quality of matches."),(0,o.kt)("p",null,"Bumble boasts the most noteworthy Match-to-Conversation ratio due to its distinct approach - requiring women to initiate the conversation within a 24-hour window,\nlest the match expires. This time pressure encourages women to initiate conversations more frequently, resulting in its high Match-to-Conversation ratio."),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},'Although most Bumble matches starts off with only a "Hi", tossing the ball back into my court and requiring me to take the lead in driving\nthe conversation.'))),(0,o.kt)("h3",{id:"limitation"},"Limitation"),(0,o.kt)("p",null,"This chart is limited in information from which to draw conclusions and only offers a big-picture view of the statistics.\nThe chart does not tell me about the quality of the matches on each platform, and there could potentially be a data imbalance present in each app, possibly due to the different demographics of the users."),(0,o.kt)("p",null,"A more detailed approach could be used to include factors such as user feedback, satisfaction ratings, success stories, or user demographics. These additional data points could then provide some insight into the respective dating apps."),(0,o.kt)("h2",{id:"conclusion"},"Conclusion"),(0,o.kt)("p",null,"In conclusion, keeping track of the data from personal experiences is indeed an interesting way to gain insights into my own preferences, patterns, and experiences.\nThis self-reflection can hopefully lead to enhanced decision-making and, ultimately, an increased likelihood of finding a potential partner."),(0,o.kt)("p",null,"This is definitely a good experiment to get me more proactive and mindful about the data that surrounds me in the digital landscape as I\ncontinue to explore and understand the broader implications of data in my life."))}m.isMDXComponent=!0},3905:function(e,t,a){a.d(t,{Zo:function(){return h},kt:function(){return m}});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function r(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var l=n.createContext({}),c=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},h=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,h=r(e,["components","mdxType","originalType","parentName"]),d=c(a),m=i,u=d["".concat(l,".").concat(m)]||d[m]||p[m]||o;return a?n.createElement(u,s(s({ref:t},h),{},{components:a})):n.createElement(u,s({ref:t},h))}));function m(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=a.length,s=new Array(o);s[0]=d;var r={};for(var l in t)hasOwnProperty.call(t,l)&&(r[l]=t[l]);r.originalType=e,r.mdxType="string"==typeof e?e:i,s[1]=r;for(var c=2;c<o;c++)s[c]=a[c];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"}}]);