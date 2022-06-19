"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[207],{7102:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return p},default:function(){return u},frontMatter:function(){return l},metadata:function(){return m},toc:function(){return c}});var a=n(3117),o=n(102),r=(n(7294),n(3905)),i=["components"],l={},p="Dynamic Programming (Top Down)",m={unversionedId:"algorithms/dynamic-programming-top-down",id:"algorithms/dynamic-programming-top-down",title:"Dynamic Programming (Top Down)",description:"Dynamic programming has been my nemesis for awhile now and it is about time I tackle dynamic programming",source:"@site/docs/algorithms/dynamic-programming-top-down.mdx",sourceDirName:"algorithms",slug:"/algorithms/dynamic-programming-top-down",permalink:"/shaokiat-blog/docs/algorithms/dynamic-programming-top-down",draft:!1,editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/docs/algorithms/dynamic-programming-top-down.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Binary Search",permalink:"/shaokiat-blog/docs/algorithms/binary-search"},next:{title:"Graphs",permalink:"/shaokiat-blog/docs/algorithms/graph"}},s={},c=[{value:"What is Dynamic Programming",id:"what-is-dynamic-programming",level:3},{value:"Top Down Approach",id:"top-down-approach",level:3},{value:"Example 1: Road Trip",id:"example-1-road-trip",level:2},{value:"Recurrence Relation",id:"recurrence-relation",level:3},{value:"Approach",id:"approach",level:3},{value:"Solution",id:"solution",level:3},{value:"Example 2: House Robber",id:"example-2-house-robber",level:2},{value:"Recurrence Relation",id:"recurrence-relation-1",level:3},{value:"Solution",id:"solution-1",level:3}],d={toc:c};function u(e){var t=e.components,n=(0,o.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"dynamic-programming-top-down"},"Dynamic Programming (Top Down)"),(0,r.kt)("p",null,"Dynamic programming has been my nemesis for awhile now and it is about time I tackle dynamic programming\nusing the same approach for dynamic programming."),(0,r.kt)("h3",{id:"what-is-dynamic-programming"},"What is Dynamic Programming"),(0,r.kt)("p",null,"Find out all possible solutions, then pick out best solution."),(0,r.kt)("p",null,"Recursive in nature."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Principle of Optimality:")," A problem can be solved by taking a sequence of decisions to get the optimal solution."),(0,r.kt)("h3",{id:"top-down-approach"},"Top Down Approach"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Identify ",(0,r.kt)("strong",{parentName:"li"},"recurrence relation")),(0,r.kt)("li",{parentName:"ol"},"Recursive solution (top-down)"),(0,r.kt)("li",{parentName:"ol"},"Recursive + Memoization (top-down)"),(0,r.kt)("li",{parentName:"ol"},"Iterative + Memoization (bottom-up)"),(0,r.kt)("li",{parentName:"ol"},"Iterative + N variables (bottom-up)")),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"TIP")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Fantastic ",(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=5dRGRueKU3M"},"explanation")," by ",(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/channel/UCZCFT11CWBi3MHNlGf019nw"},"Abdul Bari"),"\non Top Down Approach using Fibonacci example."))),(0,r.kt)("h2",{id:"example-1-road-trip"},"Example 1: Road Trip"),(0,r.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"Context")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Below is a question I had encountered during one of the technical assessment that ",(0,r.kt)("em",{parentName:"p"},"tripped")," me."))),(0,r.kt)("p",null,"You are going on a road trip. You are going to get in your trusty car and drive to Panglossia, where\nyou will spend a nice vacation by the beach. Your car holds C litre of petrol and gets ",(0,r.kt)("em",{parentName:"p"},"m")," km per litre. You are handed a list of the n petrol stations\nare on the road and the price they sell petrol."),(0,r.kt)("p",null,"Let distance","[i]"," be the distance of the i-th gas station from Start, let cost","[i]"," be the cost of petrol per litre\nat the i-th station. Furthermore, you can assume that for any two stations i and j, the distance |distance","[i]"," - distance","[j]","|\nbetween them is divisible by ",(0,r.kt)("em",{parentName:"p"},"m"),". You start out with an empty tank at station 1. Your final destination is station ",(0,r.kt)("em",{parentName:"p"},"n"),"."),(0,r.kt)("div",{className:"admonition admonition-important alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"Hint")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Hardest part is identifying the recurrence relation"))),(0,r.kt)("h3",{id:"recurrence-relation"},"Recurrence Relation"),(0,r.kt)("div",{style:{textAlign:"center"}},(0,r.kt)("img",{src:"/shaokiat-blog/img/algo/dp-road-trip.png",alt:"roadtrip",width:"600"})),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"for each possible i: C(station j, k) = C(station j+1, k - d + i) + cost(station j) * i\n\nC(station j, k): minimum cost to reach destination from station j, with k litre in tank\nk: k litre of fuel\nd: distance from station j to station j+1\ni: amount of fuel topped up\n\n")),(0,r.kt)("h3",{id:"approach"},"Approach"),(0,r.kt)("p",null,"You can observe that if you have already solved the problem for all j' > j, then it is not hard\nto compute ",(0,r.kt)("em",{parentName:"p"},"C(station j, k)"),"."),(0,r.kt)("p",null,"If you start with ",(0,r.kt)("em",{parentName:"p"},"k")," litres and it is ",(0,r.kt)("em",{parentName:"p"},"d")," km from the next station, then for all ",(0,r.kt)("em",{parentName:"p"},"i"),",\nlookup the already computed ",(0,r.kt)("em",{parentName:"p"},"C(station j+1, k - d + i)"),", which tells you the minimum cost for\narriving at station ",(0,r.kt)("em",{parentName:"p"},"j+1")," with ",(0,r.kt)("em",{parentName:"p"},"k - d + i")," litres of petrol. Add this cost per litre at station j times ",(0,r.kt)("em",{parentName:"p"},"i"),",\nand choose the ",(0,r.kt)("em",{parentName:"p"},"i")," that is the cheapest."),(0,r.kt)("p",null,"Work in reverse until you get to the first station, and you will eventually find the cheapest way\nto reach destination."),(0,r.kt)("h3",{id:"solution"},"Solution"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def minimumCost(distance, n, C, cost, m):\n  dp = [[0 for i in range(C)] for j in range(n)]\n  for j in range(n - 2, -1, -1): # Traverse all stations in reverse\n    for k in range(C): # How much fuel in tank starting from station j\n      d_next = (distance[j+1] - distance[j]) // m\n      min_ = float('inf')\n      for i in range(C-k): # How much fuel topped up\n        if k + i >= d_next:\n          min_ = min(min_, dp[j+1][k - d_next + i] + cost[j] * i)\n      dp[j][k] = min_\n  print(dp)\n  return (dp[0][0])\n\nC = 10 # Capacity of petrol; starts with 0\nn = 3\ncost = [10,1,1]\nd = [0, 20, 100] # distance of ith station from start\nm = 10 # km/litre\n\nminimumCost(d, n, C, cost, m)\n")),(0,r.kt)("h2",{id:"example-2-house-robber"},"Example 2: ",(0,r.kt)("a",{parentName:"h2",href:"https://leetcode.com/problems/house-robber/"},"House Robber")),(0,r.kt)("h3",{id:"recurrence-relation-1"},"Recurrence Relation"),(0,r.kt)("p",null,"Robber has 2 options: (Knap-sack problems)"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Rob current house"),(0,r.kt)("li",{parentName:"ul"},"Don't rob current house")),(0,r.kt)("p",null,"Robber has to maximize profits using these 2 scenarios:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Rob current house + loot from houses before the previous"),(0,r.kt)("li",{parentName:"ul"},"Loot from the previous house and those before that")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"rob(i) = max(rob(i - 2) + i, rob(i - 1))\n")),(0,r.kt)("h3",{id:"solution-1"},"Solution"),(0,r.kt)("p",null,"Let ",(0,r.kt)("inlineCode",{parentName:"p"},"rob1 = i - 2")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"rob2 = i - 1"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"# [rob1, rob2, i, i+1, ...]\n\ndef rob(nums):\n  rob1 = rob2 = 0\n  for i in nums:\n    temp = max(rob1 + i, rob2)\n    # Shift rob variable forward\n    rob1 = rob2\n    rob2 = temp\n  return rob2\n")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Space Complexity"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"O(1)")," as there are always only 2 variables (rob1, rob2) used."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Time Complexity"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")," as there is only one loop through the nums array."))}u.isMDXComponent=!0},3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return u}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=a.createContext({}),m=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=m(e.components);return a.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,p=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),d=m(n),u=o,h=d["".concat(p,".").concat(u)]||d[u]||c[u]||r;return n?a.createElement(h,i(i({ref:t},s),{},{components:n})):a.createElement(h,i({ref:t},s))}));function u(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=d;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var m=2;m<r;m++)i[m]=n[m];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);