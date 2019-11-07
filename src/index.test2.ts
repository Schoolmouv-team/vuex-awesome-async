// /* eslint-disable no-undef */
// import { wrapStore } from './index';
//
// describe('State test', () => {
//   const { wrapState, wrapGetters, wrapActions, wrapMutations } = wrapStore(
//     'test',
//   );
//
//   it('state should match structure', () => {
//     // @ts-ignore
//     const state = wrapState({ toto: 'toto', tata: 'tata' })();
//
//     expect(state).toEqual({
//       state: { toto: 'toto', tata: 'tata' },
//       error: null,
//       loading: 0,
//     });
//   });
//
//   it('getters should match structure', () => {
//     const toto = jest.fn();
//     const getters = wrapGetters({ toto });
//
//     const keys = Object.keys(getters);
//     expect(keys).toEqual(['testIsLoading', 'testError', 'toto']);
//   });
//
//   it('actions should match structure', () => {
//     const toto = jest.fn();
//     const tata = jest.fn();
//     const actions = wrapActions({ toto, tata });
//
//     const keys = Object.keys(actions);
//     expect(keys).toEqual(['toto', 'tata']);
//   });
//
//   it('mutations should match structure', () => {
//     const tata = jest.fn();
//     const mutations = wrapMutations({ TATA: tata });
//
//     const keys = Object.keys(mutations);
//     expect(keys).toEqual([
//       'TEST_START_LOADING',
//       'TEST_END_LOADING',
//       'TEST_SET_ERROR',
//       'TEST_RESET_ERROR',
//       'TATA',
//     ]);
//   });
// });
