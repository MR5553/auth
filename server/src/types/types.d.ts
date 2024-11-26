import { usertype } from "./users.type";

declare global {
    namespace Express {
        interface Request {
            user?: usertype;
        }
    }
}