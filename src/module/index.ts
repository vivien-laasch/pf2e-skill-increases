import { MODULE_ID } from "./constants";
import { SkillManager } from "./apps/SkillManager";
import { skillManagerStore } from "./stores/SkillManagerStore";

Hooks.once("ready", async () => {
    console.log(`${MODULE_ID.toUpperCase()} | Initializing ${MODULE_ID}`);

    window.SkillManager = await new SkillManager().render(true);

    console.log(`${MODULE_ID.toUpperCase()} | Finished initializing.`);
});
