/*
export interface IUserService {
    findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]>;
    findOneById<User>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;
    findOne<T>(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;
    findOneByUsername<T>(
        username: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;
    findOneByEmail<T>(
        email: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;
    findOneByMobileNumber<T>(
        mobileNumber: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T>;
    getTotal(
        find?: Record<string, any>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;
    create(
        { firstName, lastName, email, mobileNumber, role }: UserCreateDto,
        { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
        options?: IDatabaseCreateOptions
    ): Promise<UserDoc>;
    existByEmail(
        email: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    existByMobileNumber(
        mobileNumber: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    existByUsername(
        username: string,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;
    delete(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updateName(
        repository: UserDoc,
        { firstName, lastName }: UserUpdateNameDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updateUsername(
        repository: UserDoc,
        { username }: UserUpdateUsernameDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updatePhoto(
        repository: UserDoc,
        photo: AwsS3Serialization,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updatePassword(
        repository: UserDoc,
        { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    active(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserEntity>;
    inactive(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    inactivePermanent(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    blocked(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    unblocked(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updatePasswordAttempt(
        repository: UserDoc,
        { passwordAttempt }: UserUpdatePasswordAttemptDto,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    increasePasswordAttempt(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    resetPasswordAttempt(
        repository: UserDoc,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    updatePasswordExpired(
        repository: UserDoc,
        passwordExpired: Date,
        options?: IDatabaseSaveOptions
    ): Promise<UserDoc>;
    joinWithRole(repository: UserDoc): Promise<IUserDoc>;
    getUploadPath(user: string): Promise<string>;
    payloadSerialization(data: IUserDoc): Promise<UserPayloadSerialization>;
    deleteMany(
        find: Record<string, any>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;
    import(
        data: UserImportDto[],
        role: string,
        { passwordCreated, passwordHash, salt }: IAuthPassword,
        options?: IDatabaseCreateManyOptions
    ): Promise<boolean>;
}
*/
