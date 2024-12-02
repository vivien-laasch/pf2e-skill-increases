import { MODULE_ID, SPECIAL_PRINCESS_FEATS } from "../constants";
import { SkillBoost, SkillBoosts } from "../model/SkillBoostManager";
import { CharacterPF2e, FeatPF2e, ItemFlagsPF2e } from "foundry-pf2e";

export function resolvePreselectedSkills(actor: CharacterPF2e): SkillBoosts {
    const selectedSkills = new Map();

    addBackgroundSkills(actor, selectedSkills);
    addClassSkills(actor, selectedSkills);
    addDeitySkills(actor, selectedSkills);
    addAutoChanges(actor, selectedSkills);
    addSpecialPrincessFeats(actor, selectedSkills);

    return selectedSkills;
}

function resolveFlagTarget(target: string, actor: CharacterPF2e): string {
    const match = target.match(/{item\|flags\.(.+?)}/);
    if (!match) {
        return target;
    }

    const flagSegments = match[1].split(".");

    for (const item of actor.items) {
        let currentValue = item.flags;
        for (const segment of flagSegments) {
            if (!currentValue) {
                break;
            }

            if (currentValue && typeof currentValue === "object") {
                currentValue = currentValue[segment] as ItemFlagsPF2e;
            }
        }
        if (typeof currentValue === "string") {
            return target.replace(match[0], currentValue);
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
        const resolved = resolveFlagTarget(target, actor);
        if (!resolved.startsWith("system.skills.") || !changes) {
            continue;
        }
        const skill = resolved.split(".")[2];
        changes.forEach((change) => {
            //todo check this, i seriously don't care about non number values
            updateSkillSelection(selectedSkills, skill, change.value as number, change.level as number);
        });
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
        if (item.type !== "feat") {
            return;
        }
        const additional = SPECIAL_PRINCESS_FEATS.find((featData) => featData.slug === item.system.slug)?.amount;

        if (!additional) {
            return;
        }

        const featLevel = (item as unknown as FeatPF2e).system.level.taken || 0;

        const selected = selectedSkills.get(featLevel) || { available: 0, additional: 0, selected: {} };
        selected.additional += additional;
        selectedSkills.set(featLevel, selected);
    });
}
