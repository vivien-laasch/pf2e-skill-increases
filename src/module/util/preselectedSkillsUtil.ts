export function resolvePreselectedSkills(actor: ActorPF2e): Map<number, PreselectedSkills> {
    const selectedSkills = new Map<number, PreselectedSkills>();

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

function addAutoChanges(actor: ActorPF2e, selectedSkills: Map<number, PreselectedSkills>): void {
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
            updateSkillSelection(selectedSkills, skill, change.level);
        });
    }
}

function updateSkillSelection(selectedSkills: Map<number, PreselectedSkills>, skill: string, level: number): void {
    let alreadySelected = false;

    for (const [lvl, entry] of selectedSkills) {
        if (lvl < level && entry.preselectedSkills.includes(skill)) {
            alreadySelected = true;
            break;
        }
    }

    const existingEntry = selectedSkills.get(level) || { preselectedSkills: [], additional: 0 };

    if (alreadySelected) {
        existingEntry.additional++;
    } else {
        existingEntry.preselectedSkills.push(skill);
    }

    selectedSkills.set(level, existingEntry);
}

function addClassSkills(actor: ActorPF2e, selectedSkills: Map<number, PreselectedSkills>) {
    const classItem = actor.class;

    if (!classItem) {
        return;
    }

    classItem.system.trainedSkills.value.forEach((skill) => {
        updateSkillSelection(selectedSkills, skill, 1);
    });
}

function addBackgroundSkills(actor: ActorPF2e, selectedSkills: Map<number, PreselectedSkills>) {
    const background = actor.background;

    if (!background) {
        return;
    }

    background.system.trainedSkills.value.forEach((skill) => {
        updateSkillSelection(selectedSkills, skill, 1);
    });
}
