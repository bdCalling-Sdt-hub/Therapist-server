const mewoImageUpload = async (req, res) => {
    try {
        // Access uploaded files
        const title1Images = req.files['title1image'];
        const title2Images = req.files['title2image'];

        // Process uploaded files as needed
        // For example, save them to a database or file system

        res.status(200).json({ message: "Images uploaded successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { mewoImageUpload };
