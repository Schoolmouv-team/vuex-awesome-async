import {MutationTree} from "vuex";
import {commitNamesGenerator} from "./utils";
import Vue from "vue";
import {StateWithLoading} from "./state";

export const wrapMutations = <S>(name: string) => (mutations: MutationTree<S>) => {
  const {
    startLoadingName,
    endLoadingName,
    setErrorName,
    resetErrorName,
    setPendingPromiseName,
    setLastTimeUpdateName,
  } = commitNamesGenerator(name);

  return {
    [startLoadingName]: (state: StateWithLoading<S>) => {
      state.loading++;
    },
    [endLoadingName]: (state: StateWithLoading<S>) => {
      if (state.loading > 0) {
        state.loading--;
      }
    },
    [setErrorName]: (state: StateWithLoading<S>, error: Error | null) => {
      state.error = error;
    },
    [resetErrorName]: (state: StateWithLoading<S>) => {
      state.error = null;
    },
    [setLastTimeUpdateName]: (state: StateWithLoading<S>, key: string) => {
      Vue.set(state.cache, key, {
        lastRequestTime: new Date(),
        promise: null,
        requestLaunched: false,
      });
    },
    [setPendingPromiseName]: (
        state: StateWithLoading<S>,
        payload: { key: string | number; promise: Promise<any> },
    ) => {
      let cacheObject = state.cache[payload.key];
      if (!cacheObject) {
        cacheObject = {
          lastRequestTime: new Date(),
          promise: payload.promise,
          requestLaunched: true,
        };
      } else {
        cacheObject.requestLaunched = true;
        cacheObject.promise = payload.promise;
      }
      Vue.set(state.cache, payload.key, cacheObject);
    },
    ...Object.keys(mutations).reduce(
        (acc: MutationTree<StateWithLoading<S>>, key) => ({
          ...acc,
          [key]: (state: StateWithLoading<S>, val: any) =>
              mutations[key](state.state, val),
        }),
        {},
    ),
  };
};
