import Vue from 'vue';
import { StateMixin } from './mixin';
import {wrapActionCacheFetchAll, wrapActionCacheFetchKey, wrapActions} from "./actions";
import {wrapMutations} from "./mutations";
import {wrapGetters} from "./getters";
import {wrapState} from "./state";

interface PluginOptions {
  loaderName: string;
}

/**
 * Start function to get all tools to wrap all elements of the store
 * @param name
 * @param cacheDuration
 */
const wrapStore = (name: string, cacheDuration = 0) => {
  return {
    wrapState: wrapState(name, cacheDuration),
    wrapGetters: wrapGetters(name),
    wrapActions: wrapActions(name),
    wrapActionCacheFetchKey: wrapActionCacheFetchKey(name),
    wrapActionCacheFetchAll: wrapActionCacheFetchAll(name),
    wrapMutations: wrapMutations(name),
  };
};

function install(
  Vue: Vue,
): void {
  // @ts-ignore
  if (install.installed) return;
  // @ts-ignore
  Vue.mixin(StateMixin);
  // @ts-ignore
}

export { wrapStore, StateMixin, install };
