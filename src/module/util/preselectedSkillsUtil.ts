export function resolvePreselectedSkills(actor: ActorPF2e): Map<number, PreselectedSkills> {
    const selectedSkills = new Map<number, PreselectedSkills>();

    addClassSkills(actor, selectedSkills);
    addBackgroundSkills(actor, selectedSkills);
    addAutoChanges(actor, selectedSkills);

    return selectedSkills;
}

// todo
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function resolveFlagTarget(target: string, _actor: ActorPF2e): string {
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
    const existingEntry = selectedSkills.get(level) || { preselectedSkills: [], additional: 0 };
    const { preselectedSkills: preselected } = existingEntry;

    if (!preselected.includes(skill)) {
        preselected.push(skill);
    } else {
        existingEntry.additional++;
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
