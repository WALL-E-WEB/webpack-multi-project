import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import {fn} from "../../libs/index.js"
// fn()
console.log('122')
export const app = new Vue({
    router,
	render: (h) => h(App),
}).$mount("#app-box");
