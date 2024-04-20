/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/captchas/captcha-provider.js":
/*!*********************************************!*\
  !*** ./src/js/captchas/captcha-provider.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormieCaptchaProvider: () => (/* binding */ FormieCaptchaProvider)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/js/utils/utils.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var FormieCaptchaProvider = /*#__PURE__*/function () {
  function FormieCaptchaProvider() {
    var _this = this;
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, FormieCaptchaProvider);
    this.initialized = false;
    this.$form = settings.$form;
    this.form = this.$form.form;
    this.isVisible = false;

    // Only initialize the field if it's visible. Use `IntersectionObserver` to check when visible
    // and also when hidden (navigating to other pages) to destroy it.
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].intersectionRatio == 0) {
        _this.isVisible = false;

        // Only call the events if ready
        if (_this.initialized) {
          _this.onHide();
        }
      } else {
        _this.isVisible = true;

        // Only call the events if ready
        if (_this.initialized) {
          _this.onShow();
        }
      }
    }, {
      root: this.$form
    });

    // Watch for when the input is visible/hidden, in the context of the form. But wait a little to start watching
    // to prevent double binding when still loading the form, or hidden behind conditions.
    setTimeout(function () {
      if (typeof _this.getPlaceholders === 'function') {
        _this.getPlaceholders().forEach(function ($placeholder) {
          observer.observe($placeholder);
        });
      }
    }, 500);
  }
  _createClass(FormieCaptchaProvider, [{
    key: "onShow",
    value: function onShow() {}
  }, {
    key: "onHide",
    value: function onHide() {}
  }, {
    key: "createInput",
    value: function createInput() {
      var $div = document.createElement('div');

      // We need to handle re-initializing, so always empty the placeholder to start fresh to prevent duplicate captchas
      this.$placeholder.innerHTML = '';
      this.$placeholder.appendChild($div);
      return $div;
    }
  }]);
  return FormieCaptchaProvider;
}();
window.FormieCaptchaProvider = FormieCaptchaProvider;

/***/ }),

/***/ "./src/js/captchas/inc/defer.js":
/*!**************************************!*\
  !*** ./src/js/captchas/inc/defer.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var defer = function defer() {
  var state = false; // Resolved or not

  var callbacks = [];
  var resolve = function resolve(val) {
    if (state) {
      return;
    }
    state = true;
    for (var i = 0, len = callbacks.length; i < len; i++) {
      callbacks[i](val);
    }
  };
  var then = function then(cb) {
    if (!state) {
      callbacks.push(cb);
      return;
    }
    cb();
  };
  var deferred = {
    resolved: function resolved() {
      return state;
    },
    resolve: resolve,
    promise: {
      then: then
    }
  };
  return deferred;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defer);

/***/ }),

/***/ "./src/js/captchas/inc/hcaptcha.js":
/*!*****************************************!*\
  !*** ./src/js/captchas/inc/hcaptcha.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createHcaptcha: () => (/* binding */ createHcaptcha),
/* harmony export */   hcaptcha: () => (/* binding */ hcaptcha)
/* harmony export */ });
/* harmony import */ var _defer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defer */ "./src/js/captchas/inc/defer.js");

var ownProp = Object.prototype.hasOwnProperty;
function createHcaptcha() {
  var deferred = (0,_defer__WEBPACK_IMPORTED_MODULE_0__["default"])();

  // In order to handle multiple recaptchas on a page, store all renderers (promises)
  // in a central store. When reCAPTCHA is loaded, notify all promises that it's ready.
  if (!window.hcaptchaRenderers) {
    window.hcaptchaRenderers = [];
  }

  // Store the promise in our renderers store
  window.hcaptchaRenderers.push(deferred);
  return {
    notify: function notify() {
      // Be sure to notify all renderers that reCAPTCHA is ready, as soon as at least one is ready
      // As is - as soon as `window.hcaptcha` is available.
      for (var i = 0, len = window.hcaptchaRenderers.length; i < len; i++) {
        window.hcaptchaRenderers[i].resolve();
      }
    },
    wait: function wait() {
      return deferred.promise;
    },
    render: function render(ele, options, cb) {
      this.wait().then(function () {
        cb(window.hcaptcha.render(ele, options));
      });
    },
    reset: function reset(widgetId) {
      if (typeof widgetId === 'undefined') {
        return;
      }
      this.assertLoaded();
      this.wait().then(function () {
        return window.hcaptcha.reset(widgetId);
      });
    },
    execute: function execute(widgetId) {
      if (typeof widgetId === 'undefined') {
        return;
      }
      this.assertLoaded();
      this.wait().then(function () {
        return window.hcaptcha.execute(widgetId);
      });
    },
    executeV3: function executeV3(siteKey) {
      if (typeof siteKey === 'undefined') {
        return;
      }
      this.assertLoaded();
      return window.hcaptcha.execute(siteKey);
    },
    checkRecaptchaLoad: function checkRecaptchaLoad() {
      if (ownProp.call(window, 'hcaptcha') && ownProp.call(window.hcaptcha, 'render')) {
        this.notify();
      }
    },
    assertLoaded: function assertLoaded() {
      if (!deferred.resolved()) {
        throw new Error('ReCAPTCHA has not been loaded');
      }
    }
  };
}
var hcaptcha = createHcaptcha();
if (typeof window !== 'undefined') {
  window.formieHcaptchaOnLoadCallback = hcaptcha.notify;
}

/***/ }),

/***/ "./src/js/utils/utils.js":
/*!*******************************!*\
  !*** ./src/js/utils/utils.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   debounce: () => (/* binding */ debounce),
/* harmony export */   ensureVariable: () => (/* binding */ ensureVariable),
/* harmony export */   eventKey: () => (/* binding */ eventKey),
/* harmony export */   isEmpty: () => (/* binding */ isEmpty),
/* harmony export */   t: () => (/* binding */ t),
/* harmony export */   toBoolean: () => (/* binding */ toBoolean),
/* harmony export */   waitForElement: () => (/* binding */ waitForElement)
/* harmony export */ });
var isEmpty = function isEmpty(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};
var toBoolean = function toBoolean(val) {
  return !/^(?:f(?:alse)?|no?|0+)$/i.test(val) && !!val;
};
var clone = function clone(value) {
  if (value === undefined) {
    return undefined;
  }
  return JSON.parse(JSON.stringify(value));
};
var eventKey = function eventKey(eventName) {
  var namespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (!namespace) {
    namespace = Math.random().toString(36).substr(2, 5);
  }
  return "".concat(eventName, ".").concat(namespace);
};
var t = function t(string) {
  var replacements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (window.FormieTranslations) {
    string = window.FormieTranslations[string] || string;
  }
  return string.replace(/{([a-zA-Z0-9]+)}/g, function (match, p1) {
    if (replacements[p1]) {
      return replacements[p1];
    }
    return match;
  });
};
var ensureVariable = function ensureVariable(variable) {
  var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100000;
  var start = Date.now();

  // Function to allow us to wait for a global variable to be available. Useful for third-party scripts.
  var waitForVariable = function waitForVariable(resolve, reject) {
    if (window[variable]) {
      resolve(window[variable]);
    } else if (timeout && Date.now() - start >= timeout) {
      reject(new Error('timeout'));
    } else {
      setTimeout(waitForVariable.bind(this, resolve, reject), 30);
    }
  };
  return new Promise(waitForVariable);
};
var waitForElement = function waitForElement(selector, $element) {
  $element = $element || document;
  return new Promise(function (resolve) {
    if ($element.querySelector(selector)) {
      return resolve($element.querySelector(selector));
    }
    var observer = new MutationObserver(function (mutations) {
      if ($element.querySelector(selector)) {
        observer.disconnect();
        resolve($element.querySelector(selector));
      }
    });
    observer.observe($element, {
      childList: true,
      subtree: true
    });
  });
};
var debounce = function debounce(func, delay) {
  var timeoutId;
  return function () {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      func.apply(_this, args);
    }, delay);
  };
};

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
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************************!*\
  !*** ./src/js/captchas/hcaptcha.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormieHcaptcha: () => (/* binding */ FormieHcaptcha)
/* harmony export */ });
/* harmony import */ var _inc_hcaptcha__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inc/hcaptcha */ "./src/js/captchas/inc/hcaptcha.js");
/* harmony import */ var _captcha_provider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./captcha-provider */ "./src/js/captchas/captcha-provider.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/js/utils/utils.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var FormieHcaptcha = /*#__PURE__*/function (_FormieCaptchaProvide) {
  _inherits(FormieHcaptcha, _FormieCaptchaProvide);
  function FormieHcaptcha() {
    var _this;
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, FormieHcaptcha);
    _this = _callSuper(this, FormieHcaptcha, [settings]);
    _this.$form = settings.$form;
    _this.form = _this.$form.form;
    _this.siteKey = settings.siteKey;
    _this.size = settings.size;
    _this.language = settings.language;
    _this.loadingMethod = settings.loadingMethod;
    _this.hCaptchaScriptId = 'FORMIE_HCAPTCHA_SCRIPT';

    // We can start listening for the field to become visible to initialize it
    _this.initialized = true;
    return _this;
  }
  _createClass(FormieHcaptcha, [{
    key: "getPlaceholders",
    value: function getPlaceholders() {
      // We can have multiple captchas per form, so store them and render only when we need
      return this.$placeholders = this.$form.querySelectorAll('[data-hcaptcha-placeholder]');
    }
  }, {
    key: "onShow",
    value: function onShow() {
      // Initialize the captcha only when it's visible
      this.initCaptcha();
    }
  }, {
    key: "onHide",
    value: function onHide() {
      // Captcha is hidden, so reset everything
      this.onAfterSubmit();

      // Remove unique event listeners
      this.form.removeEventListener((0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.eventKey)('onFormieCaptchaValidate', 'Hcaptcha'));
      this.form.removeEventListener((0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.eventKey)('onAfterFormieSubmit', 'Hcaptcha'));
    }
  }, {
    key: "initCaptcha",
    value: function initCaptcha() {
      var _this2 = this;
      // Fetch and attach the script only once - this is in case there are multiple forms on the page.
      // They all go to a single callback which resolves its loaded state
      if (!document.getElementById(this.hCaptchaScriptId)) {
        var $script = document.createElement('script');
        $script.id = this.hCaptchaScriptId;
        $script.src = "https://js.hcaptcha.com/1/api.js?onload=formieHcaptchaOnLoadCallback&recaptchacompat=off&render=explicit&hl=".concat(this.language);
        if (this.loadingMethod === 'async' || this.loadingMethod === 'asyncDefer') {
          $script.async = true;
        }
        if (this.loadingMethod === 'defer' || this.loadingMethod === 'asyncDefer') {
          $script.defer = true;
        }

        // Wait until captcha has loaded, then initialize
        $script.onload = function () {
          _this2.renderCaptcha();
        };
        document.body.appendChild($script);
      } else {
        // Ensure that captcha has been loaded and ready to use
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.ensureVariable)('hcaptcha').then(function () {
          _this2.renderCaptcha();
        });
      }
      if (!this.$placeholders.length) {
        console.error('Unable to find any hCaptcha placeholders for [data-hcaptcha-placeholder]');
        return;
      }

      // Attach a custom event listener on the form
      this.form.addEventListener(this.$form, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.eventKey)('onFormieCaptchaValidate', 'Hcaptcha'), this.onValidate.bind(this));
      this.form.addEventListener(this.$form, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.eventKey)('onAfterFormieSubmit', 'Hcaptcha'), this.onAfterSubmit.bind(this));
    }
  }, {
    key: "renderCaptcha",
    value: function renderCaptcha() {
      var _this3 = this;
      // Reset certain things about the captcha, if we're re-running this on the same page without refresh
      this.token = null;
      this.submitHandler = null;
      this.$placeholder = null;

      // Get the active page
      var $currentPage = null;

      // Find the current page, from Formie's JS
      if (this.$form.form.formTheme) {
        // eslint-disable-next-line
        $currentPage = this.$form.form.formTheme.$currentPage;
      }
      var hasMultiplePages = this.$form.form.settings.hasMultiplePages;

      // Get the current page's captcha - find the first placeholder that's non-invisible
      this.$placeholders.forEach(function ($placeholder) {
        if ($currentPage && $currentPage.contains($placeholder)) {
          _this3.$placeholder = $placeholder;
        }
      });

      // If a single-page form, get the first placeholder
      if (!hasMultiplePages && this.$placeholder === null) {
        // eslint-disable-next-line
        this.$placeholder = this.$placeholders[0];
      }
      if (this.$placeholder === null) {
        // This is okay in some instances - notably for multi-page forms where the captcha
        // should only be shown on the last step. But its nice to log this anyway.
        if ($currentPage === null) {
          console.log('Unable to find hCaptcha placeholder for [data-hcaptcha-placeholder]');
        }
        return;
      }

      // Remove any existing token input
      var $token = this.$form.querySelector('[name="h-captcha-response"]');
      if ($token) {
        $token.remove();
      }

      // Render the captcha inside the placeholder
      _inc_hcaptcha__WEBPACK_IMPORTED_MODULE_0__.hcaptcha.render(this.createInput(), {
        sitekey: this.siteKey,
        size: this.size,
        callback: this.onVerify.bind(this),
        'expired-callback': this.onExpired.bind(this),
        'chalexpired-callback': this.onChallengeExpired.bind(this),
        'error-callback': this.onError.bind(this),
        'close-callback': this.onClose.bind(this)
      }, function (id) {
        _this3.hcaptchaId = id;
      });
    }
  }, {
    key: "onValidate",
    value: function onValidate(e) {
      // When not using Formie's theme JS, there's nothing preventing the form from submitting (the theme does).
      // And when the form is submitting, we can't query DOM elements, so stop early so the normal checks work.
      if (!this.$form.form.formTheme) {
        e.preventDefault();

        // Get the submit action from the form hidden input. This is normally taken care of by the theme
        this.form.submitAction = this.$form.querySelector('[name="submitAction"]').value || 'submit';
      }

      // Don't validate if we're not submitting (going back, saving)
      if (this.form.submitAction !== 'submit' || this.$placeholder === null) {
        return;
      }

      // Check if the form has an invalid flag set, don't bother going further
      if (e.detail.invalid) {
        return;
      }
      e.preventDefault();

      // Save for later to trigger real submit
      this.submitHandler = e.detail.submitHandler;

      // Check if the captcha has already been solved (someone clicking on the tick), otherwise the captcha triggeres twice
      if (this.token) {
        this.onVerify(this.token);
      } else {
        // Trigger hCaptcha - or check
        _inc_hcaptcha__WEBPACK_IMPORTED_MODULE_0__.hcaptcha.execute(this.hcaptchaId);
      }
    }
  }, {
    key: "onVerify",
    value: function onVerify(token) {
      // Store the token for a potential next time. This is useful if the user is clicking the tick on the captcha, then
      // submitting, which would trigger the captcha multiple times
      this.token = token;

      // Submit the form - we've hijacked it up until now
      if (this.submitHandler) {
        // Run the next submit action for the form. TODO: make this better!
        if (this.submitHandler.validatePayment()) {
          this.submitHandler.submitForm();
        }
      }
    }
  }, {
    key: "onAfterSubmit",
    value: function onAfterSubmit(e) {
      var _this4 = this;
      // For a multi-page form, we need to remove the current captcha, then render the next pages.
      // For a single-page form, reset the hCaptcha, in case we want to fill out the form again
      // `renderCaptcha` will deal with both cases
      setTimeout(function () {
        _this4.renderCaptcha();
      }, 300);
    }
  }, {
    key: "onExpired",
    value: function onExpired() {
      console.log('hCaptcha has expired - reloading.');
      _inc_hcaptcha__WEBPACK_IMPORTED_MODULE_0__.hcaptcha.reset(this.hcaptchaId);
      this.token = null;
    }
  }, {
    key: "onChallengeExpired",
    value: function onChallengeExpired() {
      console.log('hCaptcha has expired challenge - reloading.');
      _inc_hcaptcha__WEBPACK_IMPORTED_MODULE_0__.hcaptcha.reset(this.hcaptchaId);
      this.token = null;
    }
  }, {
    key: "onError",
    value: function onError(error) {
      console.error('hCaptcha was unable to load');
    }
  }, {
    key: "onClose",
    value: function onClose() {
      if (this.$form.form.formTheme) {
        this.$form.form.formTheme.removeLoading();
      }
      this.token = null;
    }
  }]);
  return FormieHcaptcha;
}(_captcha_provider__WEBPACK_IMPORTED_MODULE_1__.FormieCaptchaProvider);
window.FormieHcaptcha = FormieHcaptcha;
})();

/******/ })()
;