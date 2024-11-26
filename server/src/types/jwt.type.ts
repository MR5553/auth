import { JwtPayload } from "jsonwebtoken";

export interface jwtToken extends JwtPayload {
    _id: string;
    email: string;
    username: string;
}