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

2. Use a loader component to display loading or error (exemple)

```vue
<template>
  <div class="loader" :class="{ 'is-loading': isLoading }">
    <slot :name="slotName">
      <div class="loading">
        <div class="icon-spinner3" v-if="isLoading"></div>
      </div>
      <div class="error" v-if="hasError">{{ errorMessage }}</div>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Loader',

  props: {
    store: {
      type: [Array, String],
      default: () => [],
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },

  computed: {
    slotName() {
      if (this.isLoading) return 'loading';
      if (this.hasError) return 'error';
      return 'default';
    },

    storeArray() {
      return Array.isArray(this.store) ? this.store : [this.store];
    },

    isLoading() {
      if (this.$isServer) return false;
      return this.storeArray.reduce((loading, store) => {
        return loading || this.isStoreLoading(store);
      }, false);
    },

    hasError() {
      return (
        this.storeArray.reduce((loading, store) => {
          return loading || this.storeHasError(store);
        }, false)
      );
    },
  },
};
</script>
```

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
