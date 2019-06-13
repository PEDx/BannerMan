import { debounce } from '../../utils/index';
import storage from '../../utils/storage';
const app = {
  state: {
    deviceType: storage.get('device_type'),
    viewportScale: storage.get('viewport_scale'),
    leftPanelWidth: storage.get('lf_wid'),
    rightPanelWidth: storage.get('rt_wid'),
    leftPanelSplit: storage.get('lf_spt'),
    rightPanelSplit: storage.get('rt_spt')
  },
  mutations: {
    UPDATE_RT_WID: (state, width) => {
      state.rightPanelWidth = width;
    },
    UPDATE_RT_SPT: (state, percent) => {
      state.rightPanelSplit = percent;
    },
    UPDATE_LF_SPT: (state, percent) => {
      state.leftPanelSplit = percent;
    },
    UPDATE_LF_WID: (state, width) => {
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
    update_lf_wid: debounce(({ commit }, width) => {
      commit('UPDATE_LF_WID', width);
      storage.set('lf_wid', width);
    }, 500),
    update_rt_spt: debounce(({ commit }, percent) => {
      commit('UPDATE_RT_SPT', percent);
      storage.set('rt_spt', percent);
    }, 500),
    update_lf_spt: debounce(({ commit }, percent) => {
      commit('UPDATE_LF_SPT', percent);
      storage.set('lf_spt', percent);
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
