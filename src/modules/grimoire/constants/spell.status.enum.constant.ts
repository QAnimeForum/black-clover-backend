export enum ENUM_SPELL_STATUS {
    DRAFT = 'DRAFT',
    NOT_APPROVED = 'NOT_APPROVED',
    APPROVED = 'APPROVED',
}

export const convertSpellStatusToText = (type: ENUM_SPELL_STATUS) => {
    switch (type) {
        case ENUM_SPELL_STATUS.DRAFT:
            return 'черновик';
        case ENUM_SPELL_STATUS.NOT_APPROVED:
            return 'на одобрении администратора';
        case ENUM_SPELL_STATUS.APPROVED:
            return 'одобрено';
    }
};
