import Component from 'vue-class-component';
import Vue from 'vue';

@Component
export class StateMixin extends Vue {
  /**
   * Find if a store is on loading state or not
   * @return {function(string): boolean}
   */
  get isStoreLoading(): ((name: string) => boolean) {
    const getters = this.$store.getters;
    return name => getters[`${name}IsLoading`];
  }

  /**
   * Find if a store is on error state or not
   * @return {function(string): boolean}
   */
  get storeHasError(): ((name: string) => boolean) {
    const getters = this.$store.getters;
    return name => !!getters[`${name}Error`];
  }

  /**
   * Get the store
   * @return {function(string): Error|null}
   */
  get getStoreError(): ((name: string) => Error) {
    const getters = this.$store.getters;
    return name => getters[`${name}Error`];
  }
}
