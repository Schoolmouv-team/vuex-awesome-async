import {StateWithLoading} from "./state";

export const isDate = (date: Date | string) => date instanceof Date && !isNaN(date.valueOf());

export const commitNamesGenerator = (name: string) => {
  const uppercaseName = name.toUpperCase();
  return {
    startLoadingName: `${uppercaseName}_START_LOADING`,
    endLoadingName: `${uppercaseName}_END_LOADING`,
    setErrorName: `${uppercaseName}_SET_ERROR`,
    resetErrorName: `${uppercaseName}_RESET_ERROR`,
    setPendingPromiseName: `${uppercaseName}_SET_PENDING_PROMISE`,
    setLastTimeUpdateName: `${uppercaseName}_SET_LAST_TIME_UPDATED`,
  };
};

export const isObjectInCache = <S>(state: StateWithLoading<S>) => (key: string) => {
  const cacheObject = state.cache[key];
  if (!cacheObject) return false;

  const lastRequest = isDate(cacheObject.lastRequestTime)
      ? cacheObject.lastRequestTime.getTime()
      : new Date(cacheObject.lastRequestTime).getTime();

  return (
      lastRequest + state.cacheDuration >
      new Date().getTime()
  );
};