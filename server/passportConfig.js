// Configuration required to authenticate a user
const User = require("./models/user.model");
const bcrypt = require("bcryptjs"); // unhash passwords
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  // Create a local strategy
  passport.use(
    new localStrategy(
      { usernameField: "name", passwordField: "password" },
      (username, password, done) => {
        // Find user with the same userID
        User.findOne({ userName: username }, (err, user) => {
          if (err) throw err;
          // No user with userID
          if (!user) {
            return done(null, false, { message: "Incorrect username" });
          } else {
            bcrypt.compare(password, user.password, (err, res) => {
              if (err) throw err;
              if (res === true) {
                return done(null, user); // no error, return user
              } else {
                return done(null, false, { message: "Incorrect password" });
              }
            });
          }
        });
      }
    )
  );

  // Serialize user by creating a cookie
  passport.serializeUser((user, callback) => {
    callback(null, user.id);
  });

  // Deserialize user from cookie
  // Return user object containing: __id, accountType, Courses, userName
  passport.deserializeUser((id, callback) => {
    User.findOne({ _id: id }, (err, user) => {
      callback(err, user);
    });
  });
};
