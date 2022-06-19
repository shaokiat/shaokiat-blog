"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[958],{4377:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return c},default:function(){return k},frontMatter:function(){return s},metadata:function(){return l},toc:function(){return u}});var r=n(3117),a=n(102),o=(n(7294),n(3905)),i=["components"],s={},c="Recursion and Backtracking",l={unversionedId:"algorithms/recursion",id:"algorithms/recursion",title:"Recursion and Backtracking",description:"Subsets",source:"@site/docs/algorithms/recursion.mdx",sourceDirName:"algorithms",slug:"/algorithms/recursion",permalink:"/shaokiat-blog/docs/algorithms/recursion",draft:!1,editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/docs/algorithms/recursion.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"LRU Cache",permalink:"/shaokiat-blog/docs/algorithms/lru-cache"},next:{title:"Why I Chose Docusaurus",permalink:"/shaokiat-blog/docs/web-dev/docusaurus"}},p={},u=[{value:"Example Solutions",id:"example-solutions",level:2},{value:"Combinations",id:"combinations",level:3},{value:"Solution: Backtracking",id:"solution-backtracking",level:4},{value:"Permutations",id:"permutations",level:3},{value:"Solution: Backtracking",id:"solution-backtracking-1",level:4},{value:"Subsets II",id:"subsets-ii",level:3},{value:"Solution: Backtracking",id:"solution-backtracking-2",level:4}],m={toc:u};function k(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"recursion-and-backtracking"},"Recursion and Backtracking"),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"Common Questions")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/subsets/"},"Subsets")," ",(0,o.kt)("br",null),"\n",(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/combinations/"},"Combinations")," ",(0,o.kt)("br",null),"\n",(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/permutations/"},"Permutation")," ",(0,o.kt)("br",null),"\n",(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/n-queens/"},"N Queen Problem")," ",(0,o.kt)("br",null)))),(0,o.kt)("p",null,"Backtracking Template from ",(0,o.kt)("a",{parentName:"p",href:"https://labuladong.gitbook.io/algo-en/iii.-algorithmic-thinking/subset_permutation_combination"},"labuladong")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-py"},"def backtrack(nums, start, track):\n    # End condition\n    if (end condition):\n        result.add(track)\n        return\n    for i in nums[start:]:\n        track.append(i)\n        backtrack(nums, i+1, track)\n        track.pop()\n")),(0,o.kt)("p",null,"Time Complexity: ",(0,o.kt)("inlineCode",{parentName:"p"},"O(N!)"),"."),(0,o.kt)("p",null,"Space Complexity: ",(0,o.kt)("inlineCode",{parentName:"p"},"O(n)"),"."),(0,o.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"For more details on time and space complexity, read this post: ",(0,o.kt)("a",{parentName:"p",href:"https://stackoverflow.com/questions/65526515/how-to-identify-time-and-space-complexity-of-recursive-backtracking-algorithms-w"},"https://stackoverflow.com/questions/65526515/how-to-identify-time-and-space-complexity-of-recursive-backtracking-algorithms-w")))),(0,o.kt)("h2",{id:"example-solutions"},"Example Solutions"),(0,o.kt)("h3",{id:"combinations"},(0,o.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/combinations/"},"Combinations")),(0,o.kt)("h4",{id:"solution-backtracking"},"Solution: Backtracking"),(0,o.kt)("div",{style:{textAlign:"center"}},(0,o.kt)("img",{src:"/shaokiat-blog/img/algo/combinations.png",alt:"combinations",width:"700"})),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-py"},"def combine(self, n, k):\n    res = []\n    self.backtrack(n, k, 1, res)\n    return res\n\ndef backtrack(self, n, k, start, track, res):\n    if len(track) == k:\n        res.append(track)\n        return\n    for i in range(start, n+1): # Order matters, increasing\n        track.append(i)\n        self.backtrack(n, k, i + 1, track, res)\n        track.pop()\n")),(0,o.kt)("h3",{id:"permutations"},(0,o.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/permutations/"},"Permutations")),(0,o.kt)("h4",{id:"solution-backtracking-1"},"Solution: Backtracking"),(0,o.kt)("div",{style:{textAlign:"center"}},(0,o.kt)("img",{src:"/shaokiat-blog/img/algo/permutations.png",alt:"permutations",width:"700"})),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-py"},"def permute(self, nums):\n    res = []\n    self.backtrack(nums, [], res)\n    return res\n\ndef backtrack(self, nums, track, res):\n    if len(track) == len(nums):\n        res.append(track)\n        return\n    for i in nums: # Order does not matter so we loop through entire array\n        if i in track: # Exclude numbers already in track\n            continue\n        track.append(i)\n        self.backtrack(nums, track, res)\n        track.pop()\n")),(0,o.kt)("h3",{id:"subsets-ii"},(0,o.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/subsets-ii/"},"Subsets II")),(0,o.kt)("h4",{id:"solution-backtracking-2"},"Solution: Backtracking"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-py"},"def subsetsWithDup(nums):\n    res = []\n    nums.sort() # Sort to get power of set\n    self.backtrack(nums)\n\ndef backtrack(nums, start, track, res):\n    res.append(track)\n    for i in range(start, len(nums)):\n        if i > start and nums[i] == nums[i-1]: # IMPT: Skips over duplicate subsets\n            continue\n        track.append(nums[i])\n        self.backtrack(nums, i + 1, track, res)\n        track.pop()\n")))}k.isMDXComponent=!0},3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return k}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=l(n),k=a,d=m["".concat(c,".").concat(k)]||m[k]||u[k]||o;return n?r.createElement(d,i(i({ref:t},p),{},{components:n})):r.createElement(d,i({ref:t},p))}));function k(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var l=2;l<o;l++)i[l]=n[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);