"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[3252],{1345:function(e,t,a){a.r(t),a.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return u},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return h}});var n=a(3117),i=a(102),o=(a(7294),a(3905)),r=["components"],s={slug:"dating-app-analysis",title:"An Analysis on My Dating App Experience",authors:["shaokiat"],tags:[]},l=void 0,c={permalink:"/shaokiat-blog/blog/dating-app-analysis",editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/blog/2023-07-29-an-analysis-on-dating-apps.mdx",source:"@site/blog/2023-07-29-an-analysis-on-dating-apps.mdx",title:"An Analysis on My Dating App Experience",description:"These observations and views are purely personal opinions and should be taken with a light heart \ud83c\udf1d",date:"2023-07-29T00:00:00.000Z",formattedDate:"July 29, 2023",tags:[],readingTime:3.435,truncated:!1,authors:[{name:"Lim Shao Kiat",title:"Author",url:"https://www.shaokiat.xyz",imageURL:"https://github.com/shaokiat.png",key:"shaokiat"}],frontMatter:{slug:"dating-app-analysis",title:"An Analysis on My Dating App Experience",authors:["shaokiat"],tags:[]},nextItem:{title:"A Refreshing View",permalink:"/shaokiat-blog/blog/view"}},p={authorsImageUrls:[void 0]},h=[{value:"Preamble",id:"preamble",level:2},{value:"Part I: The Game of Swipes",id:"part-i-the-game-of-swipes",level:2},{value:"Why are men getting fewer matches?",id:"why-are-men-getting-fewer-matches",level:3},{value:"What is a result of these?",id:"what-is-a-result-of-these",level:3},{value:"What My Strategy?",id:"what-my-strategy",level:3},{value:"Part II: Matches Statistics",id:"part-ii-matches-statistics",level:2},{value:"Sankey Chart of Dating App Statistics",id:"sankey-chart-of-dating-app-statistics",level:4},{value:"What could be optimised?",id:"what-could-be-optimised",level:3},{value:"Limitations",id:"limitations",level:3},{value:"Conclusion",id:"conclusion",level:2}],d={toc:h};function u(e){var t=e.components,a=(0,i.Z)(e,r);return(0,o.kt)("wrapper",(0,n.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"disclaimer")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"These observations and views are purely personal opinions and should be taken with a light heart \ud83c\udf1d"))),(0,o.kt)("h2",{id:"preamble"},"Preamble"),(0,o.kt)("p",null,"As I begin my work as a data scientist, I thought why not try to analyze some data from my own real-world experiences.\nAnd what dataset could be more interesting than my own dating app experience? So for the month of July 2023, I began tracking\nthe statistics of my experience with dating apps in Singapore as a 25 years old male and as a free-user."),(0,o.kt)("h2",{id:"part-i-the-game-of-swipes"},"Part I: The Game of Swipes"),(0,o.kt)("p",null,"First of all, we should all understand the phenomenon in the dating apps scene. I happen to chance upon this fantastic video\nthat explains the situation with such accuracy, using models and assumptions - a language spoken by data scientists and statisticians."),(0,o.kt)("p",null,"Please give the video a watch before continuing and I will be summarizing the learning points from this video and base of my\nobservations from it as well."),(0,o.kt)("div",{className:"dating-app-container"},(0,o.kt)("iframe",{height:"100%",width:"90%",src:"https://www.youtube.com/embed/x3lypVnJ0HM",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:!0}),(0,o.kt)("div",null,"Source: Memeable Data on Youtube")),(0,o.kt)("h3",{id:"why-are-men-getting-fewer-matches"},"Why are men getting fewer matches?"),(0,o.kt)("p",null,"The median number of matches for men is skewed by the imbalance of several factors:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Significantly more men than women uses dating apps (Gender imbalance)"),(0,o.kt)("li",{parentName:"ol"},"Men give more likes than women (Engagement bias)"),(0,o.kt)("li",{parentName:"ol"},"A small share of users get a big share of the likes (Engagement imbalance)")),(0,o.kt)("h3",{id:"what-is-a-result-of-these"},"What is a result of these?"),(0,o.kt)("p",null,"Men:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"As men don't get as much likes, they start giving likes more generously to improve their chances of getting matched."),(0,o.kt)("li",{parentName:"ul"},"Studies indicated that dating apps can have a negative impact on self-esteem, with a stronger effect on men.")),(0,o.kt)("p",null,"Women:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Women are overwhelmed with choices, making them think more carefully about who they give likes to, and since guys are so\ngenerous with their likes, there is a good chance he is not even genuinely interested."),(0,o.kt)("li",{parentName:"ul"},"Women often have to find strategies to deal with intrusive behavior from men.")),(0,o.kt)("h3",{id:"what-my-strategy"},"What My Strategy?"),(0,o.kt)("p",null,"As I believe I do not belong in the top 15%, I naturally applied the strategy as mentioned above. And this means that in\norder to acquire more matches, I need to invest additional time in optimizing a good dating profile, and be more generous with my likes."),(0,o.kt)("h2",{id:"part-ii-matches-statistics"},"Part II: Matches Statistics"),(0,o.kt)("p",null,"Below is a Sankey Chart of the statistics for the month of July 2023."),(0,o.kt)("h4",{id:"sankey-chart-of-dating-app-statistics"},"Sankey Chart of Dating App Statistics"),(0,o.kt)("div",{style:{textAlign:"center",display:"flex",justifyContent:"space-evenly"}},(0,o.kt)("img",{src:"/shaokiat-blog/img/blog/sankey-dating-app.png",alt:"sankey chart",width:"800"})),(0,o.kt)("br",null),(0,o.kt)("h3",{id:"what-could-be-optimised"},"What could be optimised?"),(0,o.kt)("p",null,"From the observation of the chart,"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"30% of matches did not end up with any messages at all. And since I have to start the conversations the majority of the\ntime, perhaps I could be more careful and less generous with my likes."),(0,o.kt)("li",{parentName:"ul"},"27% of matches that did have messages, never replied, possibly indicating that I should look into working on my opening message.")),(0,o.kt)("h3",{id:"limitations"},"Limitations"),(0,o.kt)("p",null,"This chart is limited in information to draw conclusions from, and only offers a big picture view of the statistics.\nThe chart does not tell me about the quality of the matches from each platform and there could potentially be data imbalance\npresent in each app, possibly due to different the demographic of the users."),(0,o.kt)("p",null,"A more detailed approach could be used to include factors such as user feedback,\nsatisfaction ratings, success stories, or user demographics. These additional data could then provide some insights into each\nthe respective dating apps."),(0,o.kt)("h2",{id:"conclusion"},"Conclusion"),(0,o.kt)("p",null,"In conclusion, keeping track of the data from personal experiences is indeed an interesting way to gain insights into my own preferences,\npatterns and experiences. This self-reflection can hopefully lead to enhanced decision making, and ultimately an increased\nlikelihood of finding a potential partner."),(0,o.kt)("p",null,"This is definitely a good experiment to get me more proactive and mindful about the data that surrounds me in the digital landscape\nas I continue to explore and understand the broader implications of data in my life."))}u.isMDXComponent=!0},3905:function(e,t,a){a.d(t,{Zo:function(){return p},kt:function(){return u}});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function r(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var l=n.createContext({}),c=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):r(r({},t),e)),a},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},h={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(a),u=i,m=d["".concat(l,".").concat(u)]||d[u]||h[u]||o;return a?n.createElement(m,r(r({ref:t},p),{},{components:a})):n.createElement(m,r({ref:t},p))}));function u(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=a.length,r=new Array(o);r[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,r[1]=s;for(var c=2;c<o;c++)r[c]=a[c];return n.createElement.apply(null,r)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"}}]);