interface ActorPF2e extends Actor {
    ancestry: AncestryPF2e;
    class: ClassPF2e;
    background: BackgroundPF2e;
    skills: Record<string, SkillPF2e>;
    deity: DeityPF2e;
    system: {
        autoChanges: Record<string, Change[]>;
        build: {
            attributes: {
                boosts: {
                    [key: string]: string[];
                };
                flaws: {
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
        slug: string;
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
    lore: boolean;
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

interface DeityPF2e extends Item {
    system: {
        skill: string[];
    };
}

interface FeatPF2e extends Item {
    system: {
        level: {
            taken: number;
        };
    };
}
