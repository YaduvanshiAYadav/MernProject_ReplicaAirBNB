const Listing = require("../models/listing");

//index route
module.exports.index = async (req, res)=>{
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("./listings/index.ejs", {allListings});
};

//new route
module.exports.renderNewForm = (req, res)=>{
    res.render("./listings/new.ejs");
};

//show route
module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate:{
            path: "author",
        },
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exists !");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", {listing});
};

//create route
module.exports.createListing = async(req, res, next)=>{
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    newListing.image ={url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
    
};

//edit route
module.exports.renderEditForm = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exists !");
        res.redirect("/listings");
    }
    let originalImageUrl= listing.image.url;
    originalImageUrl.replace("/upload", "/upload/h_50,w_50");

    res.render("./listings/edit.ejs",{listing, originalImageUrl});
};

//update listing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url, filename};
    await listing.save();
    }

    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/${id}`);
};

//delete listings
module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings");
};