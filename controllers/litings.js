
const Listing = require("../models/listing.js");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });


module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("./listings/index",{allListing})
}

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new")
 }


 module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    // console.log(listing)
    if(!listing){
        req.flash("error","The listing doesn't exist");
       return res.redirect("/listings");
    }
    res.render("./listings/show",{listing})
}

module.exports.createListing = async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
       


    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image ={url,filename};
    newListing.geometry=response.body.features[0].geometry
   let savedListing =  await newListing.save();
//    console.log(savedListing);
   req.flash("success","new listing added");
    res.redirect("/listings");
 }

 module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id)
     if(!data){        
    res.redirect("/listings");
     }else{
        let originalImageURL = data.image.url;
        originalImageURL = originalImageURL.replace("/upload","/upload/h_300,w_200");
        res.render("./listings/edit",{data,originalImageURL});
     }
   
}


module.exports.renderUpdateForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image ={url,filename};
        await listing.save();
    }
   
    req.flash("success"," listing updated");
    res.redirect(`/listings/${id}`);

}


module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
}