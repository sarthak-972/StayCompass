const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs")
}

module.exports.searchOption = async (req, res) => {
    try {
    const { q } = req.query;
    let allListings;

    if (q && q.trim() !== "") {
      const searchRegex = new RegExp(q.trim(), "i");
      allListings = await Listing.find({
        $or: [
          { location: searchRegex },
          { country: searchRegex },
          { title: searchRegex }
        ]
      });
    } else {
      allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings, searchQuery: q || "" });
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).send("Server Error");
  }}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send();


    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let savedList = await newListing.save();
    console.log(savedList);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }

    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/h_250,w_200")
    res.render("listings/edit.ejs", { listing, originalImage });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const { image, ...otherData } = req.body.listing;
    let listing = await Listing.findByIdAndUpdate(id, { ...otherData, image });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}