"use strict";(self.webpackChunkmongodb_rag_docs=self.webpackChunkmongodb_rag_docs||[]).push([[2711],{4750:function(e,r,t){t.r(r),t.d(r,{default:function(){return m}});t(6540);var n=t(6289),a=t(539),s=t(1082),i=t(8569),c=t(1410),o=t(9303),l=t(4848);function d(e){let{year:r,posts:t}=e;const a=(0,i.i)({day:"numeric",month:"long",timeZone:"UTC"});return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(o.A,{as:"h3",id:r,children:r}),(0,l.jsx)("ul",{children:t.map((e=>{return(0,l.jsx)("li",{children:(0,l.jsxs)(n.A,{to:e.metadata.permalink,children:[(r=e.metadata.date,a.format(new Date(r)))," - ",e.metadata.title]})},e.metadata.date);var r}))})]})}function h(e){let{years:r}=e;return(0,l.jsx)("section",{className:"margin-vert--lg",children:(0,l.jsx)("div",{className:"container",children:(0,l.jsx)("div",{className:"row",children:r.map(((e,r)=>(0,l.jsx)("div",{className:"col col--4 margin-vert--lg",children:(0,l.jsx)(d,{...e})},r)))})})})}function m(e){let{archive:r}=e;const t=(0,a.T)({id:"theme.blog.archive.title",message:"Archive",description:"The page & hero title of the blog archive page"}),n=(0,a.T)({id:"theme.blog.archive.description",message:"Archive",description:"The page & hero description of the blog archive page"}),i=function(e){const r=e.reduce(((e,r)=>{const t=r.metadata.date.split("-")[0],n=e.get(t)??[];return e.set(t,[r,...n])}),new Map);return Array.from(r,(e=>{let[r,t]=e;return{year:r,posts:t}}))}(r.blogPosts);return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(s.be,{title:t,description:n}),(0,l.jsxs)(c.A,{children:[(0,l.jsx)("header",{className:"hero hero--primary",children:(0,l.jsxs)("div",{className:"container",children:[(0,l.jsx)(o.A,{as:"h1",className:"hero__title",children:t}),(0,l.jsx)("p",{className:"hero__subtitle",children:n})]})}),(0,l.jsx)("main",{children:i.length>0&&(0,l.jsx)(h,{years:i})})]})]})}},8569:function(e,r,t){t.d(r,{i:function(){return a}});var n=t(797);function a(e){void 0===e&&(e={});const{i18n:{currentLocale:r}}=(0,n.A)(),t=function(){const{i18n:{currentLocale:e,localeConfigs:r}}=(0,n.A)();return r[e].calendar}();return new Intl.DateTimeFormat(r,{calendar:t,...e})}}}]);