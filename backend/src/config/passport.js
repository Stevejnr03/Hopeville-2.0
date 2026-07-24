import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "./db.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const first_name = profile.name.givenName;
      const last_name = profile.name.familyName;
      const avatar_url = profile.photos[0]?.value;
      const google_id = profile.id;

      // Check if user exists
      let user = await db("users").where({ email }).first();

      if (user) {
        // Update google_id and avatar if not set
        await db("users").where({ id: user.id }).update({
          google_id,
          avatar_url: user.avatar_url || avatar_url,
          updated_at: new Date(),
        });
      } else {
        // Create new user
        const [newUser] = await db("users").insert({
          first_name,
          last_name,
          email,
          password_hash: "google_oauth", // placeholder
          avatar_url,
          google_id,
          role: "user",
        }).returning("*");
        user = newUser;
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

export default passport;