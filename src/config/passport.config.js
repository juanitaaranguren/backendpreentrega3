import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import local from 'passport-local'
import userService from '../models/User.js'
import { createHash, isValidPassword } from '../utils.js'

const localStrategy = local.Strategy

const initializePassport = () => {

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id)
        done(null, user)
    })


    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.67ffedbeab408ba4",
        clientSecret: "ca261297c497692128e7b634345f97e2c5135b00",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            let user = await userService.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 25,
                    email: profile._json.email,
                    password: ""
                }

                let result = await userService.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }
    ))
}

export default initializePassport