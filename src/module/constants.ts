export const MODULE_ID = "pf2e-skill-increases";
export const CHARACTER_SHEET = "CharacterSheetPF2e";

const ModuleData = {
    id: MODULE_ID,
    title: "Skill Increases",
};

export default foundry.utils.mergeObject(ModuleData);

export const SPECIAL_PRINCESS_FEATS = [
    { slug: "rogue-dedication", amount: 1 }
];
