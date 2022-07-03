"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[637],{4474:function(e,t,r){r.r(t),r.d(t,{assets:function(){return m},contentTitle:function(){return s},default:function(){return u},frontMatter:function(){return i},metadata:function(){return p},toc:function(){return d}});var n=r(3117),a=r(102),l=(r(7294),r(3905)),o=["components"],i={},s="Binary Search Trees (BST)",p={unversionedId:"algorithms/binary-search-trees",id:"algorithms/binary-search-trees",title:"Binary Search Trees (BST)",description:"https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/",source:"@site/docs/algorithms/binary-search-trees.mdx",sourceDirName:"algorithms",slug:"/algorithms/binary-search-trees",permalink:"/shaokiat-blog/docs/algorithms/binary-search-trees",draft:!1,editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/docs/algorithms/binary-search-trees.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Arrays and Subarrays",permalink:"/shaokiat-blog/docs/algorithms/arrays"},next:{title:"Binary Search",permalink:"/shaokiat-blog/docs/algorithms/binary-search"}},m={},d=[{value:"Time Complexity",id:"time-complexity",level:2},{value:"In-order Traversal",id:"in-order-traversal",level:3},{value:"Pre-order Traversal",id:"pre-order-traversal",level:3},{value:"Post-order Traversal",id:"post-order-traversal",level:3},{value:"Example Solutions",id:"example-solutions",level:2},{value:"Maximum Depth of Binary Tree",id:"maximum-depth-of-binary-tree",level:3},{value:"Solution 1: Recursive Approach",id:"solution-1-recursive-approach",level:4},{value:"Solution 2: Iterative Approach",id:"solution-2-iterative-approach",level:4}],c={toc:d};function u(e){var t=e.components,r=(0,a.Z)(e,o);return(0,l.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"binary-search-trees-bst"},"Binary Search Trees (BST)"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/"},"https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/")),(0,l.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"common questions")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("ul",{parentName:"div"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/kth-smallest-element-in-a-bst/submissions/"},"Kth Smallest Element in a BST")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/maximum-depth-of-binary-tree/"},"Maximum Depth of Binary Tree")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/binary-tree-right-side-view/"},"Binary Tree Right Side View"))))),(0,l.kt)("div",{align:"center"},(0,l.kt)("img",{src:"/shaokiat-blog/img/algo/bst.png",alt:"bst",width:"600"})),(0,l.kt)("div",{align:"center",width:"700",textAlign:"left",style:{}},"Source:",(0,l.kt)("a",{href:"https://medium.com/@konduruharish/binary-search-tree-in-typescript-and-c-25fa5107cc5d"},"Medium")),(0,l.kt)("h2",{id:"time-complexity"},"Time Complexity"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Operation"),(0,l.kt)("th",{parentName:"tr",align:null},"Big-O"),(0,l.kt)("th",{parentName:"tr",align:null},"Note"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Access"),(0,l.kt)("td",{parentName:"tr",align:null},"O(log(n))"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Search"),(0,l.kt)("td",{parentName:"tr",align:null},"O(log(n))"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Insert"),(0,l.kt)("td",{parentName:"tr",align:null},"O(log(n))"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Remove"),(0,l.kt)("td",{parentName:"tr",align:null},"O(log(n))"),(0,l.kt)("td",{parentName:"tr",align:null})))),(0,l.kt)("h3",{id:"in-order-traversal"},"In-order Traversal"),(0,l.kt)("p",null,"Returns a sorted list."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"Algorithm for In-order:\n    1. Traverse left subtree -> call Inorder(node.left)\n    2. Visit node\n    3. Traverse right subtree -> call Inorder(node.right)\n")),(0,l.kt)("h3",{id:"pre-order-traversal"},"Pre-order Traversal"),(0,l.kt)("p",null,"Used to create a copy of the tree."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"Algorithm for Pre-order:\n    1. Visit node\n    2. Traverse left subtree -> call Preorder(node.left)\n    3. Traverse right subtree -> call Preorder(node.right)\n")),(0,l.kt)("h3",{id:"post-order-traversal"},"Post-order Traversal"),(0,l.kt)("p",null,"Used to delete a tree."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"Algorithm for Post-order:\n    1. Traverse left subtree -> call Postorder(node.left)\n    2. Traverse right subtree -> call Postorder(node.right)\n    3. Visit node\n")),(0,l.kt)("h2",{id:"example-solutions"},"Example Solutions"),(0,l.kt)("h3",{id:"maximum-depth-of-binary-tree"},(0,l.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/maximum-depth-of-binary-tree/"},"Maximum Depth of Binary Tree")),(0,l.kt)("p",null,"A common approach to this question is to ",(0,l.kt)("strong",{parentName:"p"},"traverse by level"),"."),(0,l.kt)("h4",{id:"solution-1-recursive-approach"},"Solution 1: Recursive Approach"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-py"},"# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\n\ndef maxDepth(self, root):\n  if not root:\n    return 0\n  return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))\n\n")),(0,l.kt)("p",null,"Time Complexity: ",(0,l.kt)("inlineCode",{parentName:"p"},"O(n)")," for traversing the entire binary tree."),(0,l.kt)("p",null,"Space Complexity: ",(0,l.kt)("inlineCode",{parentName:"p"},"O(n)")," for the recursion stack."),(0,l.kt)("br",null),(0,l.kt)("h4",{id:"solution-2-iterative-approach"},"Solution 2: Iterative Approach"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"A stack to store the order of nodes to traverse"),(0,l.kt)("li",{parentName:"ul"},"Keeping track of the number of nodes in a level")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-py"},"def maxDepth(self, root):\n  height = 0\n  level = [root] if root else None # stack of nodes in the level\n  level_size = 1\n  while level:\n    node = level.pop(0)\n    if node.left:\n      level.append(node.left)\n    if node.right:\n      level.append(node.right)\n    level_size -= 1\n    if level_size == 0: # move on to next level\n      height += 1\n      level_size = len(level)\n  return height\n\n")),(0,l.kt)("p",null,"Time Complexity: ",(0,l.kt)("inlineCode",{parentName:"p"},"O(n)")," for traversing the entire binary tree."),(0,l.kt)("p",null,"Space Complexity: ",(0,l.kt)("inlineCode",{parentName:"p"},"O(log(n))")," for the stack of nodes in the level."))}u.isMDXComponent=!0},3905:function(e,t,r){r.d(t,{Zo:function(){return m},kt:function(){return u}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},l=Object.keys(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),p=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},m=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,l=e.originalType,s=e.parentName,m=i(e,["components","mdxType","originalType","parentName"]),c=p(r),u=a,h=c["".concat(s,".").concat(u)]||c[u]||d[u]||l;return r?n.createElement(h,o(o({ref:t},m),{},{components:r})):n.createElement(h,o({ref:t},m))}));function u(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=r.length,o=new Array(l);o[0]=c;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var p=2;p<l;p++)o[p]=r[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}c.displayName="MDXCreateElement"}}]);