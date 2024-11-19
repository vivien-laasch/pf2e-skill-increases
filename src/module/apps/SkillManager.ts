import { createPinia, setActivePinia } from "pinia";
import App from "../../templates/SkillManager.vue";
import { MODULE_ID } from "../constants";
import { VueApplicationMixin } from "../vue/VueApplicationMixin";
import { skillManagerStore } from "../stores/SkillManagerStore";

const { ApplicationV2 } = foundry.applications.api;

let pinia = createPinia();
setActivePinia(pinia);
export class SkillManager extends VueApplicationMixin(ApplicationV2) {
    constructor(actor: ActorPF2e) {
        super();
        skillManagerStore().actor = actor;
    }

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
                height: 790,
            },
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
