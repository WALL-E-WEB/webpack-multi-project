import Vue from "vue";
import App from "./App.vue";
// import {fn} from "../../libs/index.js"
// fn()
export const app = new Vue({
	render: (h) => h(App),
}).$mount("#app-box");
