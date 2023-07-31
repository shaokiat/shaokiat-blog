"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[1220],{3144:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return c},default:function(){return m},frontMatter:function(){return o},metadata:function(){return s},toc:function(){return d}});var a=n(3117),r=n(102),i=(n(7294),n(3905)),l=["components"],o={},c="LRU Cache",s={unversionedId:"algorithms/lru-cache",id:"algorithms/lru-cache",title:"LRU Cache",description:"Try out the question on LeetCode https://leetcode.com/problems/lru-cache/",source:"@site/docs/algorithms/lru-cache.mdx",sourceDirName:"algorithms",slug:"/algorithms/lru-cache",permalink:"/shaokiat-blog/docs/algorithms/lru-cache",draft:!1,editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/docs/algorithms/lru-cache.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Linked List",permalink:"/shaokiat-blog/docs/algorithms/linked-list"},next:{title:"Recursion and Backtracking",permalink:"/shaokiat-blog/docs/algorithms/recursion"}},p={},d=[{value:"Problem Requirements",id:"problem-requirements",level:2},{value:"Data Stuctures Required",id:"data-stuctures-required",level:2},{value:"Solution",id:"solution",level:2},{value:"<code>Node</code> class:",id:"node-class",level:3},{value:"Initialization of <code>LRUCache</code>",id:"initialization-of-lrucache",level:3},{value:"Helper functions",id:"helper-functions",level:3},{value:"<code>get</code> and <code>put</code>",id:"get-and-put",level:3}],u={toc:d};function m(e){var t=e.components,n=(0,r.Z)(e,l);return(0,i.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"lru-cache"},"LRU Cache"),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Try out the question on LeetCode ",(0,i.kt)("br",null),(0,i.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/lru-cache/"},"https://leetcode.com/problems/lru-cache/")))),(0,i.kt)("h2",{id:"problem-requirements"},"Problem Requirements"),(0,i.kt)("p",null,"Design a data structure that follows the constraints of a Least Recently Used (LRU) cache."),(0,i.kt)("p",null,"Implement the ",(0,i.kt)("inlineCode",{parentName:"p"},"LRUCache")," class:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"LRUCache(int capacity)")," Initialize the LRU cache with positive size ",(0,i.kt)("inlineCode",{parentName:"li"},"capacity"),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"int get(int key)")," Return the value of the key if the ",(0,i.kt)("inlineCode",{parentName:"li"},"key")," exists, otherwise return ",(0,i.kt)("inlineCode",{parentName:"li"},"-1"),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"void put(int key, int value)")," Update the value of the ",(0,i.kt)("inlineCode",{parentName:"li"},"key")," if the ",(0,i.kt)("inlineCode",{parentName:"li"},"key")," exists. Otherwise, add the ",(0,i.kt)("inlineCode",{parentName:"li"},"key-value")," pair to the cache. If the number of keys exceeds the ",(0,i.kt)("inlineCode",{parentName:"li"},"capacity")," from this operation, evict the least recently used key.")),(0,i.kt)("p",null,"The functions get and put must each run in ",(0,i.kt)("inlineCode",{parentName:"p"},"O(1)")," average time complexity."),(0,i.kt)("h2",{id:"data-stuctures-required"},"Data Stuctures Required"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("inlineCode",{parentName:"strong"},"Doubly linked-list")),": For ",(0,i.kt)("inlineCode",{parentName:"p"},"O(1)")," insertion and deletion of nodes")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("inlineCode",{parentName:"strong"},"Hashmap")),": For ",(0,i.kt)("inlineCode",{parentName:"p"},"O(1)")," searching of keys of node")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("inlineCode",{parentName:"p"},"left")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"right")," node to indicate LRU and MRU"))),(0,i.kt)("h2",{id:"solution"},"Solution"),(0,i.kt)("h3",{id:"node-class"},(0,i.kt)("inlineCode",{parentName:"h3"},"Node")," class:"),(0,i.kt)("p",null,"A Node class which stores the key-value pair, previous and next node in the linked list.\nThis forms the doubly linked-list."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-py"},"class Node:\n    def __init__(self, key, val):\n        self.key = key\n        self.val = val\n        self.prev = self.next = None\n")),(0,i.kt)("h3",{id:"initialization-of-lrucache"},"Initialization of ",(0,i.kt)("inlineCode",{parentName:"h3"},"LRUCache")),(0,i.kt)("p",null,"Initialization of the hashmap ",(0,i.kt)("inlineCode",{parentName:"p"},"cache")," which stores ",(0,i.kt)("inlineCode",{parentName:"p"},"(key, node)"),"."),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"self.left")," to indicate Least Recently Used node.\n",(0,i.kt)("inlineCode",{parentName:"p"},"self.right")," to indicate Most Recetnly Used node."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"[ ] <-> [node 1] <-...->[node n] <-> [ ]\n ^         ^               ^          ^\n |         |               |          |\nleft      LRU             MRU       right\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-py"},"class LRUCache:\n    def __init__(self, capacity):\n        self.cap = capacity\n        self.cache = {} # hashmap, maps key to node\n\n        # Left=LRU, right=MRU\n        self.left, self.right = Node(0,0), Node(0,0)\n        self.left.next, self.right.prev = self.right, self.left\n")),(0,i.kt)("h3",{id:"helper-functions"},"Helper functions"),(0,i.kt)("p",null,"In order to move a node to the Most Recently Used, we need this pair of function ",(0,i.kt)("inlineCode",{parentName:"p"},"remove")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"insert"),". This pair of functions will\nbe used in ",(0,i.kt)("inlineCode",{parentName:"p"},"get")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"put")," later on."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-py"},"# Remove node from list\ndef remove(self, node):\n    prev, nxt = node.prev, node.next\n    prev.next, nxt.prev = nxt, prev\n\n\n# Insert node to right (MRU)\ndef insert(self, node):\n    prev, nxt = self.right.prev, self.right\n    prev.next = nxt.prev = node\n    node.prev, node.next = prev, nxt\n")),(0,i.kt)("h3",{id:"get-and-put"},(0,i.kt)("inlineCode",{parentName:"h3"},"get")," and ",(0,i.kt)("inlineCode",{parentName:"h3"},"put")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-py"},"def get(self, key):\n    if key in self.cache:\n        node = self.cache[key]\n        # Move node to MRU\n        self.remove(node)\n        self.insert(node)\n        return node.val\n    # Not found\n    else:\n        return -1\n\ndef put(self, key, value):\n    # Remove node from list\n    if key in self.cache:\n        self.remove(self.cache[key])\n\n    # Insert new node to list\n    self.cache[key] = Node(key, value)\n    self.insert(self.cache[key])\n\n    # Capacity exceed -> remove LRU\n    if len(self.cache) > self.cap:\n        lru = self.left.next\n        self.remove(lru)\n        # Delete key from cache\n        del self.cache[lru.key]\n")))}m.isMDXComponent=!0},3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),s=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=s(e.components);return a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,c=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=s(n),m=r,f=u["".concat(c,".").concat(m)]||u[m]||d[m]||i;return n?a.createElement(f,l(l({ref:t},p),{},{components:n})):a.createElement(f,l({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,l=new Array(i);l[0]=u;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var s=2;s<i;s++)l[s]=n[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);