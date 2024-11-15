import { getInitialBoosts } from "./skillCalculator";
import { MODULE_ID } from "./constants";
import { SkillManager } from "./apps/SkillManager";

Hooks.once("ready", async () => {
    console.log(`${MODULE_ID.toUpperCase()} | Initializing ${MODULE_ID}`);

    window.SkillManager = await new SkillManager().render(true);

    const dario = game.actors?.get("nTDnP6Cp2QT9TMNN") as ActorPF2e;

    console.log(`${MODULE_ID.toUpperCase()} | Dario's available skills: ${getInitialBoosts(dario)}`);

    console.log(`${MODULE_ID.toUpperCase()} | Finished initializing.`);
});
