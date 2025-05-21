import passport from "passport";
import { Strategy } from 'passport-local';
import { users } from '../utils/users.mjs'

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
        try {
            const user = users.find((user) => user.id === id);
            if(!user) throw new Error('User not found');
            done(null, user);
        }
        catch (error) {
            done(error, null);
        }
});

export default passport.use(
    new Strategy((username, password, done) => {
        try {
            const user = users.find((user) => user.username === username);

            if(!user) throw new Error('User not found');
            if(user.password !== password) throw new Error('Invalid Credentials');

            done(null, user);
        }
        catch (error) {
            done(error, null);
        }
    })
);