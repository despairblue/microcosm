module.exports=function(t){function n(e){if(r[e])return r[e].exports;var i=r[e]={exports:{},id:e,loaded:!1};return t[e].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var r={};return n.m=t,n.c=r,n.p="",n(0)}([function(t,n,r){"use strict";n.__esModule=!0;var e=r(12);n.tag=e,n["default"]=r(4)},function(t){"use strict";function n(t,n){if(!t){var r=new Error(n);throw r.framesToPop=1,r}}t.exports=n},function(t,n,r){"use strict";var e=function(t){return t&&t.__esModule?t["default"]:t},i=e(r(1));t.exports={validate:function(t){i("function"==typeof t,"Action "+t+" is not callable, actions should be functions")}}},function(t){"use strict";function n(t,n){var r=void 0===arguments[2]?{}:arguments[2],e=Object.keys(t);return e.reduce(function(r,e){return r[e]=n(t[e],e),r},r)}t.exports=n},function(t,n,r){"use strict";var e=function(t){return t&&t.__esModule?t["default"]:t},i=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var r=arguments[n];for(var e in r)Object.prototype.hasOwnProperty.call(r,e)&&(t[e]=r[e])}return t},o=function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")},u=e(r(2)),s=e(r(5)),a=e(r(6)),c=e(r(1)),f=e(r(7)),l=e(r(8)),p=e(r(9)),h=e(r(3)),d=e(r(10)),v=e(r(11)),g=function(){function t(){o(this,t),p(this),this._state={},this._stores={},this._plugins=[]}return t.prototype.push=function(t){this.commit(this.deserialize(t))},t.prototype.pull=function(t,n){for(var r=arguments.length,e=Array(r>2?r-2:0),i=2;r>i;i++)e[i-2]=arguments[i];var o=this._state[t];return"function"==typeof n?n.call.apply(n,[this,o].concat(e)):o},t.prototype.commit=function(t){this._state=t,this.emit()},t.prototype.prepare=function(t){for(var n,r=arguments.length,e=Array(r>1?r-1:0),i=1;r>i;i++)e[i-1]=arguments[i];return u.validate(t),(n=this.send).bind.apply(n,[this,t].concat(e))},t.prototype.send=function(t){var n=function(){return t.apply(this,arguments)};return n.toString=function(){return t.toString()},n}(function(t){for(var n=arguments.length,r=Array(n>1?n-1:0),e=1;n>e;e++)r[e-1]=arguments[e];return v.apply(void 0,[this,t].concat(r))}),t.prototype.dispatch=function(t,n){var r=this,e=d(this._stores,function(n){return t in n});return Object.keys(e).length>0&&!function(){var i=f(r._state),o=h(e,function(r){return r[t](i[r],n)},i);r.commit(o)}(),n},t.prototype.addPlugin=function(t,n){s.validate(t),this._plugins.push([t,n])},t.prototype.addStore=function(t){var n=i({},a,t);c(!this._stores[t],'Tried to add "'+t+'" but it is not unique'),this._stores[n]=n},t.prototype.serialize=function(){var t=this;return h(this._stores,function(n){return n.serialize(t.pull(n))})},t.prototype.deserialize=function(){var t=void 0===arguments[0]?{}:arguments[0];return h(this._stores,function(n){return n.deserialize(t[n])})},t.prototype.toJSON=function(){return this.serialize()},t.prototype.toObject=function(){return d(this._state,function(){return!0})},t.prototype.start=function(){for(var t=arguments.length,n=Array(t),r=0;t>r;r++)n[r]=arguments[r];this._state=h(this._stores,function(t){return t.getInitialState()}),l(this._plugins,this,function(){n.forEach(function(t){return t()})})},t}();t.exports=g},function(t,n,r){"use strict";var e=function(t){return t&&t.__esModule?t["default"]:t},i=e(r(1));t.exports={validate:function(t){i("register"in t,"Plugins must have a register method.")}}},function(t){"use strict";t.exports={getInitialState:function(){return void 0},serialize:function(t){return t},deserialize:function(){var t=void 0===arguments[0]?this.getInitialState():arguments[0];return t},toString:function(){throw new Error("Stores must implement a toString() method")}}},function(t){"use strict";t.exports=function(t){return Object.create(t)}},function(t){"use strict";function n(t,i,o){var u=e(t),s=u[0],a=u.slice(1);if(!s)return o();var c=r(s,2),f=c[0],l=c[1];f.register(i,l,function(t){if(t)throw t;n(a,i,o)})}var r=function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t)){for(var r,e=[],i=t[Symbol.iterator]();!(r=i.next()).done&&(e.push(r.value),!n||e.length!==n););return e}throw new TypeError("Invalid attempt to destructure non-iterable instance")},e=function(t){return Array.isArray(t)?t:Array.from(t)};t.exports=n},function(t){"use strict";function n(){var t=void 0===arguments[0]?{}:arguments[0],n=[];return t.ignore=function(t){n=n.filter(function(n){return n!==t})},t.listen=function(t){n.push(t)},t.emit=function(){for(var t=0;t<n.length;t++)n[t].call(this)},t}t.exports=n},function(t){"use strict";t.exports=function(t,n){var r={};for(var e in t)n(t[e])&&(r[e]=t[e]);return r}},function(t,n,r){"use strict";var e=function(t){return t&&t.__esModule?t["default"]:t},i=e(r(2));t.exports=function(t,n){for(var r=arguments.length,e=Array(r>2?r-2:0),o=2;r>o;o++)e[o-2]=arguments[o];i.validate(n);var u=n.apply(t,e);return u instanceof Promise?u.then(function(r){return t.dispatch(n,r)}):t.dispatch(n,u)}},function(t,n,r){"use strict";function e(t){return"function"==typeof t}function i(t,n){var r=t.bind(null),e="_"+n+"_"+s++;return r.toString=function(){return e},r}var o=function(t){return t&&t.__esModule?t["default"]:t},u=o(r(3)),s=0;t.exports=function(t){return u(t,function(t,n){return e(t)?i(t,n):t})}}]);
//# sourceMappingURL=Microcosm.js.map