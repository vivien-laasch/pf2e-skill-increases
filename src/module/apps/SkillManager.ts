import { createPinia, disposePinia, Pinia, setActivePinia } from "pinia";
import App from "../../templates/SkillManager.vue";
import { MODULE_ID } from "../constants";
import { VueApplicationMixin } from "../fvtt-vue/VueApplicationMixin.mjs";
import { useSkillManagerStore } from "../stores/SkillManagerStore";
import { persistData } from "../util/persistenceUtils";
import { getLevel } from "../util/skillCalculationUtils";

const { ApplicationV2 } = foundry.applications.api;
export class SkillManager extends VueApplicationMixin(ApplicationV2) {
    pinia: Pinia;

    constructor(actor: ActorPF2e) {
        // @ts-expect-error - valid override
        super({
            uniqueId: actor.id,
            window: { title: game.i18n?.localize(`${MODULE_ID}.title`) + `: ${actor.name}` },
        });
        this.pinia = createPinia();
        this.initializeStore(actor);
    }

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(
        super.DEFAULT_OPTIONS,
        {
            id: "skill-manager-{id}",
            uniqueId: "",
            window: {
                resizable: true,
            },
            position: {
                width: 660,
                height: 620,
            },
            classes: ["skill-manager"],
        },
        { inplace: false },
    );

    static override PARTS = {
        app: {
            app: App,
            forms: {
                form: {
                    closeOnSubmit: true,
                    handler() {
                        const store = useSkillManagerStore();
                        persistData(store.getActor, store.selectedSkills, store.preselectedSKills);
                    },
                },
            },
        },
    };

    override async close(options?: Application.CloseOptions): Promise<void> {
        disposePinia(this.pinia);
        return await super.close(options);
    }

    // @ts-expect-error - valid override
    override _initializeApplicationOptions(options: RenderOptions): RenderOptions {
        const renderOptions = super._initializeApplicationOptions(options) as RenderOptions;
        renderOptions.uniqueId = options.uniqueId;
        return renderOptions;
    }

    initializeStore(actor: ActorPF2e) {
        setActivePinia(this.pinia);
        const store = useSkillManagerStore();
        store.actor = actor;
        store.selectedLevel = getLevel(actor);
        store.preloadSkills(actor);
    }
}

interface RenderOptions {
    uniqueId: string;
    window: {
        title: string;
    };
}
