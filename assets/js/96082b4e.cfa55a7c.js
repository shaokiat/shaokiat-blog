"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[867],{1769:function(i,t,e){e.r(t),e.d(t,{frontMatter:function(){return s},contentTitle:function(){return d},metadata:function(){return l},toc:function(){return c},default:function(){return m}});var a=e(7462),n=e(3366),r=(e(7294),e(3905)),o=["components"],s={sidebar_position:1},d="Binary Search",l={unversionedId:"algorithms/binary-search",id:"algorithms/binary-search",isDocsHomePage:!1,title:"Binary Search",description:"Inspired by https://labuladong.gitbook.io/algo-en/iii.-algorithmic-thinking/detailedbinarysearch",source:"@site/docs/algorithms/binary-search.mdx",sourceDirName:"algorithms",slug:"/algorithms/binary-search",permalink:"/shaokiat-blog/docs/algorithms/binary-search",editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/docs/algorithms/binary-search.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Introduction",permalink:"/shaokiat-blog/docs/intro"},next:{title:"Dynamic Programming (Top Down)",permalink:"/shaokiat-blog/docs/algorithms/dynamic-programming-top-down"}},c=[{value:"Iterative Binary Search",id:"iterative-binary-search",children:[],level:3},{value:"Find Left Border",id:"find-left-border",children:[],level:3}],h={toc:c};function m(i){var t=i.components,e=(0,n.Z)(i,o);return(0,r.kt)("wrapper",(0,a.Z)({},h,e,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"binary-search"},"Binary Search"),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"TIP ")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Inspired by ",(0,r.kt)("a",{parentName:"p",href:"https://labuladong.gitbook.io/algo-en/iii.-algorithmic-thinking/detailedbinarysearch"},"https://labuladong.gitbook.io/algo-en/iii.-algorithmic-thinking/detailedbinarysearch")))),(0,r.kt)("h3",{id:"iterative-binary-search"},"Iterative Binary Search"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def binarySearch(nums, target):\n    left, right = 0, len(nums)-1\n\n    while left <= right: # Search interval = [left, right]\n        mid = (left + right) // 2\n\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target: # recurse right -> [mid+1, right]\n            left = mid + 1\n        elif nums[mid] > target: # recurse left -> [left, mid-1]\n            right = mid - 1\n    \n    # Target not found -> return -1\n    return -1\n")),(0,r.kt)("h3",{id:"find-left-border"},"Find Left Border"))}m.isMDXComponent=!0}}]);