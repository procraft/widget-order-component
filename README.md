## Deploy

Just run Node16 `npm version minor|patch`
Just run Node18 `NODE_OPTIONS=--openssl-legacy-provider npm version minor|patch`

## Пример использования

### Добавьте на страницу код

```js
<script>!function(e){function r(r){for(var n,p,c=r[0],i=r[1],l=r[2],f=0,s=[];f<c.length;f++)p=c[f],Object.prototype.hasOwnProperty.call(o,p)&#038;&#038;o[p]&#038;&#038;s.push(o[p][0]),o[p]=0;for(n in i)Object.prototype.hasOwnProperty.call(i,n)&#038;&#038;(e[n]=i[n]);for(a&#038;&#038;a(r);s.length;)s.shift()();return u.push.apply(u,l||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,c=1;c<t.length;c++){var i=t[c];0!==o[i]&#038;&#038;(n=!1)}n&#038;&#038;(u.splice(r--,1),e=p(p.s=t[0]))}return e}var n={},o={1:0},u=[];function p(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,p),t.l=!0,t.exports}p.m=e,p.c=n,p.d=function(e,r,t){p.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},p.r=function(e){"undefined"!=typeof Symbol&#038;&#038;Symbol.toStringTag&#038;&#038;Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},p.t=function(e,r){if(1&#038;r&#038;&#038;(e=p(e)),8&#038;r)return e;if(4&#038;r&#038;&#038;"object"==typeof e&#038;&#038;e&#038;&#038;e.__esModule)return e;var t=Object.create(null);if(p.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&#038;r&#038;&#038;"string"!=typeof e)for(var n in e)p.d(t,n,function(r){return e[r]}.bind(null,n));return t},p.n=function(e){var r=e&#038;&#038;e.__esModule?function(){return e.default}:function(){return e};return p.d(r,"a",r),r},p.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},p.p="https://unpkg.com/@procraft/widget-order-component@latest/build/";var c=this["webpackJsonp@procraft/widget-order-component"]=this["webpackJsonp@procraft/widget-order-component"]||[],i=c.push.bind(c);c.push=r,c=c.slice();for(var l=0;l<c.length;l++)r(c[l]);var a=i;t()}([])</script>
<script>!function(e){function r(r){for(var n,p,c=r[0],i=r[1],l=r[2],f=0,s=[];f<c.length;f++)p=c[f],Object.prototype.hasOwnProperty.call(o,p)&&o[p]&&s.push(o[p][0]),o[p]=0;for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n]);for(a&&a(r);s.length;)s.shift()();return u.push.apply(u,l||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,c=1;c<t.length;c++){var i=t[c];0!==o[i]&&(n=!1)}n&&(u.splice(r--,1),e=p(p.s=t[0]))}return e}var n={},o={1:0},u=[];function p(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,p),t.l=!0,t.exports}p.m=e,p.c=n,p.d=function(e,r,t){p.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},p.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},p.t=function(e,r){if(1&r&&(e=p(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(p.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)p.d(t,n,function(r){return e[r]}.bind(null,n));return t},p.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return p.d(r,"a",r),r},p.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},p.p="https://unpkg.com/@procraft/widget-order-component@latest/build/";var c=this["webpackJsonp@procraft/widget-order-component"]=this["webpackJsonp@procraft/widget-order-component"]||[],i=c.push.bind(c);c.push=r,c=c.slice();for(var l=0;l<c.length;l++)r(c[l]);var a=i;t()}([])</script>

<script src="https://unpkg.com/@procraft/widget-order-component@latest/build/static/js/2.chunk.js"></script>

<script src="https://unpkg.com/@procraft/widget-order-component@latest/build/static/js/main.chunk.js"></script>
```

## В нужной части страницы вставьте тег с нужными параметрами. Пример

```html
<widget-order site_url="https://soho.mba" course_uid="11" catalog_item_uid="49"></widget-order>

```
