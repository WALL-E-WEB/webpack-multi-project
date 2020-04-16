import Vue from "vue";
import App from "./App.vue";
console.log('bbb')
export const app = new Vue({
	render: (h) => h(App),
}).$mount("#app-box");
