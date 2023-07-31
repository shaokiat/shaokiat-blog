"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[987],{2591:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return m}});var a=n(3117),r=n(102),o=(n(7294),n(3905)),i=["components"],s={},l="Heaps",p={unversionedId:"algorithms/heap",id:"algorithms/heap",title:"Heaps",description:"- Task Scheduler",source:"@site/docs/algorithms/heap.mdx",sourceDirName:"algorithms",slug:"/algorithms/heap",permalink:"/shaokiat-blog/docs/algorithms/heap",draft:!1,editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/docs/algorithms/heap.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Greedy",permalink:"/shaokiat-blog/docs/algorithms/greedy"},next:{title:"Linked List",permalink:"/shaokiat-blog/docs/algorithms/linked-list"}},c={},m=[{value:"Task Scheduler",id:"task-scheduler",level:3},{value:"Solution 1: Math Approach",id:"solution-1-math-approach",level:4},{value:"Solution 2: Heap and Queue",id:"solution-2-heap-and-queue",level:4}],u={toc:m};function d(e){var t=e.components,n=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"heaps"},"Heaps"),(0,o.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"common questions")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("ul",{parentName:"div"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/task-scheduler/"},"Task Scheduler"))))),(0,o.kt)("h3",{id:"task-scheduler"},(0,o.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/task-scheduler/"},"Task Scheduler")),(0,o.kt)("div",{className:"admonition admonition-important alert alert--info"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"Source")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/task-scheduler/discussion/comments/1567434"},(0,o.kt)("strong",{parentName:"a"},"Explanation"))," on LeetCode discussions."))),(0,o.kt)("h4",{id:"solution-1-math-approach"},"Solution 1: Math Approach"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Case 1: No idle gaps required - answer is length of tasks"),(0,o.kt)("li",{parentName:"ul"},"Case 2: Idle gaps required - (maxFreq - 1) * (n + 1) + nMax",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"(maxFreq - 1) - maximum occurences of character with maximum occurences except last occurence"),(0,o.kt)("li",{parentName:"ul"},"(n + 1) - number of elements in each repeated interval ",(0,o.kt)("inlineCode",{parentName:"li"},"A _ _")),(0,o.kt)("li",{parentName:"ul"},"nMax - number of characters in last occurence")))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-py"},"def leastInterval(self, tasks, n):\n  store = {}\n  for i in tasks:\n    store = 1 + store.get(i, 0) # default 0 if not found\n  lst = sorted(store.values(), reverse=True)\n  maxFreq = lst[0]\n  nMax = lst.count(maxFreq)\n  caseTwo = (maxFreq - 1) * (n + 1) + nMax\n  return max(len(tasks), caseTwo)\n")),(0,o.kt)("p",null,"Time Complexity: ",(0,o.kt)("inlineCode",{parentName:"p"},"O(n)")," for counting tasks."),(0,o.kt)("p",null,"Space Complexity: ",(0,o.kt)("inlineCode",{parentName:"p"},"O(1)")," for fixed dictionary size of 26 characters."),(0,o.kt)("br",null),(0,o.kt)("h4",{id:"solution-2-heap-and-queue"},"Solution 2: Heap and Queue"),(0,o.kt)("div",{className:"admonition admonition-important alert alert--info"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"Source")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},(0,o.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=s8p8ukTyA2I"},(0,o.kt)("strong",{parentName:"a"},"Explanation"))," by NeetCode."))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-py"},"def leastInterval(self, tasks, n):\n  count = Counter(tasks)\n  maxHeap = [-cnt for cnt in count.values()]\n  heapq.heapify(maxHeap)\n  \n  time = 0 \n  q = deque() # pairs of [-cnt, idleTime]\n  while maxHeap or q:\n    time += 1\n    if maxHeap:\n      cnt = 1 + heapq.heappop(maxHeap)\n      if cnt: # Count not zero: add back to queue with new idleTime\n        q.append([cnt, time + n])\n    if q and q[0][1] == time:\n      heapq.heappush(maxHeap, q.popleft()[0])\n  return time\n")),(0,o.kt)("p",null,"Time Complexity: ",(0,o.kt)("inlineCode",{parentName:"p"},"O(n + m)")," where n is len(tasks) and m is length of idle interval."),(0,o.kt)("p",null,"Space Complexity: ",(0,o.kt)("inlineCode",{parentName:"p"},"O(1)")," for fixed dictionary size of 26 characters."),(0,o.kt)("br",null))}d.isMDXComponent=!0},3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return d}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),p=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=p(n),d=r,h=u["".concat(l,".").concat(d)]||u[d]||m[d]||o;return n?a.createElement(h,i(i({ref:t},c),{},{components:n})):a.createElement(h,i({ref:t},c))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var p=2;p<o;p++)i[p]=n[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);