import passport from "passport";
import { Strategy } from 'passport-local';
import { GetUserByID, GetUserFromUsername } from "../utils/userQueries.mjs";
import { comparePassword} from "../utils/authentication.mjs";

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
        try {
            const user = await GetUserByID(id);
            if(!user) throw new Error('User not found');
            done(null, user);
        }
        catch (error) {
            done(error, null);
        }
});

export default passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const user = await GetUserFromUsername(username);
            if(!user) throw new Error("User not found");
            if(!comparePassword(password, user.password)) throw new Error("Bad credentials");
            done(null, user);
        }
        catch (error) {
            done(error, null);
        }
    })
);