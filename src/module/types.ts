interface ActorPF2e extends Actor {
    system: {
        build: {
            attributes: {
                boosts: {
                    [key: string]: string[];
                };
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
    };
}
