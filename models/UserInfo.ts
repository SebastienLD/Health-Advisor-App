
export enum BiologicalSex {
    male = "Male",
    female = "Female"
}

export type UserInfo = {
    userId: string;
    userName: string;

    heightInInches: number;
    biologicalSex: BiologicalSex;
    dateOfBirth: Date;
}