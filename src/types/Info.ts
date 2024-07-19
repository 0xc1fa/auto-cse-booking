import { Center } from "./Center";

export type PersonalInfo = {
	email: string;
	name: string;
	uid: string;
};

export type BookingInfo = { center: Center; date: Date; session: 0 | 1 | 2 };

export type Info = PersonalInfo & BookingInfo;
