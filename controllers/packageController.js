const Response = require("../helpers/response");
const Package = require("../models/Package");

const createPackage = async (req, res) => {

    const { name, price, description } = req.body;
    const package = await Package.create({ name, price, description });

    res.status(201).json(Response({ message: "Package created successfully", data: package, type: "Package", status: "Created", stausCode: 201 }));
}

const getPackages = async (req, res) => {
    const packages = await Package.find();
    res.status(200).json(Response({ message: "Packages fetched successfully", data: packages, type: "Packages", status: "OK", statusCode: 200 }));
}

module.exports = {
    createPackage,
    getPackages
}