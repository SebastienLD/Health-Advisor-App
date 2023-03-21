export enum BiologicalSex {
  male = 'Male',
  female = 'Female',
}

export enum HealthGoal {
  gain_muscle = 'Gain Muscle',
  lose_fat = 'Lose Fat',
  maintain_weight = 'Maintain',
}

export type UserDietPreferences = {
  isLactoseIntolerant: boolean;
  isGlutenFree: boolean;
  isVeg: boolean;
  isKosher: boolean;
  isKeto: boolean;
  hasDiabetes: boolean;
  isDairyFree: boolean;
  isLowCarb: boolean;
};

export type UserInfo = {
  userId: string;
  userName: string;

  heightInInches: number;
  weightInPounds: number;
  biologicalSex: BiologicalSex;
  // dateOfBirth: Date;

  healthGoal: HealthGoal;
  targetMealsPerDay: number;

  dietPreferences: UserDietPreferences;
};
