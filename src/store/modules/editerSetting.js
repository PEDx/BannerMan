import { debounce } from '../../utils/index';
import storage from '../../utils/storage';
const app = {
  state: {
    deviceType: storage.get('device_type'),
    viewportScale: storage.get('viewport_scale'),
    leftPanelWidth: storage.get('lt_wid'),
    rightPanelWidth: storage.get('rt_wid')
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
      storage.set('rt_wid', width);
    }, 500),
    update_lt_wid: debounce(({ commit }, width) => {
      commit('UPDATE_LT_WID', width);
      storage.set('lt_wid', width);
    }, 500),
    update_device_type: ({ commit }, type) => {
      commit('UPDATE_DEVICE_TYPE', type);
      storage.set('device_type', type);
    },
    update_viewport_scale: ({ commit }, scale) => {
      commit('UPDATE_VIEWPORT_SCALE', scale);
      storage.set('viewport_scale', scale);
    }
  }
};

export default app;
