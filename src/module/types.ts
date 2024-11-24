// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ActorPF2e extends Actor {
    ancestry: AncestryPF2e;
    class: ClassPF2e;
    background: BackgroundPF2e;
    skills: Record<string, SkillPF2e>;
    system: {
        autoChanges: Record<string, Change[]>;
        build: {
            attributes: {
                boosts: {
                    [key: string]: string[];
                };
            };
        };
        details: {
            level: {
                value: number;
            };
        };
    };
}

interface ClassPF2e extends Item {
    system: {
        trainedSkills: {
            value: string[];
            additional: number;
        };
        keyAbility: {
            value: string[];
            selected: string;
        };
        skillIncreaseLevels: {
            value: number[];
        };
    };
}

interface AncestryPF2e extends Item {
    system: {
        boosts: {
            [key: string]: {
                value: string[];
                selected: string;
            };
        };
        flaws: {
            [key: string]: {
                value: string[];
            };
        };
    };
}

interface BackgroundPF2e extends Item {
    system: {
        boosts: {
            [key: string]: {
                value: string[];
                selected: string;
            };
        };
        trainedSkills: {
            lore: string[];
            value: string[];
        };
    };
}

interface SkillPF2e {
    slug: string;
    label: string;
    attribute: string;
    data: {
        modifiers: ModifierPf2e[];
        rank: number;
    };
}
interface ModifierPf2e {
    slug: string;
    type: string;
    ability: string;
    label: string;
    modifier: number;
}

interface Change {
    mode: string;
    level: number;
    value: number;
    source: string;
}