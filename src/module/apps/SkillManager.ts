import { CharacterPF2e } from "foundry-pf2e";
import { createPinia, disposePinia, Pinia, setActivePinia } from "pinia";
import App from "../../templates/SkillManager.vue";
import { MODULE_ID } from "../constants";
import { VueApplicationMixin } from "../fvtt-vue/VueApplicationMixin.mjs";
import { SkillBoostManager } from "../model/SkillBoostManager";
import { useSkillManagerStore } from "../stores/SkillManagerStore";
import { persistData } from "../util/persistenceUtils";
import { getLevel } from "../util/skillCalculationUtils";

const { ApplicationV2 } = foundry.applications.api;
export class SkillManager extends VueApplicationMixin(ApplicationV2) {
    pinia: Pinia;

    constructor(actor: CharacterPF2e) {
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
                        const store: ReturnType<typeof useSkillManagerStore> = useSkillManagerStore();
                        persistData(store.getActor, store.manager.skillBoosts);
                    },
                },
            },
        },
    };

    override async close(options?: unknown): Promise<void> {
        disposePinia(this.pinia);
        return await super.close(options);
    }

    // @ts-expect-error - valid override
    override _initializeApplicationOptions(options: RenderOptions): RenderOptions {
        const renderOptions = super._initializeApplicationOptions(options) as RenderOptions;
        renderOptions.uniqueId = options.uniqueId;
        return renderOptions;
    }

    initializeStore(actor: CharacterPF2e) {
        setActivePinia(this.pinia);
        const store = useSkillManagerStore();
        const skillManager = new SkillBoostManager();

        skillManager.initialize(actor);
        skillManager.selectedLevel = skillManager.skillBoosts.has(getLevel(actor)) ? getLevel(actor) : 1;

        store.actor = actor;
        store.manager = skillManager;
    }
}

interface RenderOptions {
    uniqueId: string;
    window: {
        title: string;
    };
}
