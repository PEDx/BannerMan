import Vue from 'vue';
import component from './app';
import profile from './profile';

component._profile_ = profile;

export default Vue.component('widget-example', component);
