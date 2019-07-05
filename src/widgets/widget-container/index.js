import Vue from 'vue';
import component from './app';
import profile from './profile';
import '../widget-search';

component._profile_ = profile;

export default Vue.component('widget-container', component);
