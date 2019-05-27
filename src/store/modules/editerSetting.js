import { localstore, debounce } from '../../utils';
const app = {
  state: {
    deviceType: localstore.getItem('device_type'),
    viewportScale: localstore.getItem('viewport_scale'),
    leftPanelWidth: localstore.getItem('lt_wid'),
    rightPanelWidth: localstore.getItem('rt_wid')
  },
  mutations: {
    UPDATE_RT_WID: (state, width) => {
      state.rightPanelWidth = width;
    },
    UPDATE_LT_WID: (state, width) => {
      state.leftPanelWidth = width;
    },
    UPDATE_DEVICE_TYPE: (state, type) => {
      state.deviceType = type;
    },
    UPDATE_VIEWPORT_SCALE: (state, scale) => {
      state.viewportScale = scale;
    }
  },
  actions: {
    update_rt_wid: debounce(({ commit }, width) => {
      commit('UPDATE_RT_WID', width);
      localstore.setItem('rt_wid', width);
    }, 800),
    update_lt_wid: debounce(({ commit }, width) => {
      commit('UPDATE_LT_WID', width);
      localstore.setItem('lt_wid', width);
    }, 800),
    update_device_type: ({ commit }, type) => {
      commit('UPDATE_DEVICE_TYPE', type);
      localstore.setItem('device_type', type);
    },
    update_viewport_scale: ({ commit }, scale) => {
      commit('UPDATE_VIEWPORT_SCALE', scale);
      localstore.setItem('viewport_scale', scale);
    }
  }
};

export default app;
