import { AutoChangeEntry, CharacterPF2e, FeatPF2e, ItemFlagsPF2e } from "foundry-pf2e";
import { MODULE_ID, SPECIAL_PRINCESS_FEATURES } from "../constants";
import { Level } from "../model/SkillBoosts";

export function resolvePreselectedSkills(actor: CharacterPF2e): Map<number, Level> {
    const selectedSkills = new Map();

    addBackgroundSkills(actor, selectedSkills);
    addClassSkills(actor, selectedSkills);
    addDeitySkills(actor, selectedSkills);
    addAutoChanges(actor, selectedSkills);
    addSpecialPrincessFeats(actor, selectedSkills);

    return selectedSkills;
}

function resolveChangeTarget(target: string, change: AutoChangeEntry, actor: CharacterPF2e): string {
    const match = target.match(/{item\|flags\.(.+?)}/);
    if (!match) {
        return target;
    }

    const flagSegments = match[1].split(".");

    const source = actor.items.find((item) => item.name === change.source);

    if (!source) {
        return target;
    }

    let currentValue: ItemFlagsPF2e | null = source.flags;
    for (const segment of flagSegments) {
        if (!currentValue || typeof currentValue !== "object") {
            currentValue = null;
            break;
        }
        currentValue = currentValue[segment] as ItemFlagsPF2e;
    }

    if (typeof currentValue === "string") {
        return target.replace(match[0], currentValue);
    }

    return target;
}

function addAutoChanges(actor: CharacterPF2e, selectedSkills: Map<number, Level>): void {
    const autoChanges = actor.system.autoChanges;

    if (!autoChanges) {
        return;
    }

    for (const [target, changes] of Object.entries(autoChanges)) {
        if (!changes) {
            continue;
        }

        for (const change of changes) {
            const resolved = resolveChangeTarget(target, change, actor);

            if (!resolved || !change) {
                continue;
            }
            if (resolved.startsWith("system.skills.")) {
                const skill = resolved.split(".")[2];
                const level = change.level ?? 1;
                updateSkillSelection(selectedSkills, skill, change.value as number, level);
            }
        }
    }
}

function updateSkillSelection(selectedSkills: Map<number, Level>, skill: string, rank: number, level: number): void {
    let alreadySelected = false;

    for (const [lvl, entry] of selectedSkills) {
        if (lvl <= level && entry.selected[skill] && entry.selected[skill].rank == rank) {
            alreadySelected = true;
            break;
        }
    }

    const existingEntry = selectedSkills.get(level) || new Level();

    if (alreadySelected) {
        existingEntry.additional++;
    } else {
        existingEntry.selected[skill] = { locked: true, rank: rank };
    }

    selectedSkills.set(level, existingEntry);
}

function addClassSkills(actor: CharacterPF2e, selectedSkills: Map<number, Level>) {
    const classItem = actor.class;

    if (!classItem) {
        return;
    }

    classItem.system.trainedSkills.value.forEach((skill) => {
        updateSkillSelection(selectedSkills, skill, 1, 1);
    });
}

function addBackgroundSkills(actor: CharacterPF2e, selectedSkills: Map<number, Level>) {
    const background = actor.background;

    if (!background) {
        return;
    }

    background.system.trainedSkills.value.forEach((skill) => {
        updateSkillSelection(selectedSkills, skill, 1, 1);
    });
}

function addDeitySkills(actor: CharacterPF2e, selectedSkills: Map<number, Level>) {
    const divineClasses = game.settings?.get(MODULE_ID, "divineClasses") as string[];
    const divine = actor.items.filter((item) => item.system.slug !== null && divineClasses.includes(item.system.slug)).length > 0;

    if (!divine) {
        return;
    }

    const skill = actor.deity?.system.skill;

    if (!skill) {
        return;
    }

    if (skill.length > 1) {
        const levelOneSkills = selectedSkills.get(1) || new Level();
        levelOneSkills.additional++;
        selectedSkills.set(1, levelOneSkills);
    } else if (skill.length === 1) {
        updateSkillSelection(selectedSkills, skill[0], 1, 1);
    }
}

function addSpecialPrincessFeats(actor: CharacterPF2e, selectedSkills: Map<number, Level>) {
    actor.items.forEach((item) => {
        const featData = SPECIAL_PRINCESS_FEATURES.find((feat) => feat.slug === item.system.slug);

        if (!featData) {
            return;
        }

        const featLevel = (item as unknown as FeatPF2e).system?.level?.taken || 0;

        const levelsToUpdate = featLevel !== 0 ? [featLevel] : featData.levels || [];

        levelsToUpdate.forEach((level) => {
            const selected = selectedSkills.get(level) || new Level();

            if (featData.type === "available") {
                selected.available += featData.amount;
            } else if (featData.type === "additional") {
                selected.additional += featData.amount;
            }

            selectedSkills.set(level, selected);
        });
    });
}
