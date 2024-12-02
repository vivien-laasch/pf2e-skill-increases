import { AutoChangeEntry, CharacterPF2e, FeatPF2e } from "foundry-pf2e";
import { MODULE_ID, SPECIAL_PRINCESS_FEATURES } from "../constants";
import { SkillBoost, SkillBoosts } from "../model/SkillBoostManager";

export function resolvePreselectedSkills(actor: CharacterPF2e): SkillBoosts {
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

    for (const item of actor.items) {
        if (item.name === change.source) {
            let currentValue: unknown = item.flags;

            for (const segment of flagSegments) {
                if (!currentValue || typeof currentValue !== "object") {
                    currentValue = null;
                    break;
                }
                currentValue = (currentValue as Record<string, unknown>)[segment];
            }

            if (typeof currentValue === "string") {
                return target.replace(match[0], currentValue);
            }
        }
    }
    return target;
}

function addAutoChanges(actor: CharacterPF2e, selectedSkills: SkillBoosts): void {
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

function updateSkillSelection(selectedSkills: SkillBoosts, skill: string, rank: number, level: number): void {
    let alreadySelected = false;

    for (const [lvl, entry] of selectedSkills) {
        if (lvl <= level && entry.selected[skill] && entry.selected[skill].rank == rank) {
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

function addClassSkills(actor: CharacterPF2e, selectedSkills: SkillBoosts) {
    const classItem = actor.class;

    if (!classItem) {
        return;
    }

    classItem.system.trainedSkills.value.forEach((skill) => {
        updateSkillSelection(selectedSkills, skill, 1, 1);
    });
}

function addBackgroundSkills(actor: CharacterPF2e, selectedSkills: SkillBoosts) {
    const background = actor.background;

    if (!background) {
        return;
    }

    background.system.trainedSkills.value.forEach((skill) => {
        updateSkillSelection(selectedSkills, skill, 1, 1);
    });
}

function addDeitySkills(actor: CharacterPF2e, selectedSkills: SkillBoosts) {
    const classesWithDeitySkills = game.settings?.get(MODULE_ID, "classesWithDeitySkills") as string[];
    const slug = actor.class?.system.slug;

    if (!slug || !classesWithDeitySkills?.includes(slug)) {
        return;
    }

    const skill = actor.deity?.system.skill;

    if (!skill) {
        return;
    }

    if (skill.length > 1) {
        const levelOneSkills = selectedSkills.get(1) || { available: 0, additional: 0, selected: {} };
        levelOneSkills.additional++;
        selectedSkills.set(1, levelOneSkills);
    } else if (skill.length === 1) {
        updateSkillSelection(selectedSkills, skill[0], 1, 1);
    }
}

function addSpecialPrincessFeats(actor: CharacterPF2e, selectedSkills: SkillBoosts) {
    actor.items.forEach((item) => {
        const featData = SPECIAL_PRINCESS_FEATURES.find((feat) => feat.slug === item.system.slug);

        if (!featData) {
            return;
        }

        const featLevel = (item as unknown as FeatPF2e).system?.level?.taken || 0;

        const levelsToUpdate = featLevel !== 0 ? [featLevel] : featData.levels || [];

        levelsToUpdate.forEach((level) => {
            const selected = selectedSkills.get(level) || { available: 0, additional: 0, selected: {} };

            if (featData.type === "available") {
                selected.available += featData.amount;
            } else if (featData.type === "additional") {
                selected.additional += featData.amount;
            }

            selectedSkills.set(level, selected);
        });
    });
}
