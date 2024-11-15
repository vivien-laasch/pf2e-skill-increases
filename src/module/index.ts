import { HelloWorld } from "./apps/HelloWorld";
import { getDariosBoosts } from "./skillCalculator";
import {  MODULE_ID } from "./constants";

Hooks.once("ready", async () => {
    console.log(`${MODULE_ID.toUpperCase()} | Initializing ${MODULE_ID}`);

    window.HelloWorld = await new HelloWorld().render(true);

    console.log(`${MODULE_ID.toUpperCase()} | Dario's available skills: ${getDariosBoosts()}`);

    console.log(`${MODULE_ID.toUpperCase()} | Finished initializing.`);
});
