const express = require('express');
const User = require('../models/User')
const router = express.Router();

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Vaishuisgoodgirl';

//rote 1

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid name').isEmail(),
    body('password', 'password  must be 6 characters').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exist" })
        }
        //create a new user
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });

        // const data = {
        //     user: {
        //         id: user.id
        //     }
        // }

        // const authtoken = jwt.sign(data, JWT_SECRET);


        const authtoken = jwt.sign({ id: user.id }, JWT_SECRET);


        // res.json(user)
        res.json({ authtoken })
    } catch (error) {

        console.error(error.messege);
        res.status(500).send("Internal server error occured");
    }
})
//route 2  Authenticate a user using"//api/auth/login"

router.post('/login', [

    body('email', 'Enter a valid name').isEmail(),
    body('password', 'password can not be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to log in correct credentials" })

        }
        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to log in correct credentials" })

        }

        // const data = {
        //     user: {
        //         id: user.id
        //     }
        // }
        // const authtoken = jwt.sign(data, JWT_SECRET);

        const authtoken = jwt.sign({ id: user.id }, JWT_SECRET);
        success = true;
        res.json({ success, authtoken })
        //res.json({ authtoken })
    } catch (error) {
        console.error(error.messege);
        res.status(500).send("Internal server error occured");

    }
});

//route 3 get loged in user details using "//api/auth/getuser" login required


router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router 