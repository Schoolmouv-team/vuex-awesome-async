import {wrapMutations} from "./mutations";
import {StateWithLoading} from "./state";

describe('mutations', () => {
  describe('wrap mutations', () => {
    const name = 'TEST';
    const helperKeys = [
      'TEST_START_LOADING',
      'TEST_END_LOADING',
      'TEST_SET_ERROR',
      'TEST_RESET_ERROR',
      'TEST_SET_LAST_TIME_UPDATED',
      'TEST_SET_PENDING_PROMISE',
    ];

    it('should just add helpers if no data inside', () => {
      // Arrange
      const mutationsObject = {};

      // Act
      const mutations = wrapMutations(name)(mutationsObject);

      // Assert
      const keys = Object.keys(mutations);
      expect(keys).toEqual(helperKeys);
    });

    it('should add functions to helpers', () => {
      // Arrange
      const mutationsObject = {
        TOTO: jest.fn(),
        TATA: jest.fn(),
      };

      // Act
      const mutations = wrapMutations(name)(mutationsObject);

      // Assert
      const keys = Object.keys(mutations);
      expect(keys).toEqual([ ...helperKeys, 'TOTO', 'TATA']);
    });
  });

  describe('helpers', () => {
    let state: StateWithLoading<any>;
    const name = 'TEST';
    const toto = jest.fn();
    let mutations = wrapMutations(name)({ TOTO: toto });

    beforeAll(() => {
      state = {
        state: {
          trotro: 'tratra',
        },
        error: null,
        loading: 0,
        cache: {},
        cacheDuration: 0,
      };
    });

    it('should increment loading when startLoading is called', () => {
      // Arrange
      state.loading = 0;

      // Act
      mutations.TEST_START_LOADING(state, {});

      // Assert
      expect(state.loading).toBe(1);
    });

    it('should decrement loading when end loading is called with state > 0', () => {
      // Arrange
      state.loading = 2;

      // Act
      mutations.TEST_END_LOADING(state, {});

      // Assert
      expect(state.loading).toBe(1);
    });

    it('should do nothing when end loading on 0 loading', () => {
      // Arrange
      state.loading = 0;

      // Act
      mutations.TEST_END_LOADING(state, {});

      // Assert
      expect(state.loading).toBe(0);
    });

    it('should set error when set error is called', () => {
      // Arrange
      state.error = null;
      const error = new Error('titi');

      // Act
      mutations.TEST_SET_ERROR(state, error);

      // Assert
      expect(state.error).toEqual(error);
    });

    it('should reset error when reset set error is called', () => {
      // Arrange
      state.error = new Error('titi');

      // Act
      mutations.TEST_RESET_ERROR(state, {});

      // Assert
      expect(state.error).toBeNull();
    });

    it('should set list time updated', () => {
      // Arrange
      const date = new Date();
      state.cache = {};
      const key = 'tutu';
      const expected = {
        lastRequestTime: date,
        promise: null,
        requestLaunched: false,
      };

      // Act
      mutations.TEST_SET_LAST_TIME_UPDATED(state, key);

      // Assert
      expect(state.cache[key]).toEqual(expected);
    });

    it('should set list time updated on existing object', () => {
      // Arrange
      const expectedDate = new Date();
      const date = new Date();
      date.setFullYear(date.getFullYear() - 1);
      state.cache = {
        tutu: {
          lastRequestTime: date,
          promise: null,
          requestLaunched: false,
        }
      };
      const key = 'tutu';
      const expected = {
        lastRequestTime: expectedDate,
        promise: null,
        requestLaunched: false,
      };

      // Act
      mutations.TEST_SET_LAST_TIME_UPDATED(state, key);

      // Assert
      expect(state.cache[key]).toEqual(expected);
    });

    it('should set pending promise on empty cache', () => {
      // Arrange
      const date = new Date();
      const promise = Promise.resolve();
      state.cache = {};
      const key = 'tutu';
      const expected = {
        lastRequestTime: date,
        promise: promise,
        requestLaunched: true,
      };

      // Act
      mutations.TEST_SET_PENDING_PROMISE(state, { key, promise });

      // Assert
      expect(state.cache[key]).toEqual(expected);
    });

    it('should set pending promise on existing cache', () => {
      // Arrange
      const promise = Promise.resolve();
      const date = new Date();
      state.cache = {
        tutu: {
          lastRequestTime: new Date(),
          promise: null,
          requestLaunched: false,
        }
      };
      const key = 'tutu';
      const expected = {
        lastRequestTime: date,
        promise: promise,
        requestLaunched: true,
      };

      // Act
      mutations.TEST_SET_PENDING_PROMISE(state, { key, promise });

      // Assert
      expect(state.cache[key]).toEqual(expected);
    });

    it('should call custom mutation', () => {
      // Arrange
      const expectedState = { trotro: 'tratra' };
      const payload = { hey: 'ha' };

      // Act
      mutations.TOTO(state, payload);

      // Assert
      expect(toto).toBeCalledWith(expectedState, payload);
    });
  });
});