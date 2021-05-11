const express = require("express");

const postConstroller = require("../controllers/postController")
const protect = require("../middleware/authMiddleware")

const router = express.Router()

router.route("/")
    .get(protect, postConstroller.getAllPosts)
    .post(protect, postConstroller.createPost)

router.route("/:id")
    .get(protect, postConstroller.getOnePost)
    .patch(protect, postConstroller.updatePost)
    .delete(protect, postConstroller.deletePost)

module.exports = router