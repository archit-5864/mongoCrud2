const { generateToken } = require("../jwt/generateToken");
const user = require("../models/userModel")
const bcrypt = require("bcrypt")
const saltRounds = 10

module.exports = ({
    createUser: async (req, res) => {
        try {
            if (req.body == undefined) {
                console.log("Error in user creation..");
                return res.json({
                    message: "Client side error",
                    status: 400
                });
            }
            const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
            const newUser = await user.create({ ...req.body, password: hashPassword });
            let token;
            if (newUser) {
                const latestUser = await user.findOne(newUser._id);
                token = await generateToken(newUser._id);
                await latestUser.updateOne({
                    token: token.token,
                    logintime: token.time
                });
            }
            let obj = {
                name: newUser.name,
                _id: newUser._id,
                email: newUser.email,
                password: newUser.password,
                token: token ? token.token : null,
                loginTime: token ? token.time : null,
            };
            return res.json({
                message: "Success",
                status: 200,
                body: obj
            })

        } catch (error) {
            console.log(error)
            return res.json({
                message: "Internal server error",
                status: 500
            })
        }
    },

    update: async (req, res) => {
        try {
            const userId = req.body._id
            if (!userId) {
                return res.json({
                    message: "Id is required",
                    status: 400
                })
            }

            const updatedUser = await user.findByIdAndUpdate({
                _id: userId
            }, {
                name: req.body.name,
                email: req.body.email
            }, { new: true });

            if (!updatedUser) {
                return res.json({
                    message: "User not found",
                    status: 404
                })
            }
            return res.json({
                message: "Success",
                status: 200,
                body: updatedUser
            });

        } catch (error) {
            console.log(error)
        }
    },

    getUser: async (req, res) => {
        try {
            const userId = req.body._id
            if (!userId) {
                console.log("User id is required")
                return res.json({
                    message: "User id is required",
                    status: 400
                })
            }

            const userData = await user.findById(userId)
            if (!userData) {
                return res.json({
                    message: "User not found...",
                    status: 404
                })
            }
            return res.json({
                message: "Success",
                status: 200,
                body: userData
            })
        } catch (error) {
            console.log(error)
        }
    },

    deleteUser: async (req, res) => {
        try {
            const userId = req.body._id;
            if (!userId) {
                console.log("User id is required..")
                return res.json({
                    message: "User id is required...",
                    status: 400
                })
            }
            const userData = await user.findByIdAndDelete({ _id: userId });
            if (!userData) {
                return res.json({
                    message: "User not found...",
                    status: 404,
                })
            }
            return res.json({
                message: "success",
                status: 200,
                body: {}
            })
        } catch (error) {
            console.log(error)
        }
    },

    login: async (req, res) => {
        try {
            const users = await user.findOne({ email: req.body.email })
            const password = await users.password;
            const decryptPassword = await bcrypt.compare(req.body.password, password);

            if (decryptPassword == false) {
                return res.json({
                    message: "Dhang se daal"
                })

            }

            const token = await generateToken(users._id)
            console.log(token, "token")
            await users.updateOne({ token: token.token, loginTime: token.time })
            let obj = {
                name: users.name,
                _id: users._id,
                email: users.email,
                password: users.password,
                token: token ? token.token : null,
                loginTime: token ? token.time : null,
            };
            return res.json({
                message: "Success",
                status: 200,
                body: obj
            })
        } catch (error) {
            console.log(error)
        }
    }
})