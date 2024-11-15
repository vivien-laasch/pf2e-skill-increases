import App from "../../templates/App.vue";
import { VueApplicationMixin } from "../vue/VueApplicationMixin";
import { MODULE_ID } from "../constants";

const { ApplicationV2 } = foundry.applications.api;

export class HelloWorld extends VueApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(
        super.DEFAULT_OPTIONS,
        {
            id: `app-${MODULE_ID}.title`,
            window: {
                title: `${MODULE_ID}.title`,
                icon: "fa-solid fa-triangle-exclamation",
                resizable: true,
            },
            position: {
                width: 600,
                height: "auto",
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
        },
    };
}
