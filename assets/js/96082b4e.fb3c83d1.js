"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[867],{1769:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return d},toc:function(){return m},default:function(){return p}});var a=n(7462),i=n(3366),r=(n(7294),n(3905)),o=["components"],l={},s="Binary Search",d={unversionedId:"algorithms/binary-search",id:"algorithms/binary-search",isDocsHomePage:!1,title:"Binary Search",description:"Inspired by https://labuladong.gitbook.io/algo-en/iii.-algorithmic-thinking/detailedbinarysearch",source:"@site/docs/algorithms/binary-search.mdx",sourceDirName:"algorithms",slug:"/algorithms/binary-search",permalink:"/shaokiat-blog/docs/algorithms/binary-search",editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/docs/algorithms/binary-search.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Introduction",permalink:"/shaokiat-blog/docs/intro"},next:{title:"Dynamic Programming (Top Down)",permalink:"/shaokiat-blog/docs/algorithms/dynamic-programming-top-down"}},m=[{value:"Iterative Binary Search",id:"iterative-binary-search",children:[{value:"Search Interval",id:"search-interval",children:[],level:3}],level:2},{value:"Find Left Border",id:"find-left-border",children:[],level:2}],h={toc:m};function p(e){var t=e.components,n=(0,i.Z)(e,o);return(0,r.kt)("wrapper",(0,a.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"binary-search"},"Binary Search"),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"TIP")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Inspired by ",(0,r.kt)("a",{parentName:"p",href:"https://labuladong.gitbook.io/algo-en/iii.-algorithmic-thinking/detailedbinarysearch"},"https://labuladong.gitbook.io/algo-en/iii.-algorithmic-thinking/detailedbinarysearch")))),(0,r.kt)("h2",{id:"iterative-binary-search"},"Iterative Binary Search"),(0,r.kt)("p",null,"This is the common binary search where a sorted array ",(0,r.kt)("inlineCode",{parentName:"p"},"nums")," is given and we are tasked to find ",(0,r.kt)("inlineCode",{parentName:"p"},"target")," in that array. ",(0,r.kt)("br",null),"\nReturns the ",(0,r.kt)("inlineCode",{parentName:"p"},"index")," of the target if it exist in the array, else returns ",(0,r.kt)("inlineCode",{parentName:"p"},"-1"),"."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Time Complexity"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"O(logn)")," ",(0,r.kt)("br",null),"\n",(0,r.kt)("strong",{parentName:"p"},"Space Complexity"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"O(1)")," ",(0,r.kt)("br",null),"\nTime complexity is O(logn) as the search range is halved every iteration until target is found. The iterative approach will\ngive a O(1) space complexity."),(0,r.kt)("div",{className:"admonition admonition-important alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"Binary Search")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Recurrerence Relation: ",(0,r.kt)("inlineCode",{parentName:"p"},"T(N) = T(N/2) + O(1)")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def binarySearch(nums, target):\n    left, right = 0, len(nums)-1\n    while left <= right: # Search interval = [left, right]\n        mid = (left + right) // 2\n        if nums[mid] == target: # target found! Return index\n            return mid\n        elif nums[mid] < target: # recurse right -> [mid+1, right]\n            left = mid + 1\n        elif nums[mid] > target: # recurse left -> [left, mid-1]\n            right = mid - 1\n    # Target not found -> return -1\n    return -1\n")),(0,r.kt)("h3",{id:"search-interval"},"Search Interval"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"while left <= right:...\n")),(0,r.kt)("p",null,"This gives us a closed interval of ",(0,r.kt)("inlineCode",{parentName:"p"},"[left, right]")," to search from where both the left and right boundaries are included. This\nalso means that our initial ",(0,r.kt)("inlineCode",{parentName:"p"},"right")," boundary would have to be ",(0,r.kt)("inlineCode",{parentName:"p"},"len(arr) - 1"),"."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Case 1:")," ",(0,r.kt)("inlineCode",{parentName:"p"},"nums[mid] < target"),(0,r.kt)("br",null),"\nTarget lies on the right side of ",(0,r.kt)("inlineCode",{parentName:"p"},"mid")," and we would have to set our search interval\nto ",(0,r.kt)("inlineCode",{parentName:"p"},"[mid + 1, right]"),". To do so, we have to set our left interval to ",(0,r.kt)("inlineCode",{parentName:"p"},"mid + 1"),"."),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Case 2:")," ",(0,r.kt)("inlineCode",{parentName:"p"},"nums[mid] > target")," ",(0,r.kt)("br",null),"\nTarget lies on the left side of ",(0,r.kt)("inlineCode",{parentName:"p"},"mid")," and we would have to set our search interval to ",(0,r.kt)("inlineCode",{parentName:"p"},"[left, mid - 1]"),". To do so,\nwe have to set our right interval to ",(0,r.kt)("inlineCode",{parentName:"p"},"mid - 1"),"."),(0,r.kt)("p",null,"The terminating condition for this while loop would be when ",(0,r.kt)("inlineCode",{parentName:"p"},"left > right"),"."),(0,r.kt)("h2",{id:"find-left-border"},"Find Left Border"))}p.isMDXComponent=!0}}]);