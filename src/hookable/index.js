'use strict';

function HookableFactory(DI) {

  return function Hookable(factory, options={}) {

    let hookStore = options.hookStore || DI.HookStore();
    let extender  = options.extender || DI.extender;

    const func = factory(_invokeHook);

    if (options.clone === undefined || options.clone) {
      func.clone = _clone;
    }

    extender({ func, factory, hookStore, Hookable, ...DI });

    return func;

    function _invokeHook(type, args, invoker, options) {
      const _hooks = hookStore.get(type);
      const _invoker = _getInvoker(invoker);

      return _invoker(_hooks, args, options);
    }

    function _getInvoker (invoker) {
      if (typeof invoker === 'function') {
        return invoker;
      }
      if (typeof invoker === 'string') {
        if (DI.invokers[invoker]) {
          return DI.invokers[invoker];
        }
      }
      throw new Error(`Invalid invoker ${invoker}`);
    }

    function _clone() {
      return Hookable(factory, { ...options, hookStore : hookStore.clone() });
    }
  }
}

module.exports = HookableFactory;