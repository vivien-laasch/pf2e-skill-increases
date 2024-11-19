import type { SkillManager } from "./apps/SkillManager";

declare global {
    interface Window {
        SkillManager: typeof SkillManager;
    }
}
