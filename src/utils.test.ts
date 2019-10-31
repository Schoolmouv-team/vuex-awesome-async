import {commitNamesGenerator, isDate, isObjectInCache} from './utils';

describe('utils', () => {

  describe('is date', () => {
    // Arrange
    const useCases = [
      {
        date: '',
        expected: false,
      },
      {
        date: new Date(),
        expected: true,
      },
      {
        date: new Date(''),
        expected: false,
      },
    ];

    useCases.forEach((useCase, index) => {
      it(`should match use case ${index}`, () => {
        // Act
        const res = isDate(useCase.date);
        // Assert
        expect(res).toBe(useCase.expected);
      });
    })
  });

  describe('commit names generator', () => {
    // Arrange
    const useCases = [
      {
        name: 'toto',
        expected: {
          startLoadingName: `TOTO_START_LOADING`,
          endLoadingName: `TOTO_END_LOADING`,
          setErrorName: `TOTO_SET_ERROR`,
          resetErrorName: `TOTO_RESET_ERROR`,
          setPendingPromiseName: `TOTO_SET_PENDING_PROMISE`,
          setLastTimeUpdateName: `TOTO_SET_LAST_TIME_UPDATED`,
        },
      },
      {
        name: 'TOTO',
        expected: {
          startLoadingName: `TOTO_START_LOADING`,
          endLoadingName: `TOTO_END_LOADING`,
          setErrorName: `TOTO_SET_ERROR`,
          resetErrorName: `TOTO_RESET_ERROR`,
          setPendingPromiseName: `TOTO_SET_PENDING_PROMISE`,
          setLastTimeUpdateName: `TOTO_SET_LAST_TIME_UPDATED`,
        },
      },
      {
        name: '',
        expected: {
          startLoadingName: `_START_LOADING`,
          endLoadingName: `_END_LOADING`,
          setErrorName: `_SET_ERROR`,
          resetErrorName: `_RESET_ERROR`,
          setPendingPromiseName: `_SET_PENDING_PROMISE`,
          setLastTimeUpdateName: `_SET_LAST_TIME_UPDATED`,
        },
      },
    ];

    useCases.forEach((useCase, index) => {
      it(`should match use case ${index}`, () => {
        // Act
        const res = commitNamesGenerator(useCase.name);
        // Assert
        expect(res).toEqual(useCase.expected);
      });
    })
  });

  describe('is object in cache', () => {
    // Arrange
    const date = new Date();
    date.setMinutes(new Date().getMinutes() - 1);
    const useCases = [
      {
        state: {
          cache: {}
        },
        key: 'tutu',
        expected: false,
      },
      {
        state: {
          cache: {
            tutu: {
              lastRequestTime: date,
            },
          },
          cacheDuration: 500,
        },
        key: 'tutu',
        expected: false,
      },
      {
        state: {
          cache: {
            tutu: {
              lastRequestTime: date,
            },
          },
          cacheDuration: 2000,
        },
        key: 'tutu',
        expected: false,
      },
      {
        state: {
          cache: {
            tutu: {
              lastRequestTime: new Date().getTime(),
            },
          },
          cacheDuration: 0,
        },
        key: 'tutu',
        expected: false,
      },
    ];

    useCases.forEach((useCase, index) => {
      it(`should match use case ${index}`, () => {
        // Act
        // @ts-ignore
        const res = isObjectInCache(useCase.state)(useCase.key);
        // Assert
        expect(res).toBe(useCase.expected);
      });
    })
  });

});