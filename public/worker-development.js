/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./worker/index.js":
/*!*************************!*\
  !*** ./worker/index.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval(__webpack_require__.ts("self.addEventListener(\"push\", async (e)=>{\n    const { message, body, icon } = JSON.parse(e.data.text());\n    e.waitUntil(self.registration.showNotification(message, {\n        body,\n        icon\n    }));\n});\nself.addEventListener(\"notificationclick\", (event)=>{\n    event.notification.close();\n    // This looks to see if the current window is already open and\n    // focuses if it is\n    event.waitUntil(clients.matchAll({\n        type: \"window\"\n    }).then((clientList)=>{\n        for (const client of clientList){\n            if (client.url === \"/\" && \"focus\" in client) return client.focus();\n        }\n        if (clients.openWindow) return clients.openWindow(\"/\");\n    }));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi93b3JrZXIvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUFBLEtBQUtDLGdCQUFnQixDQUFDLFFBQVEsT0FBT0M7SUFDcEMsTUFBTSxFQUFFQyxPQUFPLEVBQUVDLElBQUksRUFBRUMsSUFBSSxFQUFFLEdBQUdDLEtBQUtDLEtBQUssQ0FBQ0wsRUFBRU0sSUFBSSxDQUFDQyxJQUFJO0lBRXREUCxFQUFFUSxTQUFTLENBQ1ZWLEtBQUtXLFlBQVksQ0FBQ0MsZ0JBQWdCLENBQUNULFNBQVM7UUFDM0NDO1FBQ0FDO0lBQ0Q7QUFFRjtBQUVBTCxLQUFLQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQ1k7SUFDM0NBLE1BQU1DLFlBQVksQ0FBQ0MsS0FBSztJQUV4Qiw4REFBOEQ7SUFDOUQsbUJBQW1CO0lBQ25CRixNQUFNSCxTQUFTLENBQ2RNLFFBQ0VDLFFBQVEsQ0FBQztRQUNUQyxNQUFNO0lBQ1AsR0FDQ0MsSUFBSSxDQUFDLENBQUNDO1FBQ04sS0FBSyxNQUFNQyxVQUFVRCxXQUFZO1lBQ2hDLElBQUlDLE9BQU9DLEdBQUcsS0FBSyxPQUFPLFdBQVdELFFBQ3BDLE9BQU9BLE9BQU9FLEtBQUs7UUFDckI7UUFDQSxJQUFJUCxRQUFRUSxVQUFVLEVBQUUsT0FBT1IsUUFBUVEsVUFBVSxDQUFDO0lBQ25EO0FBRUgiLCJzb3VyY2VzIjpbIkQ6XFxSZXNlYXJjaFxcTmV4dC5Kc1xcV29ya3NwYWNlc1xcc29jaWFsLWFwcFxcd29ya2VyXFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJzZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJwdXNoXCIsIGFzeW5jIChlKSA9PiB7XHJcblx0Y29uc3QgeyBtZXNzYWdlLCBib2R5LCBpY29uIH0gPSBKU09OLnBhcnNlKGUuZGF0YS50ZXh0KCkpO1xyXG5cclxuXHRlLndhaXRVbnRpbChcclxuXHRcdHNlbGYucmVnaXN0cmF0aW9uLnNob3dOb3RpZmljYXRpb24obWVzc2FnZSwge1xyXG5cdFx0XHRib2R5LFxyXG5cdFx0XHRpY29uLFxyXG5cdFx0fSlcclxuXHQpO1xyXG59KTtcclxuXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcIm5vdGlmaWNhdGlvbmNsaWNrXCIsIChldmVudCkgPT4ge1xyXG5cdGV2ZW50Lm5vdGlmaWNhdGlvbi5jbG9zZSgpO1xyXG5cclxuXHQvLyBUaGlzIGxvb2tzIHRvIHNlZSBpZiB0aGUgY3VycmVudCB3aW5kb3cgaXMgYWxyZWFkeSBvcGVuIGFuZFxyXG5cdC8vIGZvY3VzZXMgaWYgaXQgaXNcclxuXHRldmVudC53YWl0VW50aWwoXHJcblx0XHRjbGllbnRzXHJcblx0XHRcdC5tYXRjaEFsbCh7XHJcblx0XHRcdFx0dHlwZTogXCJ3aW5kb3dcIixcclxuXHRcdFx0fSlcclxuXHRcdFx0LnRoZW4oKGNsaWVudExpc3QpID0+IHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IGNsaWVudCBvZiBjbGllbnRMaXN0KSB7XHJcblx0XHRcdFx0XHRpZiAoY2xpZW50LnVybCA9PT0gXCIvXCIgJiYgXCJmb2N1c1wiIGluIGNsaWVudClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGNsaWVudC5mb2N1cygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoY2xpZW50cy5vcGVuV2luZG93KSByZXR1cm4gY2xpZW50cy5vcGVuV2luZG93KFwiL1wiKTtcclxuXHRcdFx0fSlcclxuXHQpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbInNlbGYiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsIm1lc3NhZ2UiLCJib2R5IiwiaWNvbiIsIkpTT04iLCJwYXJzZSIsImRhdGEiLCJ0ZXh0Iiwid2FpdFVudGlsIiwicmVnaXN0cmF0aW9uIiwic2hvd05vdGlmaWNhdGlvbiIsImV2ZW50Iiwibm90aWZpY2F0aW9uIiwiY2xvc2UiLCJjbGllbnRzIiwibWF0Y2hBbGwiLCJ0eXBlIiwidGhlbiIsImNsaWVudExpc3QiLCJjbGllbnQiLCJ1cmwiLCJmb2N1cyIsIm9wZW5XaW5kb3ciXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./worker/index.js\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	(() => {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = () => {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: (script) => (script)
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	(() => {
/******/ 		__webpack_require__.ts = (script) => (__webpack_require__.tt().createScript(script));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	(() => {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push((options) => {
/******/ 			const originalFactory = options.factory;
/******/ 			options.factory = (moduleObject, moduleExports, webpackRequire) => {
/******/ 				const hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				const cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : () => {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./worker/index.js");
/******/ 	
/******/ })()
;