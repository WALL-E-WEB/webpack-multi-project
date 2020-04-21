import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import {fn} from "../../libs/index.js"
// fn()
export const app = new Vue({
    router,
	render: (h) => h(App),
}).$mount("#app-box");
