export const MODULE_ID = "pf2e-skill-increases";
export const CHARACTER_SHEET = "CharacterSheetPF2e";

const ModuleData = {
    id: MODULE_ID,
    title: "Skill Increases",
    flags: {
        logger: {
            enabled: true,
            background: "#646cff",
            foreground: "#ffffff",
        },
    },
};

export default foundry.utils.mergeObject(ModuleData);
