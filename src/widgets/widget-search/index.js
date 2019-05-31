import Vue from 'vue';
import component from './app';
import profile from './profile';

Vue.prototype._profile_ = profile;

export default Vue.component('widget-search', component);
