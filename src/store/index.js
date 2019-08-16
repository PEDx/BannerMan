import Vue from 'vue';
import Vuex from 'vuex';
import editor from './modules/editor';
import getters from './getters';
import app from './modules/app';
import tagsView from './modules/tagsView';
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    editor,
    app,
    tagsView
  },
  getters
});

export default store;
