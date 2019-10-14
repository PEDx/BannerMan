import Vue from 'vue';
import component from './app';
import VTap from '../common/v-tap';
import profile from './profile';

Vue.directive('tap', VTap);
component._profile_ = profile;

export default Vue.component('widget-button', component);
