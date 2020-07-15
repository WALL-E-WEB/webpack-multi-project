import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import {fn} from "../../libs/index.js"
// fn()

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
arr.includes(function(item) {
  return item > 2;
});

class MyClass {
  constructor(msg) {
    this.name = msg;
  }

  alertName() {
    console.log(this.name);
  }
}
fn(() => {
  console.log('walle', this);
});
Object.assign(
  {},
  {
    a: 1,
    b: 2
  }
);
new Promise();

console.log('122');
export const app = new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app-box');
