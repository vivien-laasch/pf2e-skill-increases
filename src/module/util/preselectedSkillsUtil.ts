import { SkillBoost, SkillBoosts } from "../model/SkillBoostManager";

export function resolvePreselectedSkills(actor: ActorPF2e): SkillBoosts {
    const selectedSkills = new Map();

    addClassSkills(actor, selectedSkills);
    addBackgroundSkills(actor, selectedSkills);
    addAutoChanges(actor, selectedSkills);

    return selectedSkills;
}

function resolveFlagTarget(target: string, actor: ActorPF2e): string {
    if (!target.startsWith("{item|flags.")) {
        return target;
    }

    const flagPaths = target.replace("}", "").split(".").slice(1);

    for (const item of actor.items) {
        let flags = item.flags;
        for (const flagPath of flagPaths) {
            if (!flags) {
                break;
            }

            flags = flags[flagPath];
        }
        if (flags && typeof flags === "string") {
            return flags;
        }
    }

    return target;
}

function addAutoChanges(actor: ActorPF2e, selectedSkills: SkillBoosts): void {
    const autoChanges = actor.system.autoChanges;

    if (!autoChanges) {
        return;
    }

    for (const [target, changes] of Object.entries(autoChanges)) {
        const resolved = resolveFlagTarget(target, actor);
        if (!resolved.startsWith("system.skills.")) {
            continue;
        }
        const skill = resolved.split(".")[2];
        changes.forEach((change) => {
            updateSkillSelection(selectedSkills, skill, change.value, change.level);
        });
    }
}

function updateSkillSelection(selectedSkills: SkillBoosts, skill: string, rank: number, level: number): void {
    let alreadySelected = false;

    for (const [lvl, entry] of selectedSkills) {
        //todo check rank
        if (lvl < level && entry.selected[skill]) {
            alreadySelected = true;
            break;
        }
    }

    const existingEntry = selectedSkills.get(level) || { available: 0, additional: 0, selected: {} as Record<string, SkillBoost> };

    if (alreadySelected) {
        existingEntry.additional++;
    } else {
        existingEntry.selected[skill] = { locked: true, rank: rank };
    }

    selectedSkills.set(level, existingEntry);
}

function addClassSkills(actor: ActorPF2e, selectedSkills: SkillBoosts) {
    const classItem = actor.class;

    if (!classItem) {
        return;
    }

    classItem.system.trainedSkills.value.forEach((skill) => {
        updateSkillSelection(selectedSkills, skill, 1, 1);
    });
}

function addBackgroundSkills(actor: ActorPF2e, selectedSkills: SkillBoosts) {
    const background = actor.background;

    if (!background) {
        return;
    }

    background.system.trainedSkills.value.forEach((skill) => {
        updateSkillSelection(selectedSkills, skill, 1, 1);
    });
}
