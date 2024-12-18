export const MODULE_ID = "pf2e-skill-increases";
export const CHARACTER_SHEET = "CharacterSheetPF2e";

const ModuleData = {
    id: MODULE_ID,
    title: "Skill Increases",
};

export default foundry.utils.mergeObject(ModuleData);

export const SPECIAL_PRINCESS_FEATURES = [
    { slug: "animist", amount: 1, type: "available", levels: [1] },
    { slug: "avenger", amount: -4, type: "available", levels: [1] },
    { slug: "fighter", amount: 1, type: "available", levels: [1] },
    { slug: "rogue-dedication", amount: 1, type: "additional" },
    { slug: "stylish-tricks", amount: 1, type: "available", levels: [3, 7, 15] },
];

export const DIVINE_CLASSES = ["cleric", "champion", "avenger"];
