import {ActionContext, ActionHandler, ActionTree, Commit, Store} from "vuex";
import {StateWithLoading} from "./state";
import {commitNamesGenerator, isObjectInCache} from "./utils";

export interface ActionUtils {
  startLoading: () => void;
  endLoading: () => void;
  setError: (error: Error) => void;
  resetError: () => void;
  setLastTimeUpdate: (key: string) => void;
  setPendingPromise: (key: string, promise: Promise<any>) => void;
  isObjectInCache: (key: string) => boolean;
  requestIsPending: (key: string) => boolean;
  getPendingRequest: (key: string) => Promise<any>;
}

declare module 'vuex' {
  interface ActionContext<S, R> extends ActionUtils{}
}

const requestIsPending = <S>(state: StateWithLoading<S>) => (key: string) => {
  const cacheObject = state.cache[key];
  if (!cacheObject) return false;

  return cacheObject.requestLaunched;
};

const getPendingRequest = <S>(state: StateWithLoading<S>) => (
    key: string,
): Promise<any> => {
  const cacheObject = state.cache[key];
  if (!cacheObject || !cacheObject.promise) return Promise.reject();

  return cacheObject.promise;
};

const actionUtils = <S>(
    name: string,
    commit: Commit,
    state: StateWithLoading<S>,
): ActionUtils => {
  const {
    startLoadingName,
    endLoadingName,
    setErrorName,
    resetErrorName,
    setLastTimeUpdateName,
    setPendingPromiseName,
  } = commitNamesGenerator(name);
  return {
    startLoading: () => {
      commit(startLoadingName);
    },
    endLoading: () => {
      commit(endLoadingName);
    },
    setError: (error: Error) => {
      commit(setErrorName, error);
    },
    resetError: () => {
      commit(resetErrorName);
    },
    setLastTimeUpdate: (key: string) => {
      commit(setLastTimeUpdateName, key);
    },
    setPendingPromise: (key: string, promise: Promise<any>) => {
      commit(setPendingPromiseName, { key, promise });
    },
    isObjectInCache: isObjectInCache(state),
    requestIsPending: requestIsPending(state),
    getPendingRequest: getPendingRequest(state),
  };
};

const getCacheKey = (key: string | number, payload: any) => {
  if (key === 'payload') {
    return payload
  } else if (key !== 'all') {
    return payload[key]
  } else {
    return key;
  }
};

const wrapActionCache = <S>(
    name: string,
    k: string | number,
    object: string,
    handler: ActionHandler<S, S>,
) => async function (
    this: Store<S>,
    context: ActionContext<S, S>,
    payload: any) {
  // Existing object in cache
  const key = getCacheKey(k, payload);

  if (context.isObjectInCache(key.toString())) {
    // @ts-ignore
    return context.state[object][key];
  }
  // Request Pending
  if (context.requestIsPending(key.toString())) {
    return await context.getPendingRequest(key.toString());
  }

  const promisedRes = handler.bind(this)(context, payload);
  context.setPendingPromise(key.toString(), promisedRes);
  const res = await promisedRes;
  context.setLastTimeUpdate(key.toString());
  return res;
};

export const wrapActionCacheFetchKey = <S>(name: string) => (
    handler: ActionHandler<S, S>,
    options: {
      payloadKey?: string,
      stateKey?: string,
    }
) => {
  return wrapActionCache(name, options.payloadKey || 'payload', options.stateKey || name, handler);
};

export const wrapActionCacheFetchAll = <S>(name: string) => (
    handler: ActionHandler<S, S>,
    options: { stateKey?: string }
) => {
  return wrapActionCache(name, 'all', options.stateKey || name, handler);
};

export const wrapActions = <S>(name: string) => (actions: ActionTree<S, S>) => {
  return Object.keys(actions).reduce(
      (acc: ActionTree<StateWithLoading<S>, S>, key) => ({
        ...acc,
        async [key](helpers: ActionContext<StateWithLoading<S>, S>, values: any) {
          const { commit } = helpers;
          const utils = actionUtils(name, commit, helpers.state);
          let res;
          utils.startLoading();
          utils.resetError();
          try {
            // @ts-ignore
            res = await actions[key].bind(this)(
                { ...{ ...helpers, state: helpers.state.state }, ...utils },
                values,
            );
          } catch (e) {
            utils.setError(e);
          }
          utils.endLoading();
          return res;
        },
      }),
      {},
  );
};