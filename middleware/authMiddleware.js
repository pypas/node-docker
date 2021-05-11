const protect = (req, res, next) => {
    const {user} = req.session

    if(!user) {
        return res.status(401).json({
            status: "fail",
            message: "unauthorized"
        })
    }

    req.user = user

    // Sends it to the controller or to the next middleware in the stack
    next()
}

module.exports = protect