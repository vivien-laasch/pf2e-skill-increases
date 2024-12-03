import { DIVINE_CLASSES, MODULE_ID } from "./constants";

export function registerSettings() {
    game.settings?.register(MODULE_ID, "divineClasses", {
        scope: "world",
        config: false,
        name: "Classes with Deity Skills",
        hint: "List of classes that have deity skills",
        type: Array,
        default: DIVINE_CLASSES,
    });
}
