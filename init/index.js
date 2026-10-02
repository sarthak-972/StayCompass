const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main().then(() => {
    console.log("connected to DB")
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/staycompass");
};


// const initDB = async () => {
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => ({ ...obj, owner: "6aaa16f5309494ae23fd7e66", }));
//     await Listing.insertMany(initData.data);
//     console.log("data was initialized");
// };

const initDB = async () => {
    // 1. Wipe old data
    await Listing.deleteMany({});

    // 2. Format data and guarantee schema compliance
    const cleanData = initData.data.map((obj) => {
        // Strip out any broken geometry key if present in data.js
        const { geometry, ...rest } = obj;

        return {
            ...rest,
            owner: "6aaa16f5309494ae23fd7e66",
            geometry: {
                type: "Point",
                coordinates: [77.2090, 28.6139] // Fallback [lng, lat] (Delhi)
            }
        };
    });

    // 3. Insert guaranteed clean data
    await Listing.insertMany(cleanData);
    console.log("data was initialized successfully!");
};


initDB();