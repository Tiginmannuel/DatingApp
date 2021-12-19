import {IPhoto} from './photo';

export interface IMember {
  userId: number;
  username: string;
  photoUrl: string;
  age: number;
  knownAs: string;
  createdOn: Date;
  lastUpdatedOn: Date;
  gender: string;
  introduction: string;
  lookingFor: string;
  interests: string;
  city: string;
  country: string;
  photos: IPhoto[];
}
