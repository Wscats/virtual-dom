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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/test.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/createElement.js":
/*!******************************!*\
  !*** ./src/createElement.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function createElement(type, props, ...children) {\n  props = Object.assign({}, props);\n  props.children = [].concat(...children) // 筛选\n  .filter(child => child != null && child !== false) // 遍历操作 如果是对象则筛选掉(这里会筛选JSX对象和组件对象)，留下来文本节点进行处理\n  .map(child => child instanceof Object ? child : createTextElement(child));\n  return {\n    type,\n    props\n  };\n}\n\nfunction createTextElement(value) {\n  // 把文本节点从字符串变为对象{type:'TEXT_ELEMENT',props:{nodeValue:文本值}}\n  // 注意文本节点没有传children，所以children是肯定是空数组\n  return createElement('TEXT_ELEMENT', {\n    nodeValue: value\n  });\n}\n\nmodule.exports = {\n  createElement,\n  createTextElement\n};\n\n//# sourceURL=webpack:///./src/createElement.js?");

/***/ }),

/***/ "./src/instantiate.js":
/*!****************************!*\
  !*** ./src/instantiate.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("let {\n  updateDomProperties\n} = __webpack_require__(/*! ./updateDomProperties.js */ \"./src/updateDomProperties.js\");\n\nfunction instantiate(element) {\n  const {\n    type,\n    props = {}\n  } = element; // 判断内置标签\n\n  const isDomElement = typeof type === 'string'; // 判断自定义标签 也就是组件  如果是组件的话那原型链会有isReactComponent\n\n  const isClassElement = !!(type.prototype && type.prototype.isReactComponent); // 内置标签的分支\n\n  if (isDomElement) {\n    console.log(element); // 创建dom 这里判断是文本节点还是元素节点 例如元素节点会是{type:'div'} 文本节点为{type:'TEXT_ELEMENT'}\n\n    const isTextElement = type === 'TEXT_ELEMENT';\n    console.log(isTextElement); // 如果是文本节点将对象转为空字符串'' 如果是元素节点将对象转为<div></div>\n\n    const dom = isTextElement ? document.createTextNode('') : document.createElement(type);\n    console.log(dom); // 设置dom的事件、数据属性\n\n    updateDomProperties(dom, [], element.props); // 如果有子元素赋值给children，否则赋值空数组\n\n    const children = props.children || []; // 遍历children所有的子元素并进行处理\n    // 这一句非常关键会一层层遍历对象，div.props.children -> p.props.children -> \"TEXT_ELEMENT\".props.children\n    // 遍历到最底层的时候再沿路往上返回 return {element,dom,childInstances} 对象回到div\n\n    const childInstances = children.map(instantiate);\n    console.log(childInstances); // 遍历childInstances下所有的dom属性\n\n    const childDoms = childInstances.map(childInstance => childInstance.dom);\n    console.log(childDoms); // 拼接到根元素节点上\n\n    childDoms.forEach(childDom => dom.appendChild(childDom));\n    const instance = {\n      // 每个子节点对象\n      element,\n      // 子节点生成尚未挂载的虚拟DOM\n      dom,\n      // 每个子节点下的所有子节点instance信息\n      childInstances\n    };\n    return instance;\n  } // 自定义标签(组件)的分支\n  else if (isClassElement) {\n      const instance = {}; // 实例化组件类\n\n      const publicInstance = createPublicInstance(element, instance);\n      console.log(publicInstance); // 获取组件的JSX对象\n\n      const childElement = publicInstance.render(); // 转化JSX对象为虚拟DOM\n\n      const childInstance = instantiate(childElement);\n      console.log(childElement);\n      Object.assign(instance, {\n        // 组件的结构本质就是解析子节点标签的元素节点\n        dom: childInstance.dom,\n        element,\n        // 组件只有一个根节点，所以这里的childInstance不是数组，只是一个对象\n        childInstance,\n        // 这个属性组件独有的\n        publicInstance\n      });\n      return instance;\n    } else {\n      const childElement = type(element.props);\n      const childInstance = instantiate(childElement);\n      const instance = {\n        dom: childInstance.dom,\n        element,\n        childInstance\n      };\n      return instance;\n    }\n} // 这里主要是实例化组件，并且继承props值\n\n\nfunction createPublicInstance(element, instance) {\n  // 自定义标签(组件)是没有children的\n  const {\n    type,\n    props\n  } = element;\n  console.log(element); // 把组件实例化 new App(props)\n  // 并把所有的props传进组件实例\n\n  const publicInstance = new type(props); // 新增一个属性值__internalInstance存放instance\n  // 方便我们在后面的setState触发reconcile的时候可以直接获取props和state的值进行DOM更新\n\n  publicInstance.__internalInstance = instance;\n  return publicInstance;\n}\n\nmodule.exports = {\n  instantiate\n};\n\n//# sourceURL=webpack:///./src/instantiate.js?");

/***/ }),

/***/ "./src/test.js":
/*!*********************!*\
  !*** ./src/test.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("let {\n  updateDomProperties\n} = __webpack_require__(/*! ./updateDomProperties.js */ \"./src/updateDomProperties.js\");\n\nfunction reconcile(parentDom, instance, element) {\n  if (instance === null) {\n    const newInstance = instantiate(element);\n    console.log('newInstance', newInstance); // componentWillMount\n\n    newInstance.publicInstance && newInstance.publicInstance.componentWillMount && newInstance.publicInstance.componentWillMount();\n    parentDom.appendChild(newInstance.dom); // componentDidMount\n\n    newInstance.publicInstance && newInstance.publicInstance.componentDidMount && newInstance.publicInstance.componentDidMount();\n    return newInstance;\n  } else if (element === null) {\n    // componentWillUnmount\n    instance.publicInstance && instance.publicInstance.componentWillUnmount && instance.publicInstance.componentWillUnmount();\n    parentDom.removeChild(instance.dom);\n    return null;\n  } else if (instance.element.type !== element.type) {\n    const newInstance = instantiate(element); // componentDidMount\n\n    newInstance.publicInstance && newInstance.publicInstance.componentDidMount && newInstance.publicInstance.componentDidMount();\n    parentDom.replaceChild(newInstance.dom, instance.dom);\n    return newInstance;\n  } else if (typeof element.type === 'string') {\n    // 更新属性值\n    // instance.element.props是旧的props\n    // element.props是新的props\n    updateDomProperties(instance.dom, instance.element.props, element.props);\n    instance.childInstances = reconcileChildren(instance, element);\n    instance.element = element;\n    return instance;\n  } else {\n    if (instance.publicInstance && instance.publicInstance.shouldcomponentUpdate) {\n      if (!instance.publicInstance.shouldcomponentUpdate()) {\n        return;\n      }\n    } // componentWillUpdate\n\n\n    instance.publicInstance && instance.publicInstance.componentWillUpdate && instance.publicInstance.componentWillUpdate(); // 更新props\n\n    instance.publicInstance.props = element.props; // 只有组件才会触发componentWillUpdate生命周期，触发render方法，重新获取组件JSX对象\n\n    const newChildElement = instance.publicInstance.render(); // 获取组件旧JSX生成的未挂载虚拟DOM对象信息，存放在childInstance里面\n\n    const oldChildInstance = instance.childInstance;\n    const newChildInstance = reconcile(parentDom, oldChildInstance, newChildElement); // componentDidUpdate\n\n    instance.publicInstance && instance.publicInstance.componentDidUpdate && instance.publicInstance.componentDidUpdate();\n    instance.dom = newChildInstance.dom;\n    instance.childInstance = newChildInstance;\n    instance.element = element;\n    return instance;\n  }\n}\n\nfunction reconcileChildren(instance, element) {\n  const {\n    dom,\n    childInstances\n  } = instance;\n  const newChildElements = element.props.children || []; // max() 方法可返回两个指定的数中带有较大的值的那个数\n  // 对比两个虚拟DOM的深度，取最深的进行遍历\n\n  const count = Math.max(childInstances.length, newChildElements.length);\n  const newChildInstances = [];\n\n  for (let i = 0; i < count; i++) {\n    newChildInstances[i] = reconcile(dom, childInstances[i], newChildElements[i]);\n  }\n\n  return newChildInstances.filter(instance => instance !== null);\n}\n\nlet rootInstance = null;\n\nfunction render(element, parentDom) {\n  const prevInstance = rootInstance;\n  const nextInstance = reconcile(parentDom, prevInstance, element);\n  rootInstance = nextInstance;\n} // 测试代码\n\n\nclass Component {\n  constructor(props) {\n    this.props = props;\n    this.state = this.state || {};\n  }\n\n  setState(partialState) {\n    // 获取变动的state对象，并与旧state合并\n    this.state = Object.assign({}, this.state, partialState); // update instance\n\n    const parentDom = this.__internalInstance.dom.parentNode;\n    const element = this.__internalInstance.element;\n    reconcile(parentDom, this.__internalInstance, element);\n  }\n\n} // 为后面instantiate提供组件判断的依据\n\n\nComponent.prototype.isReactComponent = {};\n\nclass App extends Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      num: 0.1314\n    };\n  }\n\n  like() {\n    console.log(1);\n  } // 这句render在这里暂不起任何作用\n\n\n  render() {\n    return createElement(\"p\", null, this.state.num);\n  }\n\n  componentWillMount() {\n    console.log('componentWillMount');\n    setTimeout(() => {\n      console.log('触发了setState');\n      this.setState({\n        num: Math.random()\n      });\n    }, 1000);\n  }\n\n  componentWillUpdate() {\n    console.log('componentWillUpdate');\n  }\n\n}\n\nlet {\n  createElement,\n  createTextElement\n} = __webpack_require__(/*! ./createElement.js */ \"./src/createElement.js\");\n\nlet {\n  instantiate\n} = __webpack_require__(/*! ./instantiate.js */ \"./src/instantiate.js\"); // 这里如果直接放<App />组件在根组件的话才可以执行生命周期\n// 因为reconcile还没进行优化\n// <div><App /></div>如果是这种结构的话，App组件的生命周期不会触发\n\n\nrender(createElement(App, null), document.querySelector(\"#root\"));\n\n//# sourceURL=webpack:///./src/test.js?");

/***/ }),

/***/ "./src/updateDomProperties.js":
/*!************************************!*\
  !*** ./src/updateDomProperties.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function updateDomProperties(dom, prevProps, nextProps) {\n  // 定义事件过滤器筛选函数，以on为特征去监听\n  // startsWith方法判断是否on字符串作为开头\n  const isEvent = name => name.startsWith(\"on\"); // 定义属性值筛选函数，筛选掉事件属性值和children属性值\n\n\n  const isAttribute = name => !isEvent(name) && name != \"children\"; // 卸载事件绑定\n\n\n  Object.keys(prevProps).filter(isEvent).forEach(name => {\n    // 将字符串转化成小写，然后剪裁掉前面两个字母\n    // 比如: onClick  -->  Click\n    const eventType = name.toLowerCase().substring(2);\n    dom.removeEventListener(eventType, prevProps[name]);\n  }); // 清除属性值\n\n  Object.keys(prevProps).filter(isAttribute).forEach(name => {\n    dom[name] = null;\n  }); // 设置属性值\n\n  Object.keys(nextProps).filter(isAttribute).forEach(name => {\n    dom[name] = nextProps[name];\n  }); // 绑定事件\n\n  Object.keys(nextProps).filter(isEvent).forEach(name => {\n    const eventType = name.toLowerCase().substring(2);\n    dom.addEventListener(eventType, nextProps[name]);\n  });\n}\n\nmodule.exports = {\n  updateDomProperties\n};\n\n//# sourceURL=webpack:///./src/updateDomProperties.js?");

/***/ })

/******/ });