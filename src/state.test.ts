import {wrapState} from "./state";

describe('state', () => {
  describe('wrap state', () => {
    const state = { toto: 'titi'};
    const expected = {
      state,
      error: null,
      loading: 0,
      cache: {},
      cacheDuration: 0,
    };

    it('should return state with two call in non static mode', () => {
      // Arrange
      const name = 'toto';

      // Act
      // @ts-ignore
      const res = wrapState(name)(state)();

      // Assert
      expect(res).toEqual(expected)
    });

    it('should return state with one call in non static mode', () => {
      // Arrange
      const name = 'toto';
      const options = { isStatic: true };

      // Act
      // @ts-ignore
      const res = wrapState(name)(state, options);

      // Assert
      expect(res).toEqual(expected)
    });

    it('should set cache duration when provided', () => {
      // Arrange
      const name = 'toto';
      const options = { isStatic: true };
      const cacheDuration = 1000;
      const expectedRes = {...expected, cacheDuration};

      // Act
      // @ts-ignore
      const res = wrapState(name, cacheDuration)(state, options);

      // Assert
      expect(res).toEqual(expectedRes)
    });
  });
});