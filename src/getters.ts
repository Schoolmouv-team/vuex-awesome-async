import {GetterTree} from "vuex";
import {isObjectInCache} from "./utils";
import {StateWithLoading} from "./state";

export const wrapGetters = <S>(name: string) => (getters: GetterTree<S, S>) => {
  return {
    [`${name}IsLoading`]: (state: StateWithLoading<S>) => state.loading > 0,
    [`${name}Error`]: (state: StateWithLoading<S>) => state.error,
    [`${name}IsInCache`]: isObjectInCache,
    ...Object.keys(getters).reduce(
        (acc: GetterTree<StateWithLoading<S>, S>, key) => ({
          ...acc,
          [key]: (
              state: StateWithLoading<S>,
              utils: any,
              rootState: any,
              rootGetters: any,
          ) => getters[key](state.state, utils, rootState, rootGetters),
        }),
        {},
    ),
  };
};