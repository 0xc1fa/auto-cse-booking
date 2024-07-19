import { Info } from "./Info";

export type BookingConfig = Omit<Info, "date"> & {
	omit?: (0 | 1 | 2 | 3 | 4 | 5 | 6)[]; // Sunday = 0, Monday = 1, ...
};
