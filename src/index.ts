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
const wrapStore = <S>(name: string, cacheDuration = 0) => {
  return {
    wrapState: wrapState<S>(name, cacheDuration),
    wrapGetters: wrapGetters<S>(name),
    wrapActions: wrapActions<S>(name),
    wrapActionCacheFetchKey: wrapActionCacheFetchKey<S>(name),
    wrapActionCacheFetchAll: wrapActionCacheFetchAll<S>(name),
    wrapMutations: wrapMutations<S>(name),
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
