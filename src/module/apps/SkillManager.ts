import { createPinia, disposePinia, Pinia, setActivePinia } from "pinia";
import App from "../../templates/SkillManager.vue";
import { MODULE_ID } from "../constants";
import { VueApplicationMixin } from "../fvtt-vue/VueApplicationMixin.mjs";
import { useSkillManagerStore } from "../stores/SkillManagerStore";
import { persistData } from "../util/persistenceUtils";

const { ApplicationV2 } = foundry.applications.api;
export class SkillManager extends VueApplicationMixin(ApplicationV2) {
    state: Pinia;

    constructor(actor: ActorPF2e) {
        // @ts-expect-error - valid override
        super({ uniqueId: actor.id });
        this.state = createPinia();
        setActivePinia(this.state);
        useSkillManagerStore().actor = actor;
    }

    static DEFAULT_OPTIONS = foundry.utils.mergeObject(
        super.DEFAULT_OPTIONS,
        {
            id: "skill-manager-{id}",
            uniqueId: "",
            window: {
                title: `${MODULE_ID}.title`,
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
        },
    };

    override async close(options?: Application.CloseOptions): Promise<void> {
        const store = useSkillManagerStore();
        persistData(store.getActor, store.selectedSkills);
        disposePinia(this.state);
        return await super.close(options);
    }

    //@ts-expect-error - valid override to prevent infinite managers
    override _initializeApplicationOptions(options: ApplicationConfiguration): ApplicationConfiguration {
        const renderOptions = super._initializeApplicationOptions(options);
        renderOptions.uniqueId = options.uniqueId;
        return renderOptions;
    }
}
