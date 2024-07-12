export enum DevilUnionsPercentEnum {
    PERCENT_10 = '10',
    PERCENT_25 = '25',
    PERCENT_50 = '50',
    PERCENT_65 = '65',
    PERCENT_80 = '80',
    PERCENT_100 = '100',
}

export const convertPercentToValue = (value: string) => {
    switch (value) {
        case '10':
            return DevilUnionsPercentEnum.PERCENT_10;
        case '25':
            return DevilUnionsPercentEnum.PERCENT_25;
        case '50':
            return DevilUnionsPercentEnum.PERCENT_50;
        case '65':
            return DevilUnionsPercentEnum.PERCENT_65;
        case '80':
            return DevilUnionsPercentEnum.PERCENT_100;
    }
};
