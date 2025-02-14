import express from "express";
import passport from "passport";
import flatted from 'flatted'
const router = express.Router();

router.get("/api/auth/google",
    passport.authenticate("google", {scope: ["profile", "email"]}))

router.get("/auth/google/callback",
    passport.authenticate("google", {failureRedirect: '/login'}),
    (req, res) => {
        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    }
)

router.get("/api/auth/current-user", (req, res) => {
    if (req.isAuthenticated()) {
        
      res.send(flatted.stringify(req.user));
      console.log((req.user));
      
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  });

router.get("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({ status: "ok" });
    });
});


export default router;