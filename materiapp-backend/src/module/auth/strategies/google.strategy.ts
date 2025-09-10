import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oidc";
import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "src/core/config";
import { UserService } from "src/module/user/services";
import { GoogleProfile } from "../interfaces";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor(private userService: UserService) {
        super({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
            scope: ['openid', 'profile', 'email'],
        });
    }

    async validate(issuer: string, profile: GoogleProfile, cb: Function): Promise<any> {
        const user = await this.userService.createOrFindGoogleUser(profile);
        cb(null, user);
    }

}


