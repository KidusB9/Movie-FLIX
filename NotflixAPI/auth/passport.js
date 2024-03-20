// const passport = require('passport');
// const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

// passport.use(
//   new JwtStrategy(
//     {
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: process.env.JWT_SECRET,
//     },
//     async (jwtPayload, done) => {
//       try {

//         const user = await User.findById(jwtPayload._id);
//         if (user) {
//           return done(null, user);
//         } else {
//           return done(null, false);
//         }
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );
