
import { NewFlight } from "./flight";

export interface ResponseFlights {
    description:           string;
    code:        number;
    list: NewFlight[];
}
