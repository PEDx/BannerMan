import Vue from 'vue';
import Vuex from 'vuex';
import editerSetting from './modules/editerSetting';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    editerSetting
  },
  getters
});

export default store;
