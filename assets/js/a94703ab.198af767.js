"use strict";(self.webpackChunkmongodb_rag_docs=self.webpackChunkmongodb_rag_docs||[]).push([[48],{1841:function(e,t,n){n.r(t),n.d(t,{default:function(){return pe}});var a=n(6540),i=n(8215),o=n(1769),s=n(204),r=n(102),l=n(2306),c=n(539),d=n(5627),u=n(7685);var m={backToTopButton:"backToTopButton_sjWU",backToTopButtonShow:"backToTopButtonShow_xfvO"},b=n(4848);function h(){const{shown:e,scrollToTop:t}=function(e){let{threshold:t}=e;const[n,i]=(0,a.useState)(!1),o=(0,a.useRef)(!1),{startScroll:s,cancelScroll:r}=(0,d.gk)();return(0,d.Mq)(((e,n)=>{let{scrollY:a}=e;const s=n?.scrollY;s&&(o.current?o.current=!1:a>=s?(r(),i(!1)):a<t?i(!1):a+window.innerHeight<document.documentElement.scrollHeight&&i(!0))})),(0,u.$)((e=>{e.location.hash&&(o.current=!0,i(!1))})),{shown:n,scrollToTop:()=>s(0)}}({threshold:300});return(0,b.jsx)("button",{"aria-label":(0,c.T)({id:"theme.BackToTopButton.buttonAriaLabel",message:"Scroll back to top",description:"The ARIA label for the back to top button"}),className:(0,i.A)("clean-btn",s.G.common.backToTopButton,m.backToTopButton,e&&m.backToTopButtonShow),type:"button",onClick:t})}var p=n(4924),x=n(6347),f=n(6682),v=n(3115),j=n(2862);function _(e){return(0,b.jsx)("svg",{width:"20",height:"20","aria-hidden":"true",...e,children:(0,b.jsxs)("g",{fill:"#7a7a7a",children:[(0,b.jsx)("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),(0,b.jsx)("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})]})})}var g="collapseSidebarButton_PEFL",A="collapseSidebarButtonIcon_kv0_";function C(e){let{onClick:t}=e;return(0,b.jsx)("button",{type:"button",title:(0,c.T)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,c.T)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,i.A)("button button--secondary button--outline",g),onClick:t,children:(0,b.jsx)(_,{className:A})})}var k=n(3380),S=n(6849);const T=Symbol("EmptyContext"),N=a.createContext(T);function I(e){let{children:t}=e;const[n,i]=(0,a.useState)(null),o=(0,a.useMemo)((()=>({expandedItem:n,setExpandedItem:i})),[n]);return(0,b.jsx)(N.Provider,{value:o,children:t})}var y=n(3535),B=n(214),w=n(6289),L=n(9136);function E(e){let{collapsed:t,categoryLabel:n,onClick:a}=e;return(0,b.jsx)("button",{"aria-label":t?(0,c.T)({id:"theme.DocSidebarItem.expandCategoryAriaLabel",message:"Expand sidebar category '{label}'",description:"The ARIA label to expand the sidebar category"},{label:n}):(0,c.T)({id:"theme.DocSidebarItem.collapseCategoryAriaLabel",message:"Collapse sidebar category '{label}'",description:"The ARIA label to collapse the sidebar category"},{label:n}),"aria-expanded":!t,type:"button",className:"clean-btn menu__caret",onClick:a})}function M(e){let{item:t,onItemClick:n,activePath:o,level:l,index:c,...d}=e;const{items:u,label:m,collapsible:h,className:p,href:x}=t,{docs:{sidebar:{autoCollapseCategories:f}}}=(0,v.p)(),j=function(e){const t=(0,L.A)();return(0,a.useMemo)((()=>e.href&&!e.linkUnlisted?e.href:!t&&e.collapsible?(0,r.Nr)(e):void 0),[e,t])}(t),_=(0,r.w8)(t,o),g=(0,B.ys)(x,o),{collapsed:A,setCollapsed:C}=(0,y.u)({initialState:()=>!!h&&(!_&&t.collapsed)}),{expandedItem:k,setExpandedItem:I}=function(){const e=(0,a.useContext)(N);if(e===T)throw new S.dV("DocSidebarItemsExpandedStateProvider");return e}(),M=function(e){void 0===e&&(e=!A),I(e?null:c),C(e)};return function(e){let{isActive:t,collapsed:n,updateCollapsed:i}=e;const o=(0,S.ZC)(t);(0,a.useEffect)((()=>{t&&!o&&n&&i(!1)}),[t,o,n,i])}({isActive:_,collapsed:A,updateCollapsed:M}),(0,a.useEffect)((()=>{h&&null!=k&&k!==c&&f&&C(!0)}),[h,k,c,C,f]),(0,b.jsxs)("li",{className:(0,i.A)(s.G.docs.docSidebarItemCategory,s.G.docs.docSidebarItemCategoryLevel(l),"menu__list-item",{"menu__list-item--collapsed":A},p),children:[(0,b.jsxs)("div",{className:(0,i.A)("menu__list-item-collapsible",{"menu__list-item-collapsible--active":g}),children:[(0,b.jsx)(w.A,{className:(0,i.A)("menu__link",{"menu__link--sublist":h,"menu__link--sublist-caret":!x&&h,"menu__link--active":_}),onClick:h?e=>{n?.(t),x?M(!1):(e.preventDefault(),M())}:()=>{n?.(t)},"aria-current":g?"page":void 0,role:h&&!x?"button":void 0,"aria-expanded":h&&!x?!A:void 0,href:h?j??"#":j,...d,children:m}),x&&h&&(0,b.jsx)(E,{collapsed:A,categoryLabel:m,onClick:e=>{e.preventDefault(),M()}})]}),(0,b.jsx)(y.N,{lazy:!0,as:"ul",className:"menu__list",collapsed:A,children:(0,b.jsx)(V,{items:u,tabIndex:A?-1:0,onItemClick:n,activePath:o,level:l+1})})]})}var H=n(2887),G=n(5891),P="menuExternalLink_NmtK";function R(e){let{item:t,onItemClick:n,activePath:a,level:o,index:l,...c}=e;const{href:d,label:u,className:m,autoAddBaseUrl:h}=t,p=(0,r.w8)(t,a),x=(0,H.A)(d);return(0,b.jsx)("li",{className:(0,i.A)(s.G.docs.docSidebarItemLink,s.G.docs.docSidebarItemLinkLevel(o),"menu__list-item",m),children:(0,b.jsxs)(w.A,{className:(0,i.A)("menu__link",!x&&P,{"menu__link--active":p}),autoAddBaseUrl:h,"aria-current":p?"page":void 0,to:d,...x&&{onClick:n?()=>n(t):void 0},...c,children:[u,!x&&(0,b.jsx)(G.A,{})]})},u)}var W="menuHtmlItem_M9Kj";function D(e){let{item:t,level:n,index:a}=e;const{value:o,defaultStyle:r,className:l}=t;return(0,b.jsx)("li",{className:(0,i.A)(s.G.docs.docSidebarItemLink,s.G.docs.docSidebarItemLinkLevel(n),r&&[W,"menu__list-item"],l),dangerouslySetInnerHTML:{__html:o}},a)}function F(e){let{item:t,...n}=e;switch(t.type){case"category":return(0,b.jsx)(M,{item:t,...n});case"html":return(0,b.jsx)(D,{item:t,...n});default:return(0,b.jsx)(R,{item:t,...n})}}function U(e){let{items:t,...n}=e;const a=(0,r.Y)(t,n.activePath);return(0,b.jsx)(I,{children:a.map(((e,t)=>(0,b.jsx)(F,{item:e,index:t,...n},t)))})}var V=(0,a.memo)(U),Y="menu_SIkG",K="menuWithAnnouncementBar_GW3s";function z(e){let{path:t,sidebar:n,className:o}=e;const r=function(){const{isActive:e}=(0,k.M)(),[t,n]=(0,a.useState)(e);return(0,d.Mq)((t=>{let{scrollY:a}=t;e&&n(0===a)}),[e]),e&&t}();return(0,b.jsx)("nav",{"aria-label":(0,c.T)({id:"theme.docs.sidebar.navAriaLabel",message:"Docs sidebar",description:"The ARIA label for the sidebar navigation"}),className:(0,i.A)("menu thin-scrollbar",Y,r&&K,o),children:(0,b.jsx)("ul",{className:(0,i.A)(s.G.docs.docSidebarMenu,"menu__list"),children:(0,b.jsx)(V,{items:n,activePath:t,level:1})})})}var q="sidebar_njMd",O="sidebarWithHideableNavbar_wUlq",J="sidebarHidden_VK0M",Q="sidebarLogo_isFc";function X(e){let{path:t,sidebar:n,onCollapse:a,isHidden:o}=e;const{navbar:{hideOnScroll:s},docs:{sidebar:{hideable:r}}}=(0,v.p)();return(0,b.jsxs)("div",{className:(0,i.A)(q,s&&O,o&&J),children:[s&&(0,b.jsx)(j.A,{tabIndex:-1,className:Q}),(0,b.jsx)(z,{path:t,sidebar:n}),r&&(0,b.jsx)(C,{onClick:a})]})}var Z=a.memo(X),$=n(3065),ee=n(4635);const te=e=>{let{sidebar:t,path:n}=e;const a=(0,ee.M)();return(0,b.jsx)("ul",{className:(0,i.A)(s.G.docs.docSidebarMenu,"menu__list"),children:(0,b.jsx)(V,{items:t,activePath:n,onItemClick:e=>{"category"===e.type&&e.href&&a.toggle(),"link"===e.type&&a.toggle()},level:1})})};function ne(e){return(0,b.jsx)($.GX,{component:te,props:e})}var ae=a.memo(ne);function ie(e){const t=(0,f.l)(),n="desktop"===t||"ssr"===t,a="mobile"===t;return(0,b.jsxs)(b.Fragment,{children:[n&&(0,b.jsx)(Z,{...e}),a&&(0,b.jsx)(ae,{...e})]})}var oe={expandButton:"expandButton_TmdG",expandButtonIcon:"expandButtonIcon_i1dp"};function se(e){let{toggleSidebar:t}=e;return(0,b.jsx)("div",{className:oe.expandButton,title:(0,c.T)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,c.T)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:t,onClick:t,children:(0,b.jsx)(_,{className:oe.expandButtonIcon})})}var re={docSidebarContainer:"docSidebarContainer_YfHR",docSidebarContainerHidden:"docSidebarContainerHidden_DPk8",sidebarViewport:"sidebarViewport_aRkj"};function le(e){let{children:t}=e;const n=(0,l.t)();return(0,b.jsx)(a.Fragment,{children:t},n?.name??"noSidebar")}function ce(e){let{sidebar:t,hiddenSidebarContainer:n,setHiddenSidebarContainer:o}=e;const{pathname:r}=(0,x.zy)(),[l,c]=(0,a.useState)(!1),d=(0,a.useCallback)((()=>{l&&c(!1),!l&&(0,p.O)()&&c(!0),o((e=>!e))}),[o,l]);return(0,b.jsx)("aside",{className:(0,i.A)(s.G.docs.docSidebarContainer,re.docSidebarContainer,n&&re.docSidebarContainerHidden),onTransitionEnd:e=>{e.currentTarget.classList.contains(re.docSidebarContainer)&&n&&c(!0)},children:(0,b.jsx)(le,{children:(0,b.jsxs)("div",{className:(0,i.A)(re.sidebarViewport,l&&re.sidebarViewportHidden),children:[(0,b.jsx)(ie,{sidebar:t,path:r,onCollapse:d,isHidden:l}),l&&(0,b.jsx)(se,{toggleSidebar:d})]})})})}var de={docMainContainer:"docMainContainer_TBSr",docMainContainerEnhanced:"docMainContainerEnhanced_lQrH",docItemWrapperEnhanced:"docItemWrapperEnhanced_JWYK"};function ue(e){let{hiddenSidebarContainer:t,children:n}=e;const a=(0,l.t)();return(0,b.jsx)("main",{className:(0,i.A)(de.docMainContainer,(t||!a)&&de.docMainContainerEnhanced),children:(0,b.jsx)("div",{className:(0,i.A)("container padding-top--md padding-bottom--lg",de.docItemWrapper,t&&de.docItemWrapperEnhanced),children:n})})}var me={docRoot:"docRoot_UBD9",docsWrapper:"docsWrapper_hBAB"};function be(e){let{children:t}=e;const n=(0,l.t)(),[i,o]=(0,a.useState)(!1);return(0,b.jsxs)("div",{className:me.docsWrapper,children:[(0,b.jsx)(h,{}),(0,b.jsxs)("div",{className:me.docRoot,children:[n&&(0,b.jsx)(ce,{sidebar:n.items,hiddenSidebarContainer:i,setHiddenSidebarContainer:o}),(0,b.jsx)(ue,{hiddenSidebarContainer:i,children:t})]})]})}var he=n(5932);function pe(e){const t=(0,r.B5)(e);if(!t)return(0,b.jsx)(he.A,{});const{docElement:n,sidebarName:a,sidebarItems:c}=t;return(0,b.jsx)(o.e3,{className:(0,i.A)(s.G.page.docsDocPage),children:(0,b.jsx)(l.V,{name:a,items:c,children:(0,b.jsx)(be,{children:n})})})}},5932:function(e,t,n){n.d(t,{A:function(){return r}});n(6540);var a=n(8215),i=n(539),o=n(9303),s=n(4848);function r(e){let{className:t}=e;return(0,s.jsx)("main",{className:(0,a.A)("container margin-vert--xl",t),children:(0,s.jsx)("div",{className:"row",children:(0,s.jsxs)("div",{className:"col col--6 col--offset-3",children:[(0,s.jsx)(o.A,{as:"h1",className:"hero__title",children:(0,s.jsx)(i.A,{id:"theme.NotFound.title",description:"The title of the 404 page",children:"Page Not Found"})}),(0,s.jsx)("p",{children:(0,s.jsx)(i.A,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page",children:"We could not find what you were looking for."})}),(0,s.jsx)("p",{children:(0,s.jsx)(i.A,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page",children:"Please contact the owner of the site that linked you to the original URL and let them know their link is broken."})})]})})})}}}]);