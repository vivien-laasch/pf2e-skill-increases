import { DIVINE_CLASSES_AND_FEATS, MODULE_ID } from "./constants";

export function registerSettings() {
    game.settings?.register(MODULE_ID, "divineClassesAndFeats", {
        scope: "world",
        config: false,
        name: "Classes and feats that grant Deity Skills",
        hint: "This setting allows you to specify which classes and feats should grant Deity Skills. The default is Cleric, Champion, Avenger, Champion Dedication, and Cleric Dedication.",
        type: Array,
        default: DIVINE_CLASSES_AND_FEATS,
    });
}
