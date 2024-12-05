import { CharacterPF2e } from "foundry-pf2e";
import { createPinia, disposePinia, Pinia, setActivePinia } from "pinia";
import App from "../../templates/SkillManager.vue";
import { MODULE_ID } from "../constants";
import { VueApplicationMixin } from "../fvtt-vue/VueApplicationMixin.mjs";
import { SkillBoosts } from "../model/SkillBoosts";
import { useSkillManagerStore } from "../stores/SkillManagerStore";
import { persistData } from "../util/persistence";
import { getUntrainedImprovLevel } from "../util/skills";

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
                        const store = useSkillManagerStore();
                        persistData(store.getActor, store.getSkillBoosts.skillBoosts);
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

    initializeStore(actor: CharacterPF2e): void {
        setActivePinia(this.pinia);
        const store = useSkillManagerStore();
        const skillboosts = new SkillBoosts(actor);

        store.actor = actor;
        store.selectedLevel = skillboosts.skillBoosts.has(actor.level) ? actor.level : 1;
        store.skillBoosts = skillboosts;
        store.untrainedImprovLevel = getUntrainedImprovLevel(actor);
    }
}

interface RenderOptions {
    uniqueId: string;
    window: {
        title: string;
    };
}
