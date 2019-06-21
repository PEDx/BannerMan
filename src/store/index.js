import Vue from 'vue';
import Vuex from 'vuex';
import editor from './modules/editor';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    editor
  },
  getters
});

export default store;
