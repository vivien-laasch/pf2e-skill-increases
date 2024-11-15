import { HelloWorld } from "./apps/HelloWorld";
import type { SkillManager } from "./apps/SkillManager";

declare global {
    interface Window {
        HelloWorld: typeof HelloWorld;
        SkillManager: typeof SkillManager;
    }
}
