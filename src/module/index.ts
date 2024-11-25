import { SkillManager } from "./apps/SkillManager";
import { CHARACTER_SHEET, MODULE_ID } from "./constants";
import { registerSettings } from "./settings";

Hooks.once("init", () => {
    registerSettings();
    console.log(`${MODULE_ID} | Initialized ${MODULE_ID}`);
});

Hooks.on("render" + CHARACTER_SHEET, (app: ActorSheet, html: JQuery) => {
    console.log(`${MODULE_ID} | Attempting to inject Skill Manager button`);

    const openManager = `<button id="open-skill-manager" type="button" class="blue" style="margin-bottom: 0.5rem;">${game.i18n?.localize("pf2e-skill-increases.open")}</button>`;

    const id = app.object._id;
    if (!id) return;

    html.find(".tab.proficiencies").find("header").first().after(openManager);
    html.find("#open-skill-manager").on("click", () => {
        openSkillManager(id);
    });

    console.log(`${MODULE_ID} | Skill Manager button injected`);
});

async function openSkillManager(actorId: string) {
    const actor = await game.actors.get(actorId);
    new SkillManager(actor).render(true);
}
