import Component from 'vue-class-component';
import Vue from 'vue';

//@Component
export const StateMixin = {
  /**
   * Find if a store is on loading state or not
   * @return {function(string): boolean}
   */
  computed: {
    isStoreLoading(): ((name: string) => boolean) {
      // @ts-ignore
      const getters = this.$store.getters;
      return name => getters[`${name}/${name}IsLoading`] || getters[`${name}IsLoading`];
    },

    /**
     * Find if a store is on error state or not
     * @return {function(string): boolean}
     */
    storeHasError(): ((name: string) => boolean) {
      // @ts-ignore
      const getters = this.$store.getters;
      return name => !!getters[`${name}/${name}Error`] || !!getters[`${name}Error`];
    },

    /**
     * Get the store
     * @return {function(string): Error|null}
     */
    getStoreError(): ((name: string) => Error) {
      // @ts-ignore
      const getters = this.$store.getters;
      return name => getters[`${name}/${name}Error`] || getters[`${name}Error`];
    } ,
  }
}
