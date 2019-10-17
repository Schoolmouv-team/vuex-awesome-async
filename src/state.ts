import Vue from 'vue';

interface StoreCache {
  [key: string]: {
    lastRequestTime: Date;
    requestLaunched: boolean;
    promise: Promise<any> | null;
  };
}

export interface StateWithLoading<S> {
  state: S;
  error: Error | null;
  loading: number;
  cache: StoreCache;
  cacheDuration: number;
}

const defaultState = <S>(
  values: S,
  cacheDuration: number,
): (() => StateWithLoading<S>) => () => ({
  state: Vue.observable({ ...values }),
  error: null,
  loading: 0,
  cache: {},
  cacheDuration,
});

// eslint-disable-next-line no-unused-vars
export const wrapState = (name: string, cacheDuration: number) => <S>(
  values: S,
  isStatic = false,
): StateWithLoading<S> | (() => StateWithLoading<S>) =>
  isStatic
    ? defaultState(values, cacheDuration)()
    : defaultState(values, cacheDuration);

