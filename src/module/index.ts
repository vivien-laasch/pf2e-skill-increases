import { SkillManager } from "./apps/SkillManager";
import { CHARACTER_SHEET, MODULE_ID } from "./constants";

const openManager = `<button id="open-skill-manager" type="button" class="blue" style="margin-bottom: 0.5rem;">Skill Manager</button>`;

Hooks.on("render" + CHARACTER_SHEET, (app: ActorSheet, html: JQuery) => {
    console.log(`${MODULE_ID.toUpperCase()} | Attempting to inject Skill Manager button`);

    const id = app.options.token?.actorId;
    if (!id) return;

    html.find(".tab.proficiencies").find("header").first().after(openManager);
    html.find("#open-skill-manager").on("click", () => {
        openSkillManager(id);
    });

    console.log(`${MODULE_ID.toUpperCase()} | Skill Manager button injected`);
});

async function openSkillManager(actorId: string) {
    const actor = await game.actors.get(actorId);
    new SkillManager(actor).render(true);
}
