import { Document, Model } from 'mongoose';

export enum StateValue {
  Offline = 0,
  NetworkReachable = 1,
  InternetReachable = 2
}

export interface State {
  fromHour: number;
  fromMinute: number;
  from: string;
  toHour: number;
  toMinute: number;
  to: string;
  state: StateValue;
}

export interface StateDocument extends State, Document<State> {}

export interface StateModel extends Model<StateDocument> {}
