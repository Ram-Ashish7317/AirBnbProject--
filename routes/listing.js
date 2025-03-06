const express = require("express");
const router  = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {isLoggedin,isOwner,validateListing} = require("../middleware.js");
let path = require('path')
const listingController = require("../controllers/litings.js");
const { linkSync } = require("fs");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


 

router.route("/").get(wrapAsync (listingController.index)).post(isLoggedin,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));


router.get("/new",isLoggedin,listingController.renderNewForm);
 

router.route("/:id").get(wrapAsync(listingController.showListing)).patch(isLoggedin,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.renderUpdateForm)).delete(isLoggedin,isOwner,wrapAsync(listingController.destroyListing))


router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;