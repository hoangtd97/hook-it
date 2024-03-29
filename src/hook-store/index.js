'use strict';

function HookStore(hooks) {

  const Private = {
    /** @type {Object<string, Function[]>} */
    hooks : hooks || {}
  };

  const Public = {
    add (type, hook) {
      if (!Array.isArray(Private.hooks[type])) {
        Private.hooks[type] = [];
      }
      const foundHook = Private.hooks[type].find(h => h === hook);
      if (!foundHook) {
        Private.hooks[type].push(hook);
      }
      return Public;
    },
    addMap (hooksMap) {
      for (let type of hooksMap) {
        const hooks = hooksMap[type];

        if (typeof hooks === 'function') {
          hooks = [hooks];
        }
        if (!Array.isArray(hooks)) {
          throw new Error(`Hook of type ${type} expected a function or array, but received ${hooks}`);
        }
        for (let hook of hooks) {
          Public.add(type, hook);
        }
      }
      return Public;
    },
    get (type) {
      return Private.hooks[type];
    },
    clone () {
      const new_hooks = {};

      for (let type in Private.hooks) {
        new_hooks[type] = Array.from(Private.hooks[type]);
      }

      return HookStore(new_hooks);
    }
  };

  return Public;
}

module.exports = HookStore;