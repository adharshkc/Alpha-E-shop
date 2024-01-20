const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile.emails[0].value);
      const userEmail = profile.emails[0].value;
      const user = await User.findOne({ email: userEmail });

      if (user) {
        return done(null, user);
      } else {
        const defaultPassword = "defaultPassword";
        const newUser = new User({
          email: userEmail,
          name: profile.displayName,
          password: defaultPassword
        });
        console.log(newUser);
        newUser.save();

        return done(null, newUser);
      }

      //   return done(null, profile);
    }
  )
);

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });