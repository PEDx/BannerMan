import Vue from 'vue';
import Vuex from 'vuex';
import editer from './modules/editer';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    editer
  },
  getters
});

export default store;
