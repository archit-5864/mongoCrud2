const { generateToken } = require("../jwt/generateToken");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt")
const saltRounds = 10
const nodemailer = require("nodemailer")

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
            const newUser = await userModel.create({ ...req.body, password: hashPassword });
            let token;
            if (newUser) {
                const latestUser = await userModel.findOne(newUser._id);
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

            const updatedUser = await userModel.findByIdAndUpdate({
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

            const userData = await userModel.findById(userId)
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
            const userData = await userModel.findByIdAndDelete({ _id: userId });
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
            const users = await userModel.findOne({ email: req.body.email })
            if (!users) {
                return res.json({
                    message: "Incorrect username!"
                })
            }
            const decryptPassword = await bcrypt.compare(req.body.password, users.password);

            if (decryptPassword == false) {
                return res.json({
                    message: "Incorrect password!"
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
    },

    logOut: async (req, res) => {
        try {
            // console.log("lll")
            // console.log(req.user, "xwbhsbx")
            const userData = await userModel.findByIdAndUpdate({ _id: req.user._id }, {
                logintime: 0
            }, { new: true })
        } catch (error) {

        }
    },

    forgetPassword: async (req, res) => {
        try {
            const userEmail = req.body.email;
            const data = await userModel.findOne({ email: userEmail })

            var otp = Math.floor(Math.random() * 10000 + 1);
            // var otp = 4444;
            const user = await userModel.findByIdAndUpdate(
                {
                    _id: data._id,
                },
                { otp: otp }
            );
            var transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "f39ae1e4f58dad",
                    pass: "ab1a3fa7143df2"
                }
            });

            let info = await transport.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: req.body.email, // list of receivers
                subject: "OTP generate ✔", // Subject line
                text: "Hello world?", // plain text body
                html: `<b>Hello world? Here is your otp: :
                ${otp}
                 </b>`,
            });

        } catch (error) {

        }
    },

    resendOtp: async (req, res) => {
        try {
            const userEmail = req.body.email;
            const data = await userModel.findOne({ email: userEmail })

            var otp = Math.floor(Math.random() * 10000 + 1)

            const user = await userModel.findByIdAndUpdate(
                {
                    _id: data._id,
                },
                {
                    otp: otp
                }
            );

            const transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "f39ae1e4f58dad",
                    pass: "ab1a3fa7143df2"
                }
            });

            const info = transport.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: req.body.email, // list of receivers
                subject: "OTP generate ✔", // Subject line
                text: "Hello world?", // plain text body
                html: `<b>Hello user? Here is your otp: :
                ${otp}
                 </b>`,
            })
        } catch (error) {
            console.log(error)
        }
    }
})