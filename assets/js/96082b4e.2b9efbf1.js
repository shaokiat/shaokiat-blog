"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[7867],{1524:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return d},default:function(){return c},frontMatter:function(){return l},metadata:function(){return s},toc:function(){return p}});var r=n(3117),i=n(102),a=(n(7294),n(3905)),o=["components"],l={},d="Binary Search",s={unversionedId:"algorithms/binary-search",id:"algorithms/binary-search",title:"Binary Search",description:"Inspired by https://labuladong.gitbook.io/algo-en/iii.-algorithmic-thinking/detailedbinarysearch",source:"@site/docs/algorithms/binary-search.mdx",sourceDirName:"algorithms",slug:"/algorithms/binary-search",permalink:"/shaokiat-blog/docs/algorithms/binary-search",draft:!1,editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/docs/algorithms/binary-search.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Binary Search Trees (BST)",permalink:"/shaokiat-blog/docs/algorithms/binary-search-trees"},next:{title:"Dynamic Programming",permalink:"/shaokiat-blog/docs/algorithms/dynamic-programming"}},m={},p=[{value:"Iterative Binary Search",id:"iterative-binary-search",level:2},{value:"Search Interval",id:"search-interval",level:3},{value:"Find Left Border",id:"find-left-border",level:2},{value:"Find Right Border",id:"find-right-border",level:2},{value:"Search In Rotated Sorted Array",id:"search-in-rotated-sorted-array",level:3},{value:"Solution:",id:"solution",level:4}],h={toc:p};function c(e){var t=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"binary-search"},"Binary Search"),(0,a.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"TIP")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"Inspired by ",(0,a.kt)("a",{parentName:"p",href:"https://labuladong.gitbook.io/algo-en/iii.-algorithmic-thinking/detailedbinarysearch"},"https://labuladong.gitbook.io/algo-en/iii.-algorithmic-thinking/detailedbinarysearch")))),(0,a.kt)("h2",{id:"iterative-binary-search"},"Iterative Binary Search"),(0,a.kt)("p",null,"This is the common binary search where a sorted array ",(0,a.kt)("inlineCode",{parentName:"p"},"nums")," is given and we are tasked to find ",(0,a.kt)("inlineCode",{parentName:"p"},"target")," in that array. ",(0,a.kt)("br",null),"\nReturns the ",(0,a.kt)("inlineCode",{parentName:"p"},"index")," of the target if it exist in the array, else returns ",(0,a.kt)("inlineCode",{parentName:"p"},"-1"),"."),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Time Complexity"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"O(logn)")," ",(0,a.kt)("br",null),"\n",(0,a.kt)("strong",{parentName:"p"},"Space Complexity"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"O(1)")," ",(0,a.kt)("br",null),"\nTime complexity is O(logn) as the search range is halved every iteration until target is found. The iterative approach will\ngive a O(1) space complexity."),(0,a.kt)("div",{className:"admonition admonition-important alert alert--info"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"Binary Search")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"Recurrerence Relation: ",(0,a.kt)("inlineCode",{parentName:"p"},"T(N) = T(N/2) + O(1)")))),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-py"},"def binarySearch(nums, target):\n    left, right = 0, len(nums)-1\n    while left <= right: # Search interval = [left, right]\n        mid = (left + right) // 2\n        if nums[mid] == target: # target found! Return index\n            return mid\n        elif nums[mid] < target: # recurse right -> [mid+1, right]\n            left = mid + 1\n        elif nums[mid] > target: # recurse left -> [left, mid-1]\n            right = mid - 1\n    # Target not found -> return -1\n    return -1\n")),(0,a.kt)("h3",{id:"search-interval"},"Search Interval"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-py"},"while left <= right:...\n")),(0,a.kt)("p",null,"This gives us a closed interval of ",(0,a.kt)("inlineCode",{parentName:"p"},"[left, right]")," to search from where both the left and right boundaries are included. This\nalso means that our initial ",(0,a.kt)("inlineCode",{parentName:"p"},"right")," boundary would have to be ",(0,a.kt)("inlineCode",{parentName:"p"},"len(arr) - 1"),"."),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Case 1:")," ",(0,a.kt)("inlineCode",{parentName:"p"},"nums[mid] < target"),(0,a.kt)("br",null),"\nTarget lies on the right side of ",(0,a.kt)("inlineCode",{parentName:"p"},"mid")," and we would have to set our search interval\nto ",(0,a.kt)("inlineCode",{parentName:"p"},"[mid + 1, right]"),". To do so, we have to set our left interval to ",(0,a.kt)("inlineCode",{parentName:"p"},"mid + 1"),"."),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Case 2:")," ",(0,a.kt)("inlineCode",{parentName:"p"},"nums[mid] > target")," ",(0,a.kt)("br",null),"\nTarget lies on the left side of ",(0,a.kt)("inlineCode",{parentName:"p"},"mid")," and we would have to set our search interval to ",(0,a.kt)("inlineCode",{parentName:"p"},"[left, mid - 1]"),". To do so,\nwe have to set our right interval to ",(0,a.kt)("inlineCode",{parentName:"p"},"mid - 1"),"."),(0,a.kt)("p",null,"The terminating condition for this while loop would be when ",(0,a.kt)("inlineCode",{parentName:"p"},"left > right"),"."),(0,a.kt)("h2",{id:"find-left-border"},"Find Left Border"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-py"},"def bsLeftBorder(nums, target):\n    if not nums:\n        return -1\n    left = 0\n    right = len(nums)\n    while left < right: # [left, right)\n        mid = (left + right) // 2\n        if nums[mid] == target: # [left, mid)\n            right = mid\n        elif nums[mid] < target: # [mid + 1, right)\n            left = mid + 1\n        elif nums[mid] > target: # [left, mid)\n            right = mid\n\n    print(left) # left => number of elements smaller than target\n\n    # If we want to return -1 when target not found\n    if left >= len(nums) or nums[left] != target:\n        return -1\n    return left # returns index of left border\n")),(0,a.kt)("h2",{id:"find-right-border"},"Find Right Border"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-py"},"def bsRightBorder(nums, target):\n    if not nums:\n        return -1\n    left = 0\n    right = len(nums)\n    while left < right: # [left, right), terminating condition: left == right\n        mid = (left + right) // 2\n        if nums[mid] == target: # [mid + 1, right)\n            left = mid + 1\n        elif nums[mid] < target: # [mid + 1, right)\n            left = mid + 1\n        elif nums[mid] > target: # [left, mid)\n            right = mid\n    # nums[left-1] may be the target\n    if left == 0 or nums[left-1] != target:\n        return -1\n    return left - 1\n")),(0,a.kt)("h3",{id:"search-in-rotated-sorted-array"},(0,a.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/search-in-rotated-sorted-array/"},"Search In Rotated Sorted Array")),(0,a.kt)("div",{className:"admonition admonition-important alert alert--info"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"good question")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"This leetcode question will test your true understanding of binary search."))),(0,a.kt)("h4",{id:"solution"},"Solution:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-py"},"def search(self, nums):\n    l = 0\n    r = len(nums)\n    while l < r: # [l, r), terminating condition: l == r\n        mid = (l + r) // 2\n        if nums[mid] == target:\n            return mid\n        # target and mid on same side\n        if (nums[mid] < nums[0]) == (target < nums[0]):\n            # perform binary search\n            if nums[mid] < target: # [mid + 1, r)\n                l = mid + 1\n            elif nums[mid] > target: # [l, mid)\n                r = mid\n        # target on right side, search right\n        elif (target < nums[0]): # [mid + 1, r)\n            l = mid + 1\n        # target on left side, search left\n        else: # [l, mid)\n            r = mid\n    # Not found\n    return -1\n\n")))}c.isMDXComponent=!0},3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return c}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var d=r.createContext({}),s=function(e){var t=r.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=s(e.components);return r.createElement(d.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,d=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),h=s(n),c=i,u=h["".concat(d,".").concat(c)]||h[c]||p[c]||a;return n?r.createElement(u,o(o({ref:t},m),{},{components:n})):r.createElement(u,o({ref:t},m))}));function c(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=h;var l={};for(var d in t)hasOwnProperty.call(t,d)&&(l[d]=t[d]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var s=2;s<a;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"}}]);