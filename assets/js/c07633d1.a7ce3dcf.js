"use strict";(self.webpackChunksk_blog=self.webpackChunksk_blog||[]).push([[5553],{5674:function(e,t,a){a.r(t),a.d(t,{assets:function(){return d},contentTitle:function(){return l},default:function(){return h},frontMatter:function(){return s},metadata:function(){return m},toc:function(){return p}});var i=a(3117),n=a(102),r=(a(7294),a(3905)),o=["components"],s={},l="Automated Market Maker (AMM)",m={unversionedId:"web3/automated-market-maker",id:"web3/automated-market-maker",title:"Automated Market Maker (AMM)",description:"First of all, What is a Market Maker?",source:"@site/docs/web3/automated-market-maker.mdx",sourceDirName:"web3",slug:"/web3/automated-market-maker",permalink:"/shaokiat-blog/docs/web3/automated-market-maker",draft:!1,editUrl:"https://github.com/shaokiat/shaokiat-blog/tree/main/docs/web3/automated-market-maker.mdx",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"You-Dont-Know-JS",permalink:"/shaokiat-blog/docs/web-dev/you-dont-know-js"},next:{title:"InterPlanetary File System (IPFS)",permalink:"/shaokiat-blog/docs/web3/ipfs"}},d={},p=[{value:"First of all, What is a Market Maker?",id:"first-of-all-what-is-a-market-maker",level:2},{value:"So what is an Automated Market Maker (AMM)?",id:"so-what-is-an-automated-market-maker-amm",level:2},{value:"How does Automated Market Maker work?",id:"how-does-automated-market-maker-work",level:3},{value:"Liquidity Pool and Liquidity Provider (LP)",id:"liquidity-pool-and-liquidity-provider-lp",level:3},{value:"What is a liquidity pool?",id:"what-is-a-liquidity-pool",level:4},{value:"Who are the liquidity providers (LP)?",id:"who-are-the-liquidity-providers-lp",level:4},{value:"Pricing algorithm in AMM",id:"pricing-algorithm-in-amm",level:3},{value:"Slippage",id:"slippage",level:4},{value:"Impermanent Loss",id:"impermanent-loss",level:3}],c={toc:p};function h(e){var t=e.components,a=(0,n.Z)(e,o);return(0,r.kt)("wrapper",(0,i.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"automated-market-maker-amm"},"Automated Market Maker (AMM)"),(0,r.kt)("h2",{id:"first-of-all-what-is-a-market-maker"},"First of all, What is a ",(0,r.kt)("a",{parentName:"h2",href:"https://www.investopedia.com/terms/m/marketmaker.asp#:~:text=The%20term%20market%20maker%20refers,in%20the%20bid%2Dask%20spread."},"Market Maker"),"?"),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"market maker")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"The term market maker refers to a firm (often centralized) or individual who actively quotes two-sided markets\nin a particular asset, providing bids and asks along with the market size of each. Market makers provide liquidity and depth\nto markets and profit from the difference in the bid-ask spread."))),(0,r.kt)("div",{align:"center"},(0,r.kt)("img",{src:"/shaokiat-blog/img/web/marketmaker.jpg",alt:"evolution",width:"700"})),(0,r.kt)("div",{align:"center",width:"700",textAlign:"left",style:{}},"Source:",(0,r.kt)("a",{href:"https://blog.aax.com/en/2019/04/25/market-makers/"}," AAX")),(0,r.kt)("p",null,"If you have experience in trading securities, you would have encountered the bids and asks as shown by your brokerage firms,\nwhich are often the market makers as well. Once the market maker receives an order from a buyer, they immediately sell off their\nposition of shares from their own inventory, completing the order."),(0,r.kt)("p",null,"Market making facilitates a smoother flow of financial markets by making it easier\nfor investors and traders to buy and sell. These market makers are an essential part of the stock market as\nthey keep the financial markets liquid."),(0,r.kt)("p",null,"For further details on market makers, head over to ",(0,r.kt)("a",{parentName:"p",href:"https://www.investopedia.com/terms/m/marketmaker.asp#:~:text=The%20term%20market%20maker%20refers,in%20the%20bid%2Dask%20spread."},"Investopedia"),"."),(0,r.kt)("h2",{id:"so-what-is-an-automated-market-maker-amm"},"So what is an ",(0,r.kt)("a",{parentName:"h2",href:"https://academy.binance.com/en/articles/what-is-an-automated-market-maker-amm"},"Automated Market Maker")," (AMM)?"),(0,r.kt)("p",null,"I am sure many of us are wondering, how is the price of a cryptocurrency on a ",(0,r.kt)("a",{parentName:"p",href:"https://www.investopedia.com/decentralized-finance-defi-5113835#:~:text=Decentralized%20finance%20(DeFi)%20is%20an,to%20those%20used%20by%20cryptocurrencies.&text=It%20eliminates%20the%20fees%20that,keeping%20it%20in%20a%20bank."},"Decentralized Finance"),"\n(DeFi) determined, without the help of a centralized exchange that serves as its market maker?"),(0,r.kt)("p",null,"The answer to this question is the adoption of ",(0,r.kt)("strong",{parentName:"p"},"Automated Market Makers"),"."),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"automated market maker")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"An automated market maker (AMM) is a type of ",(0,r.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Decentralized_exchange"},"decentralized exchange")," (DEX) protocol that relies on a mathematical formula to price assets.\nInstead of using an order book like a traditional exchange, assets are priced according to a ",(0,r.kt)("a",{parentName:"p",href:"#pricing-algorithm-in-amm"},(0,r.kt)("strong",{parentName:"a"},"pricing algorithm")),"."))),(0,r.kt)("h3",{id:"how-does-automated-market-maker-work"},"How does Automated Market Maker work?"),(0,r.kt)("p",null,"An AMM work similarly to an order book exchange in that there are trading pairs. However, the difference is that there is no need\nfor a counterparty on the other side to complete a trade. Instead, traders interact with the AMM which is a smart contract that acts\nas the market maker. Binance Academy refers to this as ",(0,r.kt)("a",{parentName:"p",href:"https://academy.binance.com/en/articles/what-is-an-automated-market-maker-amm"},(0,r.kt)("em",{parentName:"a"},"peer-to-contract (P2C)")),"."),(0,r.kt)("h3",{id:"liquidity-pool-and-liquidity-provider-lp"},"Liquidity Pool and Liquidity Provider (LP)"),(0,r.kt)("h4",{id:"what-is-a-liquidity-pool"},"What is a liquidity pool?"),(0,r.kt)("p",null,"Liquidity pools represent different trading pairs, for example, ETH/BNB. AMM uses these liquidity pools to facilitate trading. As mentioned previously,\ntrading on the Decentralized Exchange (DEX) is basically making a trade with the smart contract which holds these liquidity pools."),(0,r.kt)("h4",{id:"who-are-the-liquidity-providers-lp"},"Who are the liquidity providers (LP)?"),(0,r.kt)("p",null,"Liquidity providers (LP) provide funds to liquidity pools, in exchange for fees from the trades that happen in the pools. This serves\nas an incentive for more liquidity providers, which will in turn reduce the price impact and ",(0,r.kt)("a",{parentName:"p",href:"#slippage"},"slippage"),", a key criteria for the AMM."),(0,r.kt)("h3",{id:"pricing-algorithm-in-amm"},"Pricing algorithm in AMM"),(0,r.kt)("p",null,"I will be using the most popular DEX protocol as of date, ",(0,r.kt)("a",{parentName:"p",href:"https://uniswap.org/"},"Uniswap")," as an example.\nSee also: ",(0,r.kt)("a",{parentName:"p",href:"https://docs.uniswap.org/protocol/V2/concepts/advanced-topics/pricing"},"UniswapV2 Pricing"),"."),(0,r.kt)("div",{align:"center"},(0,r.kt)("img",{src:"/shaokiat-blog/img/web/pricing-algo.png",alt:"pricing-algo",width:"600"})),(0,r.kt)("div",{align:"center",width:"700",textAlign:"left",style:{}},"Source:",(0,r.kt)("a",{href:"https://doc.openswap.xyz/support-and-faq/swapping-guide"}," ","OpenSwap")),(0,r.kt)("p",null,"The AMM allows anyone to deposit or withdraw tokens from them, but only according to very specific rules set in the smart contract.\nOne such rule is the ",(0,r.kt)("a",{parentName:"p",href:"https://docs.uniswap.org/protocol/V2/concepts/advanced-topics/pricing"},(0,r.kt)("strong",{parentName:"a"},"constant product formula")),": ",(0,r.kt)("inlineCode",{parentName:"p"},"x * y = const"),",\nwhere x and y are the reserves of two tokens in the liquidity pool."),(0,r.kt)("div",{className:"admonition admonition-important alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"trade")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"In order to withdraw some amount of token X, one must deposit (buy with) a proportional amount of token Y to maintain the constant ",(0,r.kt)("inlineCode",{parentName:"p"},"k"),".\nThe price is determined by the ratio between these two tokens."))),(0,r.kt)("h4",{id:"slippage"},"Slippage"),(0,r.kt)("p",null,"As mentioned earlier, pricing is determined by an algorithm, which also means that it is determined by how much the ratio between the\ntokens in the liquidity pool changes after a trade. If the ratio changes by a large amount, there is going to be a large amount of slippage."),(0,r.kt)("p",null,"Tokens in liquidity pool with low liquidity is likely to suffer from ",(0,r.kt)("strong",{parentName:"p"},"high slippage"),", as the ratio is easily affected by the trades.\nOn the other hand, tokens in liquidity pool with high liquidity is likely to have ",(0,r.kt)("strong",{parentName:"p"},"low slippage"),", which is desirable for traders and investors\nas they can more accurately determine their trade price."),(0,r.kt)("h3",{id:"impermanent-loss"},(0,r.kt)("a",{parentName:"h3",href:"https://academy.binance.com/en/articles/impermanent-loss-explained"},"Impermanent Loss")),(0,r.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"pitfall of liquidity provider (LP)")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Impermanent loss is a misleading term which can be very ",(0,r.kt)("strong",{parentName:"p"},"costly")," for liquidity providers (LPs) and LPs will need to keep this concept\ndear to them. It is called impermanent loss as the losses only became realized once you withdraw your tokens from the liquidity pools, much like unrealized loss."))),(0,r.kt)("p",null,"Impermanent loss happens when you provide liquidity to a liquidity pool, and the price of your deposited tokens ",(0,r.kt)("em",{parentName:"p"},"changes")," compared to when you\ndeposited them. The ",(0,r.kt)("em",{parentName:"p"},"bigger")," the change, the ",(0,r.kt)("em",{parentName:"p"},"bigger")," the impermanent loss."),(0,r.kt)("p",null,"For example, if you provided 10% liquidity to a liquidity pool and the ratio of token X and Y is ",(0,r.kt)("inlineCode",{parentName:"p"},"1:10"),", when the ratio of token X and Y changes to let's\nsay ",(0,r.kt)("inlineCode",{parentName:"p"},"1:5"),", you will receive the same 10% liquidity of the liquidity pool at the ratio ",(0,r.kt)("inlineCode",{parentName:"p"},"1:5")," when you withdraw your liquidity."),(0,r.kt)("p",null,"This can lead to scenarios where it is better off to ",(0,r.kt)("em",{parentName:"p"},"HODL")," the tokens instead of staking them in the liquidity pools."),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Binance Academy has a ",(0,r.kt)("a",{parentName:"p",href:"https://academy.binance.com/en/articles/impermanent-loss-explained"},(0,r.kt)("strong",{parentName:"a"},"wonderful illustration"))," of this impermanent loss."))))}h.isMDXComponent=!0},3905:function(e,t,a){a.d(t,{Zo:function(){return d},kt:function(){return h}});var i=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,i)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,i,n=function(e,t){if(null==e)return{};var a,i,n={},r=Object.keys(e);for(i=0;i<r.length;i++)a=r[i],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)a=r[i],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=i.createContext({}),m=function(e){var t=i.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},d=function(e){var t=m(e.components);return i.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},c=i.forwardRef((function(e,t){var a=e.components,n=e.mdxType,r=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),c=m(a),h=n,k=c["".concat(l,".").concat(h)]||c[h]||p[h]||r;return a?i.createElement(k,o(o({ref:t},d),{},{components:a})):i.createElement(k,o({ref:t},d))}));function h(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=a.length,o=new Array(r);o[0]=c;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:n,o[1]=s;for(var m=2;m<r;m++)o[m]=a[m];return i.createElement.apply(null,o)}return i.createElement.apply(null,a)}c.displayName="MDXCreateElement"}}]);