import App from "../../templates/SkillManager.vue";
import { VueApplicationMixin } from "../vue/VueApplicationMixin";
import { MODULE_ID } from "../constants";
import { createPinia, setActivePinia } from "pinia";

const { ApplicationV2 } = foundry.applications.api;

let pinia = createPinia();
setActivePinia(pinia);

export class SkillManager extends VueApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(
        super.DEFAULT_OPTIONS,
        {
            id: `app-${MODULE_ID}`,
            window: {
                title: `${MODULE_ID}.title`,
                resizable: true,
            },
            position: {
                width: 600,
                height: 570,
            },
            actions: {},
        },
        { inplace: false },
    );

    static override DEBUG = true;

    static override SHADOWROOT = false;

    static override PARTS = {
        app: {
            id: "app",
            component: App,
            use: {
                pinia: { plugin: pinia, options: {} },
            },
        },
    };
}
