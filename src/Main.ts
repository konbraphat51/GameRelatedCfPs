// Application entry point: mounts the root component with i18n and global styles.
import { createApp } from "vue";
import App from "./App.vue";
import { i18n, initialLocale } from "./I18n";
import "./Styles/Global.css";

document.documentElement.lang = initialLocale;
createApp(App).use(i18n).mount("#app");
