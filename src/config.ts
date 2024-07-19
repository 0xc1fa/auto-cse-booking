import { BookingConfig } from "./types/BookingConfig";

const bookingConfig: BookingConfig = {
	name: "testing",
	email: "test@connect.hku.hk",
	uid: "3035690000",
	center: "b-active",
	session: 0,
	omit: [0, 1, 6],
} as const;

export default bookingConfig;
