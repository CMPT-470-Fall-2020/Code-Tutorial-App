// Configuration required to authenticate a user
const User = require("./models/user.model");
const bcrypt = require("bcryptjs"); // unhash passwords
const localStrategy = require("passport-local").Strategy;

module.exports = function(passport) {
    // Create a local strategy
    passport.use(
        new localStrategy((userID, password, done) => {
            // Find user with the same userID
            User.findOne({userID, userID}, (err, user) => {
                if (err) throw err;
                // No user with userID
                if (!user) {
                    return done(null, false, {message: 'Incorrect username'});
                } else {
                    bcrypt.compare(password, user.password, (err, res) => {
                        if (err) throw err;
                        if (res === true) {
                            return done(null, user) // no error, return user
                        } else {
                            return done(null, false, {message: 'Incorrect password'});
                        }
                    })
                }
            })
        })
    )

    // Serialize user by creating a cookie
    passport.serializeUser((user,callback) => {
        callback(null, user.id);
    })

    // Deserialize user from cookie
    passport.deserializeUser((id, callback)=>{
        User.findOne({ _id: id }, (err, user) => {
            const userInformation = {
              userID: user.userID,
            };
            callback(err, userInformation);
        });
    })
}
