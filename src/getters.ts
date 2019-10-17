import {GetterTree} from "vuex";
import {isObjectInCache} from "./utils";
import {StateWithLoading} from "./state";

export const wrapGetters = (name: string) => <S, G>(getters: GetterTree<S, G>) => {
  return {
    [`${name}IsLoading`]: (state: StateWithLoading<S>) => state.loading > 0,
    [`${name}Error`]: (state: StateWithLoading<S>) => state.error,
    [`${name}IsInCache`]: isObjectInCache,
    ...Object.keys(getters).reduce(
        (acc: GetterTree<StateWithLoading<S>, G>, key) => ({
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