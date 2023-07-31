"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[924],{4140:function(e,n,t){t.r(n),t.d(n,{assets:function(){return m},contentTitle:function(){return s},default:function(){return c},frontMatter:function(){return o},metadata:function(){return p},toc:function(){return u}});var a=t(3117),i=t(102),r=(t(7294),t(3905)),l=["components"],o={},s="Arrays and Subarrays",p={unversionedId:"algorithms/arrays",id:"algorithms/arrays",title:"Arrays and Subarrays",description:"- Maximum Subarray",source:"@site/docs/algorithms/arrays.mdx",sourceDirName:"algorithms",slug:"/algorithms/arrays",permalink:"/shaokiat-blog/docs/algorithms/arrays",draft:!1,editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/docs/algorithms/arrays.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Introduction",permalink:"/shaokiat-blog/docs/intro"},next:{title:"Binary Search Trees (BST)",permalink:"/shaokiat-blog/docs/algorithms/binary-search-trees"}},m={},u=[{value:"Time Complexity",id:"time-complexity",level:2},{value:"Common Approaches to Arrays and Subarrays Questions",id:"common-approaches-to-arrays-and-subarrays-questions",level:2},{value:"Prefix Sum",id:"prefix-sum",level:3},{value:"Sliding Window",id:"sliding-window",level:3},{value:"Subarray Sum",id:"subarray-sum",level:3},{value:"Kadane&#39;s Algorithm",id:"kadanes-algorithm",level:3},{value:"Example Solutions",id:"example-solutions",level:2},{value:"Maximum Subarray",id:"maximum-subarray",level:3},{value:"Solution 1: Dynamic Programming + Memoization",id:"solution-1-dynamic-programming--memoization",level:4},{value:"Solution 2: Kadane&#39;s Algorithm <mark>(Prefered Solution)</mark>",id:"solution-2-kadanes-algorithm-prefered-solution",level:4},{value:"Container With Most Water",id:"container-with-most-water",level:3},{value:"Solution 1: Sliding Window",id:"solution-1-sliding-window",level:4},{value:"Trapping Rain Water",id:"trapping-rain-water",level:3},{value:"Solution 1: Sliding Window (Easier to understand)",id:"solution-1-sliding-window-easier-to-understand",level:4},{value:"Solution 2: Stack",id:"solution-2-stack",level:4},{value:"Product of Array Except Self",id:"product-of-array-except-self",level:3},{value:"Solution: Prefix + Postfix",id:"solution-prefix--postfix",level:4},{value:"Insert Interval",id:"insert-interval",level:3},{value:"Solution:",id:"solution",level:4},{value:"Sort Colors",id:"sort-colors",level:3},{value:"Solution:",id:"solution-1",level:4},{value:"Find All Anagrams in a String",id:"find-all-anagrams-in-a-string",level:3},{value:"Solution:",id:"solution-2",level:4},{value:"Minimum Window Substring",id:"minimum-window-substring",level:3},{value:"Solution: Sliding window with Hashmaps",id:"solution-sliding-window-with-hashmaps",level:4},{value:"K Closest Points to Origin",id:"k-closest-points-to-origin",level:3},{value:"Solution 1: Quick Select",id:"solution-1-quick-select",level:4},{value:"3Sum",id:"3sum",level:3},{value:"Solution: Sort then 2Sum",id:"solution-sort-then-2sum",level:4},{value:"Next Permutation",id:"next-permutation",level:3},{value:"Solution:",id:"solution-3",level:4}],d={toc:u};function c(e){var n=e.components,t=(0,i.Z)(e,l);return(0,r.kt)("wrapper",(0,a.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"arrays-and-subarrays"},"Arrays and Subarrays"),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Common Questions")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("ul",{parentName:"div"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/maximum-subarray/"},"Maximum Subarray")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/subarray-sums-divisible-by-k/"},"Subarray Sums Divisible by K")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/subarray-sum-equals-k/"},"Subarray Sum Equals K")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/maximum-product-subarray/"},"Maximum Product Subarray")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/product-of-array-except-self/"},"Product of Array Except Self")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/trapping-rain-water/"},"Trapping Rain Water")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/sort-colors/"},"Sort Colors")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/find-all-anagrams-in-a-string/"},"Find All Anagrams in a String")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/minimum-window-substring/"},"Minimum Window Substring")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/k-closest-points-to-origin/"},"K Closest Points to Origin")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/3sum/"},"3Sum")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://leetcode.com/problems/next-permutation/"},"Next Permutation"))))),(0,r.kt)("h2",{id:"time-complexity"},"Time Complexity"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Operation"),(0,r.kt)("th",{parentName:"tr",align:null},"Big-O"),(0,r.kt)("th",{parentName:"tr",align:null},"Note"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Access"),(0,r.kt)("td",{parentName:"tr",align:null},"O(1)"),(0,r.kt)("td",{parentName:"tr",align:null})),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Search"),(0,r.kt)("td",{parentName:"tr",align:null},"O(n)"),(0,r.kt)("td",{parentName:"tr",align:null})),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Search (sorted array)"),(0,r.kt)("td",{parentName:"tr",align:null},"O(log(n))"),(0,r.kt)("td",{parentName:"tr",align:null},"Binary Search")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Insert"),(0,r.kt)("td",{parentName:"tr",align:null},"O(n)"),(0,r.kt)("td",{parentName:"tr",align:null},"Insertion would require shifting all the subsequent elements to the right by one and that takes O(n)")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Insert (at the end)"),(0,r.kt)("td",{parentName:"tr",align:null},"O(1)"),(0,r.kt)("td",{parentName:"tr",align:null},"Special case of insertion where no other element needs to be shifted")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Remove"),(0,r.kt)("td",{parentName:"tr",align:null},"O(n)"),(0,r.kt)("td",{parentName:"tr",align:null},"Removal would require shifting all the subsequent elements to the left by one and that takes O(n)")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"Remove (at the end)"),(0,r.kt)("td",{parentName:"tr",align:null},"O(1)"),(0,r.kt)("td",{parentName:"tr",align:null},"Special case of removal where no other element needs to be shifted")))),(0,r.kt)("h2",{id:"common-approaches-to-arrays-and-subarrays-questions"},"Common Approaches to Arrays and Subarrays Questions"),(0,r.kt)("h3",{id:"prefix-sum"},"Prefix Sum"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"nums = [10, 20, 5, 15]\nprefixSum = [10, 30, 35, 50]\n\nprefixSum[i] = prefixSum[i - 1] + arr[i]\n")),(0,r.kt)("h3",{id:"sliding-window"},"Sliding Window"),(0,r.kt)("h3",{id:"subarray-sum"},"Subarray Sum"),(0,r.kt)("h3",{id:"kadanes-algorithm"},"Kadane's Algorithm"),(0,r.kt)("h2",{id:"example-solutions"},"Example Solutions"),(0,r.kt)("h3",{id:"maximum-subarray"},(0,r.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/maximum-subarray/"},"Maximum Subarray")),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"source")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Solutions are adapted from this ",(0,r.kt)("a",{parentName:"p",href:"https://leetcode.com/problems/maximum-subarray/discuss/1595195/C%2B%2BPython-7-Simple-Solutions-w-Explanation-or-Brute-Force-%2B-DP-%2B-Kadane-%2B-Divide-and-Conquer"},"LeetCode discussion")," by ",(0,r.kt)("em",{parentName:"p"},"archit91")))),(0,r.kt)("h4",{id:"solution-1-dynamic-programming--memoization"},"Solution 1: Dynamic Programming + Memoization"),(0,r.kt)("p",null,"Bottom-up approach. ",(0,r.kt)("inlineCode",{parentName:"p"},"dp")," array will store the maximum subarray sum at its respective index"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def maxSubArray(self, nums):\n    dp = nums\n    for i in range(1, len(nums)):\n        # Store maximum of nums[i] or nums[i] + previous maximum\n        dp[i] = max(nums[i], dp[i-1] + nums[i])\n    return max(dp)\n\nnums = [-2,1,-3,4,-1,2,1,-5,4]\ndp = [-2, 1, -2, 4, 3, 5, 6, 1, 5] # dp array after running\n")),(0,r.kt)("p",null,"Time Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")," for looping through the ",(0,r.kt)("inlineCode",{parentName:"p"},"nums")," array."),(0,r.kt)("p",null,"Space Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")," for storing dp array of size ",(0,r.kt)("inlineCode",{parentName:"p"},"n"),"."),(0,r.kt)("br",null),(0,r.kt)("h4",{id:"solution-2-kadanes-algorithm-prefered-solution"},"Solution 2: Kadane's Algorithm ",(0,r.kt)("mark",null,"(Prefered Solution)")),(0,r.kt)("p",null,"Optimize previous solution in terms of space by only storing the maximum of each iteration. The global maximum will then\nbe the maximum of all the iterations."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def maxSubArray(self, nums):\n    globalMax = localMax = nums[0] # Starts with nums[0]\n    for num in nums[1:]: # Iterate through remaining array nums[1:]\n        localMax = max(num, localMax + num)\n        globalMax = max(globalMax, localMax)\n    return globalMax\n")),(0,r.kt)("p",null,"Time Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")," for looping through the ",(0,r.kt)("inlineCode",{parentName:"p"},"nums")," array."),(0,r.kt)("p",null,"Space Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(1)")," for 2 variables ",(0,r.kt)("inlineCode",{parentName:"p"},"globalMax")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"localMax"),"."),(0,r.kt)("br",null),(0,r.kt)("h3",{id:"container-with-most-water"},(0,r.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/container-with-most-water/"},"Container With Most Water")),(0,r.kt)("h4",{id:"solution-1-sliding-window"},"Solution 1: Sliding Window"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def maxArea(self, height):\n    max_area = 0\n    left = 0\n    right = len(height) - 1\n    while left <= right: # terminating condition: left > right\n        h = min(height[left], height[right])\n        area = h * (right - left)\n        max_area = max(max_area, area)\n        # Shift window\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return max_area\n")),(0,r.kt)("p",null,"Time Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")," for looping through the ",(0,r.kt)("inlineCode",{parentName:"p"},"height")," array."),(0,r.kt)("p",null,"Space Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(1)")," for 3 variables ",(0,r.kt)("inlineCode",{parentName:"p"},"max_area")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"left")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"right"),"."),(0,r.kt)("br",null),(0,r.kt)("h3",{id:"trapping-rain-water"},(0,r.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/trapping-rain-water/"},"Trapping Rain Water")),(0,r.kt)("h4",{id:"solution-1-sliding-window-easier-to-understand"},"Solution 1: Sliding Window (Easier to understand)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def trap(self, height):\n    water = 0\n    i, j = 0, len(height) - 1\n    lmax, rmax = height[i], height[j]\n    while i <= j: # Terminates when i > j\n        lmax = max(lmax, height[i])\n        rmax = max(rmax, height[j])\n        if lmax <= rmax:\n            water += lmax - height[i] # Add height difference from lmax\n            i += 1\n        else:\n            water += rmax - height[j] # Add height difference from rmax\n            j -= 1\n    return water\n")),(0,r.kt)("p",null,"Time Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")," for looping through the ",(0,r.kt)("inlineCode",{parentName:"p"},"height")," array."),(0,r.kt)("p",null,"Space Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(1)")," for constant variables."),(0,r.kt)("h4",{id:"solution-2-stack"},"Solution 2: Stack"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def trap(self, height):\n    water = 0\n    stack = []\n    for i, h in enumerate(height):\n        if stack and h > height[stack[-1]]:\n            deal = stack.pop()\n            if stack:\n                w = i - stack[-1] - 1\n                water += (min(h, height[deal]) - height[i]) * w\n        stack.append(i)\n    return water\n\n")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Invariant"),": Stack always contain the indexes which have bar heights in decreasing order."),(0,r.kt)("p",null,"When we encounter a higher bar, we will pop the stack until we meet invariant then push the stack again."),(0,r.kt)("p",null,"Time Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")," for looping through the ",(0,r.kt)("inlineCode",{parentName:"p"},"height")," array."),(0,r.kt)("p",null,"Space Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")," for using a stack."),(0,r.kt)("br",null),(0,r.kt)("h3",{id:"product-of-array-except-self"},(0,r.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/product-of-array-except-self/"},"Product of Array Except Self")),(0,r.kt)("h4",{id:"solution-prefix--postfix"},"Solution: Prefix + Postfix"),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Here is an excellent ",(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=bNvIQI2wAjk"},"video explanation")," by NeetCode."))),(0,r.kt)("p",null,"Prefix product: Product of all numbers in the array before the current index."),(0,r.kt)("p",null,"Postfix product: Product of all numbers in the array after the current index."),(0,r.kt)("p",null,"Idea: Product except self is the product of prefix and postfix"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"nums = [1, 2, 3, 4]\nprefix = [1, 2, 6, 24]\npostfix = [24, 24, 12, 4]\n\nresult = [24, 12, 8, 6]\n# Example: index 1\n# prefix for nums[1] = 1\n# postfix for nums[1] = 12\n# product = 12\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"'''\nnums = [1, 2, 3, 4]\nres = [1, 1, 1, 1] - initial\nprefix = [1, 1, 2, 6] - shifted by 1\npostfix = [24, 12, 4, 1] - shifted by 1\n\nres = [24, 12, 8, 6]\n'''\n\ndef productExceptSelf(self, nums):\n    n = len(nums)\n    prefix = postfix = 1 # initialized as 1\n    res = [1] * n\n    for i in range(nums):\n        res[i] *= prefix\n        prefix *= nums[i]\n\n        res[n-1-i] *= postfix\n        postfix *= nums[n-1-i]\n    return res\n")),(0,r.kt)("p",null,"Time Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")," for looping through the ",(0,r.kt)("inlineCode",{parentName:"p"},"nums")," array."),(0,r.kt)("p",null,"Space Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(1)")," as result array is not counted."),(0,r.kt)("br",null),(0,r.kt)("h3",{id:"insert-interval"},(0,r.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/insert-interval/"},"Insert Interval")),(0,r.kt)("h4",{id:"solution"},"Solution:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def insert(self, intervals, newInterval):\n    n = newInterval\n    res = []\n    for index, i in enumerate(intervals):\n        # Case 1: n greater than i\n        if n[0] > i[1]:\n            res.append(i)\n        # Case 2: n smaller than i\n        elif n[1] < i[0]:\n            res.append(n)\n            return res + intervals[index:]\n        # Case 3: n overlaps with i -> merge\n        else:\n            n = [min(n[0], i[0]), max(n[1], i[1])]\n    # append n to end of list\n    res.append(n)\n    return res\n")),(0,r.kt)("p",null,"Time Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")," for looping through the ",(0,r.kt)("inlineCode",{parentName:"p"},"intervals")," array."),(0,r.kt)("p",null,"Space Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(1)")," as result array is not counted."),(0,r.kt)("br",null),(0,r.kt)("h3",{id:"sort-colors"},(0,r.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/sort-colors/"},"Sort Colors")),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=4xbWSRZHqac"},"Amazing answer explanation")," by NeetCode."))),(0,r.kt)("h4",{id:"solution-1"},"Solution:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"left pointer pointing to the first 1"),(0,r.kt)("li",{parentName:"ul"},"right pointer pointing to the non-2")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def sortColors(self, nums):\n    l = i = 0\n    r = len(nums) - 1\n    while i <= r:\n        if nums[i] == 0: # swap with left pointer\n            nums[l], nums[i] = nums[i], nums[l]\n            l += 1 # move left pointer\n        elif nums[i] == 2: # swap with right pointer\n            nums[r], nums[i] = nums[i], nums[r]\n            r -= 1 # move right pointer\n            i -= 1 # Edge case: swapped 0 to nums[i]\n        i += 1\n")),(0,r.kt)("p",null,"Time Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")," for one pass solution."),(0,r.kt)("p",null,"Space Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(1)")," as solution is in-place."),(0,r.kt)("br",null),(0,r.kt)("h3",{id:"find-all-anagrams-in-a-string"},(0,r.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/find-all-anagrams-in-a-string/"},"Find All Anagrams in a String")),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=G8xtZy0fDKg"},"Amazing answer explanation")," by NeetCode."))),(0,r.kt)("h4",{id:"solution-2"},"Solution:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Sliding window solution: Update dictionary according to sliding window")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def findAnagrams(self, s, p):\n    if len(p) > len(s):\n        return []\n    pCount, sCount = {}, {}\n    for i in range(len(p)):\n        pCount[p[i]] = 1 + pCount.get(p[i], 0) # default to 0 if not found\n        sCount[s[i]] = 1 + sCount.get(s[i], 0)\n    res = [0] if pCount == sCount else []\n\n    l = 0\n    for r in range(len(p), len(s)): # Starts from len(p) onwards\n        sCount[s[r]] = 1 + sCount.get(s[r], 0)\n        sCount[s[l]] -= 1\n        if sCount[s[l]] == 0: # Remove key from dict\n            sCount.pop(s[l])\n        l += 1\n        if sCount == pCount:\n            res.append(l)\n    return res\n")),(0,r.kt)("p",null,"Time Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")," for one pass solution."),(0,r.kt)("p",null,"Space Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(1)")," as maximum space used is dictionary for 26 characters in the alphabet."),(0,r.kt)("br",null),(0,r.kt)("h3",{id:"minimum-window-substring"},(0,r.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/minimum-window-substring/"},"Minimum Window Substring")),(0,r.kt)("h4",{id:"solution-sliding-window-with-hashmaps"},"Solution: Sliding window with Hashmaps"),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Here is an excellent ",(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=jSto0O4AJbM"},"video explanation")," by NeetCode."))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},'def minWindow(self, s, t):\n    if t == "":\n        return t\n    wMap, tMap = {}, {}\n    for i in t:\n        tMap = 1 + tMap.get(i, 0)\n    have, need = 0, len(tMap)\n    res, resLen = [-1,-1], len(s) + 1\n    l = 0\n    for r in range(len(s)):\n        c = s[r]\n        wMap[c] = wMap.get(c, 0)\n        if c in tMap and wMap[c] == tMap[c]:\n            have += 1\n        while have == need:\n            # update result\n            if (r - l + 1) < resLen:\n                res = [l, r]\n                resLen = r - l + 1\n            # pop left\n            lc = s[l]\n            wMap[lc] -= 1\n            if lc in tMap and wMap[lc] < tMap[lc]:\n                have -= 1\n            l += 1\n    l, r = res\n    return s[l, r-1] if resLen != len(s) + 1 else ""\n')),(0,r.kt)("p",null,"Time Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n + m)")," for looping through the string ",(0,r.kt)("inlineCode",{parentName:"p"},"s")," of length ",(0,r.kt)("inlineCode",{parentName:"p"},"n")," and string ",(0,r.kt)("inlineCode",{parentName:"p"},"t")," of length ",(0,r.kt)("inlineCode",{parentName:"p"},"m"),"."),(0,r.kt)("p",null,"Space Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n + m)")," for hashmaps used for ",(0,r.kt)("inlineCode",{parentName:"p"},"wMap")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"tMap"),"."),(0,r.kt)("br",null),(0,r.kt)("h3",{id:"k-closest-points-to-origin"},(0,r.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/k-closest-points-to-origin/"},"K Closest Points to Origin")),(0,r.kt)("h4",{id:"solution-1-quick-select"},"Solution 1: Quick Select"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def kClosest(self, points):\n    def euclidean(point):\n        return point[0]**2 + point[1]**2\n\n    def partition(l, r):\n        rand = randint(l, r) # choose random pivot\n        points[r], points[rand] = points[rand], points[r] # move pivot to end\n        i, pivotDist = l, euclidean(points[rand])\n        for j in range(l, r+1):\n            if euclidean(points[j]) <= pivotDist:\n                points[i], points[j] = points[j], points[i]\n                i += 1\n        return i-1\n    l, r, p = 0, len(points) - 1, len(points)\n    while p != k:\n        p = partition(l, r)\n        if p < k:\n            l = p + 1\n        else:\n            r = p - 1\n    return points[:pivot]\n")),(0,r.kt)("p",null,"Time Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")," on average, the partitions roughly eliminates half of the remaining elements each time => O(2N)."),(0,r.kt)("p",null,"Space Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(1)"),", only constant space used."),(0,r.kt)("br",null),(0,r.kt)("h3",{id:"3sum"},(0,r.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/3sum/"},"3Sum")),(0,r.kt)("h4",{id:"solution-sort-then-2sum"},"Solution: Sort then 2Sum"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def threeSum(self, nums):\n    res = set()\n    nums.sort()\n    for index, i in enumerate(nums):\n        target = 0 - i\n        seen = {}\n        for j in nums[i+1:]:\n            diff = target - j\n            if diff in seen:\n                res.add(tuple([i, j, diff]))\n            seen[j] = j\n    return res\n")),(0,r.kt)("p",null,"Time Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n*2)")),(0,r.kt)("p",null,"Space Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")),(0,r.kt)("br",null),(0,r.kt)("h3",{id:"next-permutation"},(0,r.kt)("a",{parentName:"h3",href:"https://leetcode.com/problems/next-permutation/"},"Next Permutation")),(0,r.kt)("h4",{id:"solution-3"},"Solution:"),(0,r.kt)("p",null,"Idea:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"find last ascending position ",(0,r.kt)("inlineCode",{parentName:"li"},"k")),(0,r.kt)("li",{parentName:"ul"},"find smallest num from the end that is greater than ",(0,r.kt)("inlineCode",{parentName:"li"},"nums[k]")),(0,r.kt)("li",{parentName:"ul"},"reverse ",(0,r.kt)("inlineCode",{parentName:"li"},"nums[k+1:]"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-py"},"def nextPermutation(self, nums):\n    i = j = len(nums) - 1\n    # Find last ascending position\n    while i > 0 and nums[i-1] > nums[i]: \n        i -= 1\n    if i == 0: # nums is sorted in decreasing order\n        nums.reverse()\n        return\n    k = i - 1\n    # Find min nums[j] that is greater than nums[k]\n    while nums[j] < nums[k]:\n        j -= 1\n    nums[j], nums[k] = nums[k], nums[j] # swap\n    \n    # Reverse nums[k+1:]\n    l, r = i, len(nums) - 1\n    while l < r:\n        nums[l], nums[r] = nums[r], nums[l]\n        l += 1\n        r -= 1\n")),(0,r.kt)("p",null,"Time Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(n)")),(0,r.kt)("p",null,"Space Complexity: ",(0,r.kt)("inlineCode",{parentName:"p"},"O(1)")),(0,r.kt)("br",null))}c.isMDXComponent=!0},3905:function(e,n,t){t.d(n,{Zo:function(){return m},kt:function(){return c}});var a=t(7294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,a,i=function(e,n){if(null==e)return{};var t,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var s=a.createContext({}),p=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},m=function(e){var n=p(e.components);return a.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,i=e.mdxType,r=e.originalType,s=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),d=p(t),c=i,h=d["".concat(s,".").concat(c)]||d[c]||u[c]||r;return t?a.createElement(h,l(l({ref:n},m),{},{components:t})):a.createElement(h,l({ref:n},m))}));function c(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var r=t.length,l=new Array(r);l[0]=d;var o={};for(var s in n)hasOwnProperty.call(n,s)&&(o[s]=n[s]);o.originalType=e,o.mdxType="string"==typeof e?e:i,l[1]=o;for(var p=2;p<r;p++)l[p]=t[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"}}]);