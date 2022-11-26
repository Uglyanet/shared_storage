'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _createClass = require('@babel/runtime/helpers/createClass');
var _extends = require('@babel/runtime/helpers/extends');
var _inherits = require('@babel/runtime/helpers/inherits');
var _possibleConstructorReturn = require('@babel/runtime/helpers/possibleConstructorReturn');
var _getPrototypeOf = require('@babel/runtime/helpers/getPrototypeOf');
var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _extends__default = /*#__PURE__*/_interopDefaultLegacy(_extends);
var _inherits__default = /*#__PURE__*/_interopDefaultLegacy(_inherits);
var _possibleConstructorReturn__default = /*#__PURE__*/_interopDefaultLegacy(_possibleConstructorReturn);
var _getPrototypeOf__default = /*#__PURE__*/_interopDefaultLegacy(_getPrototypeOf);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return unsafeStringify(rnds);
}

var prefix = 'SharedStore';
var separator = ':';
var keysConfig = [{
  key: 'history',
  defaultValue: []
}, {
  key: 'tabsState',
  defaultValue: []
}, {
  key: 'state',
  defaultValue: {}
}];
var getFullKey = function getFullKey(key) {
  return "".concat(prefix).concat(separator).concat(key);
};

var LocalStorageManager = /*#__PURE__*/_createClass__default["default"](function LocalStorageManager() {
  _classCallCheck__default["default"](this, LocalStorageManager);
});
_defineProperty__default["default"](LocalStorageManager, "init", function () {
  keysConfig.forEach(function (_ref) {
    var key = _ref.key,
      defaultValue = _ref.defaultValue;
    var currentValue = LocalStorageManager.getValueByKey(key);
    if (!currentValue) {
      localStorage.setItem(getFullKey(key), JSON.stringify(defaultValue));
    }
  });
});
_defineProperty__default["default"](LocalStorageManager, "updateValueByKey", function (key, newValue) {
  localStorage.setItem(getFullKey(key), JSON.stringify(newValue));
});
_defineProperty__default["default"](LocalStorageManager, "getValueByKey", function (key) {
  var fullKey = getFullKey(key);
  return JSON.parse(localStorage.getItem(fullKey));
});

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty__default["default"](target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var TabManager = /*#__PURE__*/function () {
  function TabManager() {
    var _this = this;
    _classCallCheck__default["default"](this, TabManager);
    this.id = v4();
    window.onunload = function () {
      _this.remove();
    };
  }
  _createClass__default["default"](TabManager, [{
    key: "init",
    value: function init() {
      var tabs = this.getTabsState();
      var tab = {
        id: this.id,
        data: {},
        createdAt: new Date(),
        updatedAt: null
      };
      tabs.push(tab);
      LocalStorageManager.updateValueByKey('tabsState', tabs);
    }
  }, {
    key: "getTabState",
    value: function getTabState() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.id;
      var tabs = this.getTabsState();
      return tabs.find(function (tab) {
        return tab.id === id;
      });
    }
  }, {
    key: "getTabsState",
    value: function getTabsState() {
      var tabs = LocalStorageManager.getValueByKey('tabsState');
      return tabs;
    }
  }, {
    key: "update",
    value: function update(data) {
      var _this2 = this;
      var tab = this.getTabState();
      var tabs = this.getTabsState().map(function (currentTab) {
        if (currentTab.id === _this2.id) {
          return _objectSpread$1(_objectSpread$1({}, tab), {}, {
            updatedAt: new Date(),
            data: _objectSpread$1(_objectSpread$1({}, currentTab.data), data)
          });
        }
        return currentTab;
      });
      LocalStorageManager.updateValueByKey('tabsState', tabs);
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this3 = this;
      var tabs = this.getTabsState();
      var newTabs = tabs.filter(function (tab) {
        return tab.id !== _this3.id;
      });
      LocalStorageManager.updateValueByKey('tabsState', newTabs);
    }
  }]);
  return TabManager;
}();

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty__default["default"](target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var NetworkManager = /*#__PURE__*/function () {
  function NetworkManager(_ref) {
    var id = _ref.id,
      dispatch = _ref.dispatch,
      executors = _ref.executors;
    _classCallCheck__default["default"](this, NetworkManager);
    this.id = id;
    this.channel = new BroadcastChannel("SharedStore");
    this.initReceiver({
      dispatch: dispatch,
      executors: executors
    });
  }
  _createClass__default["default"](NetworkManager, [{
    key: "getMessageMeta",
    value: function getMessageMeta() {
      return {
        createdAt: new Date(),
        senderId: this.id
      };
    }
  }, {
    key: "send",
    value: function send(message) {
      var history = LocalStorageManager.getValueByKey('history');
      var newMessage = _objectSpread(_objectSpread({}, message), this.getMessageMeta());
      history.push(newMessage);
      LocalStorageManager.updateValueByKey('history', history.slice(-20));
      this.channel.postMessage(JSON.stringify(newMessage));
    }
  }, {
    key: "initReceiver",
    value: function initReceiver(_ref2) {
      var dispatch = _ref2.dispatch,
        executors = _ref2.executors;
      this.channel.onmessage = function (event) {
        var stringData = event.data;
        var _JSON$parse = JSON.parse(stringData),
          type = _JSON$parse.type,
          data = _JSON$parse.data,
          params = _JSON$parse.params;
        switch (type) {
          case 'EXECUTOR':
            executors[data](params);
            break;
          case 'REDUCER':
            dispatch(data);
            break;
        }
      };
      this.channel.onmessageerror = function (event) {
        console.error(event);
      };
    }
  }]);
  return NetworkManager;
}();

var createStore = function createStore(reducer, executors) {
  var state;
  var listeners = [];
  var tabManager = new TabManager();
  var dispatchForNetwork = function dispatchForNetwork(action) {
    state = reducer(state, action);
    listeners.forEach(function (listener) {
      return listener(state);
    });
  };
  var networkManager = new NetworkManager({
    id: tabManager.id,
    dispatch: dispatchForNetwork,
    executors: executors
  });
  LocalStorageManager.init();
  var storedState = LocalStorageManager.getValueByKey('state');
  state = storedState;
  tabManager.init();
  var getState = function getState() {
    return state;
  };
  var dispatch = function dispatch(action) {
    state = reducer(state, action);
    networkManager.send({
      type: 'REDUCER',
      data: action
    });
    LocalStorageManager.updateValueByKey('state', state);
    listeners.forEach(function (listener) {
      return listener(state);
    });
  };
  var executor = function executor(type) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    networkManager.send({
      type: 'EXECUTOR',
      data: type,
      params: params
    });
  };
  var subscribe = function subscribe(listener) {
    return listeners.push(listener);
  };
  dispatch({});
  return {
    getState: getState,
    dispatch: dispatch,
    subscribe: subscribe,
    executor: executor
  };
};

var ReduxContext = /*#__PURE__*/React__default["default"].createContext("redux");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf__default["default"](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default["default"](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default["default"](this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var connect = function connect(mapStateToProps, mapDispatchToProps) {
  return function (Component) {
    var Connect = /*#__PURE__*/function (_React$Component) {
      _inherits__default["default"](Connect, _React$Component);
      var _super = _createSuper(Connect);
      function Connect(props) {
        var _this;
        _classCallCheck__default["default"](this, Connect);
        _this = _super.call(this, props);
        _this.state = props.store.getState();
        return _this;
      }
      _createClass__default["default"](Connect, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this2 = this;
          this.props.store.subscribe(function (state) {
            _this2.setState(state);
          });
        }
      }, {
        key: "render",
        value: function render() {
          var store = this.props.store;
          return /*#__PURE__*/React__default["default"].createElement(Component, _extends__default["default"]({}, this.props, mapStateToProps(store.getState()), mapDispatchToProps(store.dispatch)));
        }
      }]);
      return Connect;
    }(React__default["default"].Component);
    return function (props) {
      return /*#__PURE__*/React__default["default"].createElement(ReduxContext.Consumer, null, function (store) {
        return /*#__PURE__*/React__default["default"].createElement(Connect, _extends__default["default"]({}, props, {
          store: store
        }));
      });
    };
  };
};

var combineReducers = function combineReducers(reducers) {
  var nextState = {};
  var reducerFunctions = {};
  var reducersKeys = Object.keys(reducers);
  reducersKeys.forEach(function (reducerKey) {
    if (typeof reducers[reducerKey] === "function") {
      reducerFunctions[reducerKey] = reducers[reducerKey];
    }
  });
  var reducerFunctionsKeys = Object.keys(reducerFunctions);
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments.length > 1 ? arguments[1] : undefined;
    reducerFunctionsKeys.forEach(function (reducerKey) {
      var reducer = reducerFunctions[reducerKey];
      nextState[reducerKey] = reducer(state[reducerKey], action);
    });
    return nextState;
  };
};

exports.combineReducers = combineReducers;
exports.connect = connect;
exports.createStore = createStore;
