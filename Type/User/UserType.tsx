import * as Yup from 'yup';

export interface userInterest {
  id: number;
  name: string;
  status: number;
  image: string | null;
  imageUrl: string;
}

export type UserInterestList = userInterest[];
