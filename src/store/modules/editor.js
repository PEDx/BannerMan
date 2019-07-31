import storage from '../../storage';
import { UNDEFINED } from '../../utils/index';
const local_editor_setting = storage.get('setting') || {};

Object.keys(local_editor_setting).forEach(key => {
  const _val = local_editor_setting[key];
  local_editor_setting[key] = _val === UNDEFINED ? undefined : _val;
});

const app = {
  state: {
    setting: {
      deviceType: local_editor_setting.deviceType,
      viewportScale: local_editor_setting.viewportScale,
      leftPanelWidth: local_editor_setting.leftPanelWidth,
      rightPanelWidth: local_editor_setting.rightPanelWidth,
      leftPanelSplit: local_editor_setting.leftPanelSplit,
      rightPanelStatus: local_editor_setting.rightPanelStatus,
      leftPanelStatus: local_editor_setting.leftPanelStatus,
      rightPanelSplit: local_editor_setting.rightPanelSplit,
      editID: local_editor_setting.editID,
      guideVisibility: true
    }
  },
  mutations: {
    UPDATE_EDITER_SETTING: (state, [type, data]) => {
      state.setting[type] = data;
      storage.set('setting', state.setting);
    }
  },
  actions: {
    update_rt_wid: ({ commit }, width) => {
      commit('UPDATE_EDITER_SETTING', ['rightPanelWidth', width]);
    },
    update_lf_wid: ({ commit }, width) => {
      commit('UPDATE_EDITER_SETTING', ['leftPanelWidth', width]);
    },
    update_rt_spt: ({ commit }, percent) => {
      commit('UPDATE_EDITER_SETTING', ['rightPanelSplit', percent]);
    },
    update_lf_spt: ({ commit }, percent) => {
      commit('UPDATE_EDITER_SETTING', ['leftPanelSplit', percent]);
    },
    update_rt_spt_status: ({ commit }, status) => {
      commit('UPDATE_EDITER_SETTING', ['rightPanelStatus', status]);
    },
    update_lf_spt_status: ({ commit }, status) => {
      commit('UPDATE_EDITER_SETTING', ['leftPanelStatus', status]);
    },
    update_device_type: ({ commit }, type) => {
      commit('UPDATE_EDITER_SETTING', ['deviceType', type]);
    },
    update_viewport_scale: ({ commit }, scale) => {
      commit('UPDATE_EDITER_SETTING', ['viewportScale', scale]);
    },
    update_edit_id: ({ commit }, id) => {
      commit('UPDATE_EDITER_SETTING', ['editID', id]);
    },
    update_guide_visibility: ({ commit }, bol) => {
      commit('UPDATE_EDITER_SETTING', ['guideVisibility', bol]);
    }
  }
};

export default app;
