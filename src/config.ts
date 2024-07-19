import { BookingConfig } from "./types/BookingConfig";

const bookingConfig: BookingConfig = {
	name: "testing",
	email: "test@connect.hku.hk",
	uid: "3035690000",
	center: "b-active",
	session: 0,
	omit: [],
} as const;

export default bookingConfig;
