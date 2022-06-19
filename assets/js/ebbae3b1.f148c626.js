"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[637],{4474:function(e,r,t){t.r(r),t.d(r,{assets:function(){return d},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return i},metadata:function(){return c},toc:function(){return p}});var n=t(3117),a=t(102),o=(t(7294),t(3905)),s=["components"],i={},l="Binary Search Trees (BST)",c={unversionedId:"algorithms/binary-search-trees",id:"algorithms/binary-search-trees",title:"Binary Search Trees (BST)",description:"https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/",source:"@site/docs/algorithms/binary-search-trees.mdx",sourceDirName:"algorithms",slug:"/algorithms/binary-search-trees",permalink:"/shaokiat-blog/docs/algorithms/binary-search-trees",draft:!1,editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/docs/algorithms/binary-search-trees.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Arrays and Subarrays",permalink:"/shaokiat-blog/docs/algorithms/arrays"},next:{title:"Binary Search",permalink:"/shaokiat-blog/docs/algorithms/binary-search"}},d={},p=[{value:"In-order Traversal",id:"in-order-traversal",level:3},{value:"Pre-order Traversal",id:"pre-order-traversal",level:3},{value:"Post-order Traversal",id:"post-order-traversal",level:3}],u={toc:p};function m(e){var r=e.components,t=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,n.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"binary-search-trees-bst"},"Binary Search Trees (BST)"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/"},"https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/")),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"questions")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},(0,o.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/kth-smallest-element-in-a-bst/submissions/"},"Kth Smallest Element in a BST")))),(0,o.kt)("div",{align:"center"},(0,o.kt)("img",{src:"/shaokiat-blog/img/algo/bst.png",alt:"bst",width:"600"})),(0,o.kt)("div",{align:"center",width:"700",textAlign:"left",style:{}},"Source:",(0,o.kt)("a",{href:"https://medium.com/@konduruharish/binary-search-tree-in-typescript-and-c-25fa5107cc5d"},"Medium")),(0,o.kt)("h3",{id:"in-order-traversal"},"In-order Traversal"),(0,o.kt)("p",null,"Returns a sorted list."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"Algorithm for In-order:\n    1. Traverse left subtree -> call Inorder(node.left)\n    2. Visit node\n    3. Traverse right subtree -> call Inorder(node.right)\n")),(0,o.kt)("h3",{id:"pre-order-traversal"},"Pre-order Traversal"),(0,o.kt)("p",null,"Used to create a copy of the tree."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"Algorithm for Pre-order:\n    1. Visit node\n    2. Traverse left subtree -> call Preorder(node.left)\n    3. Traverse right subtree -> call Preorder(node.right)\n")),(0,o.kt)("h3",{id:"post-order-traversal"},"Post-order Traversal"),(0,o.kt)("p",null,"Used to delete a tree."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"Algorithm for Post-order:\n    1. Traverse left subtree -> call Postorder(node.left)\n    2. Traverse right subtree -> call Postorder(node.right)\n    3. Visit node\n")))}m.isMDXComponent=!0},3905:function(e,r,t){t.d(r,{Zo:function(){return d},kt:function(){return m}});var n=t(7294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=n.createContext({}),c=function(e){var r=n.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},d=function(e){var r=c(e.components);return n.createElement(l.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},u=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),u=c(t),m=a,h=u["".concat(l,".").concat(m)]||u[m]||p[m]||o;return t?n.createElement(h,s(s({ref:r},d),{},{components:t})):n.createElement(h,s({ref:r},d))}));function m(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,s=new Array(o);s[0]=u;var i={};for(var l in r)hasOwnProperty.call(r,l)&&(i[l]=r[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,s[1]=i;for(var c=2;c<o;c++)s[c]=t[c];return n.createElement.apply(null,s)}return n.createElement.apply(null,t)}u.displayName="MDXCreateElement"}}]);