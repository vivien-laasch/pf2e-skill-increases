import { getDariosBoosts } from "./skillCalculator";

const MODULE_NAME = "pf2e-skill-increases";

Hooks.once("ready", async () => {
    console.log(`${MODULE_NAME.toUpperCase()} | Initializing ${MODULE_NAME.capitalize()}`);

    console.log(`${MODULE_NAME.toUpperCase()} | Dario's available skills: ${getDariosBoosts()}`);

    console.log(`${MODULE_NAME.toUpperCase()} | Finished initializing.`);
});
