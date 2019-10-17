# Vue store loading state

## Installation

```
npm i vue-store-loading-state
```

Dans le main.js:

```javascript
import VueState from 'vue-store-loading-state';

Vue.use(VueState, { loaderName: 'Loader' });
```

## Usage

1.  Wrap a store

```javascript
import Vue from 'vue';
import { wrapStore } from 'vue-store-loading-state';

const { wrapMutations, wrapActions, wrapGetters, wrapState } = wrapStore(
  'store',
);

const state = wrapState({});

const getters = wrapGetters({});

const actions = wrapActions({});

const mutations = wrapMutations({});

export default {
  state,
  getters,
  actions,
  mutations,
};
```

2.  Use loader component to display loading or error

```vue
<Loader :store="['store1', 'store2']">
  <div>
    Async content to display
  </div>
  <div slot="error">
    An error occurred
  </div>
  <div slot="loading">
    Display custom logger
  </div>
</Loader>
```

## API

- PluginOptions

  - loaderName: the name of the global loader component

- wrapStore

  - name: the name of the store
  - options: object
    - isStatic: a static store is an object. In SSR mode, store should be a function to avoid singleton (default: false)

- wrapState

  - values: the store values

- wrapGetters

  - getters: all store getters

- wrapActions

  - actions: all store actions

- wrapMutations

  - mutations: all store mutations

- Mixin

  - isStoreLoading(name): check if a store is in loading state
  - storeHasError(name): check if the store is in error state
  - getStoreError(name): get errors from a store

- Loader

  - Props
    - store: array of stores name or a single name - the store to observe
    - dontShowError: boolean - in case we don't want to show error
    - errorMessage: the error message to display (if error slot is not defined)
  - Slots
    - default: the normal content of the page (if no errors)
    - loading: to define a loader
    - error: to show error
