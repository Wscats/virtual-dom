/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/base.js":
/*!*********************!*\
  !*** ./src/base.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const TEXT_ELEMENT = 'TEXT_ELEMENT';\n\nfunction createElement(type, props, ...children) {\n  props = Object.assign({}, props);\n  props.children = [].concat(...children) // 筛选\n  .filter(child => child != null && child !== false) // 遍历操作\n  .map(child => child instanceof Object ? child : createTextElement(child));\n  return {\n    type,\n    props\n  };\n}\n\nfunction createTextElement(value) {\n  return createElement(TEXT_ELEMENT, {\n    nodeValue: value\n  });\n}\n\nfunction updateDomProperties(dom, prevProps, nextProps) {\n  const isEvent = name => name.startsWith(\"on\");\n\n  const isAttribute = name => !isEvent(name) && name != \"children\";\n\n  console.log(isEvent, isAttribute); // Remove event listeners\n\n  Object.keys(prevProps).filter(isEvent).forEach(name => {\n    const eventType = name.toLowerCase().substring(2);\n    dom.removeEventListener(eventType, prevProps[name]);\n  }); // Remove attributes\n\n  Object.keys(prevProps).filter(isAttribute).forEach(name => {\n    dom[name] = null;\n  }); // Set attributes\n\n  Object.keys(nextProps).filter(isAttribute).forEach(name => {\n    dom[name] = nextProps[name];\n  }); // Add event listeners\n\n  Object.keys(nextProps).filter(isEvent).forEach(name => {\n    const eventType = name.toLowerCase().substring(2);\n    dom.addEventListener(eventType, nextProps[name]);\n  });\n}\n\nlet rootInstance = null;\n\nfunction render(element, parentDom) {\n  const prevInstance = rootInstance;\n  console.log(element, parentDom); // parentDom    挂载的节点  #root\n  // prevInstance 上一帧的节点 一开始是null\n  // element      需要挂载的组件 或者html结构\n\n  const nextInstance = reconcile(parentDom, prevInstance, element);\n  rootInstance = nextInstance;\n}\n\nfunction reconcile(parentDom, instance, element) {\n  if (instance === null) {\n    const newInstance = instantiate(element); // componentWillMount\n    // newInstance.publicInstance &&\n    //     newInstance.publicInstance.componentWillMount &&\n    //     newInstance.publicInstance.componentWillMount();\n\n    console.log(parentDom, newInstance);\n    parentDom.appendChild(newInstance.dom); // componentDidMount\n    // newInstance.publicInstance &&\n    //     newInstance.publicInstance.componentDidMount &&\n    //     newInstance.publicInstance.componentDidMount();\n\n    return newInstance;\n  }\n}\n\nfunction createPublicInstance(element, instance) {\n  const {\n    type,\n    props\n  } = element; // 把组件实例化\n\n  const publicInstance = new type(props);\n  publicInstance.__internalInstance = instance;\n  return publicInstance;\n}\n\nfunction instantiate(element) {\n  const {\n    type,\n    props = {}\n  } = element; // 判断内置标签\n\n  const isDomElement = typeof type === 'string'; // 判断自定义标签 也就是组件  如果是组件的话那原型链会有isReactComponent\n\n  const isClassElement = !!(type.prototype && type.prototype.isReactComponent);\n\n  if (isDomElement) {\n    console.log(element); // 创建dom\n\n    const isTextElement = type === TEXT_ELEMENT;\n    console.log(isTextElement);\n    const dom = isTextElement ? document.createTextNode('') : document.createElement(type);\n    console.log(dom); // // 设置dom的事件、数据属性\n\n    updateDomProperties(dom, [], element.props);\n    const children = props.children || [];\n    const childInstances = children.map(instantiate);\n    const childDoms = childInstances.map(childInstance => childInstance.dom);\n    console.log(childInstances, childDoms);\n    childDoms.forEach(childDom => dom.appendChild(childDom));\n    const instance = {\n      element,\n      dom,\n      childInstances\n    };\n    return instance;\n  } else if (isClassElement) {\n    const instance = {};\n    const publicInstance = createPublicInstance(element, instance);\n    console.log(publicInstance);\n    const childElement = publicInstance.render();\n    const childInstance = instantiate(childElement);\n    console.log(childElement);\n    Object.assign(instance, {\n      dom: childInstance.dom,\n      element,\n      childInstance,\n      publicInstance\n    });\n    return instance;\n  } // else {\n  //     const childElement = type(element.props);\n  //     const childInstance = instantiate(childElement);\n  //     const instance = {\n  //         dom: childInstance.dom,\n  //         element,\n  //         childInstance\n  //     };\n  //     return instance;\n  // }\n\n}\n\nclass Component {\n  constructor(props) {\n    this.props = props;\n    this.state = this.state || {};\n  }\n\n  setState(partialState) {\n    this.state = Object.assign({}, this.state, partialState); // update instance\n\n    const parentDom = this.__internalInstance.dom.parentNode;\n    const element = this.__internalInstance.element; // reconcile(parentDom, this.__internalInstance, element);\n  }\n\n} // 为后面instantiate提供组件判断的依据\n\n\nComponent.prototype.isReactComponent = {};\nmodule.exports = {\n  createElement,\n  render,\n  Component\n};\n\n//# sourceURL=webpack:///./src/base.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ \"./src/base.js\");\n/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_base_js__WEBPACK_IMPORTED_MODULE_0__);\n\nconsole.log(_base_js__WEBPACK_IMPORTED_MODULE_0___default.a);\n\nclass App extends _base_js__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n    this.props = {\n      name: \"laoxie\"\n    };\n    this.state = {\n      name: \"laoyao\",\n      age: 18\n    };\n  }\n\n  like() {\n    console.log(\"like\");\n  }\n\n  render() {\n    return _base_js__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      onClick: this.like\n    }, \"hello world\");\n  }\n\n}\n\n_base_js__WEBPACK_IMPORTED_MODULE_0___default.a.render(_base_js__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(App, null), document.querySelector(\"#root\")); // class r extends o.Component {\n//     constructor(e) {\n//         super(e), this.props = {\n//             name: \"laoxie\"\n//         }, this.state = {\n//             name: \"laoyao\",\n//             age: 18\n//         }\n//     }\n//     like() {\n//         console.log(1)\n//     }\n//     render() {\n//         return o.createElement(\"div\", {\n//             onClick: this.like.bind(this)\n//         }, \"hello world\")\n//     }\n// }\n// console.log(new r), o.render(o.createElement(r, null), document.querySelector(\"#root\"))\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });