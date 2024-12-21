const Artist = require("../model/artist")
const nodemailer = require("nodemailer")

const findAll = async (req, res) => {
    try {
        const artist = await Artist.find();
        res.status(200).json(artist);
    } catch (e) {
        res.json(e);
    }
}

const save = async (req, res) => {
    try {
        const { full_name, email, contact_no, address, password } = req.body;
        const artist = new Artist({
            full_name,
            email, contact_no,
            address, identification_img: req.file.originalname, password
        });
        await artist.save();
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            post: 587,
            secure: false,
            protocol: "smtp",
            auth: {
                user: "krishikakh@gmail.com",
                pass: "hmxbqsgauphirwab"
            }
        })
        const info = await transporter.sendMail(
            {
                from: "krishikakh@gmail.com",
                // to:"iirkkrii8@gmail.com",
                to: artist.email,
                subject: "Artist Registration",
                html: `
                <h1> your regustration haaas been completed</h1>`
            }
        )

        res.status(201).json({ artist, info });

    } catch (e) {
        res.json(e);
    }
}

// const save = async (req, res) => {
//     try {
//         const { full_name, email, contact_no, address, password } = req.body;

//         // Validate required fields
//         if (!full_name || !email || !contact_no || !address || !password || !req.file) {
//             return res.status(400).json({ error: "All fields are required, including file upload." });
//         }

//         // Create artist instance
//         const artist = new Artist({
//             full_name,
//             email,
//             contact_no,
//             address,
//             identification_img: req.file.originalname,
//             password
//         });

//         // Save artist to database
//         await artist.save();

//         // Send email
//         const transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 587, // Fixed typo: 'post' -> 'port'
//             secure: false,
//             auth: {
//                 user: "krishikakh@gmail.com",
//                 pass: "hmxbqsgauphirwab" // Consider using environment variables for security
//             }
//         });

//         const info = await transporter.sendMail({
//             from: "krishikakh@gmail.com",
//             to: artist.email,
//             subject: "Artist Registration",
//             html: `<h1>Your registration has been completed successfully</h1>`
//         });

//         // Respond with success
//         res.status(201).json({ artist, emailInfo: info });

//     } catch (e) {
//         console.error("Error saving artist:", e); // Log error for debugging
//         res.status(500).json({ error: "An error occurred while saving the artist.", details: e.message });
//     }
// };


const findById = async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        res.status(200).json(artist)
    } catch (e) {
        res.json(e)
    }
}

const deleteById = async (req, res) => {
    try {
        const artist = await Artist.findByIdAndDelete(req.params.id);
        res.status(200).json("Data deleted")
    } catch (e) {
        res.json(e)
    }
}

const update = async (req, res) => {
    try {
        const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json("Data updated")
    } catch (e) {
        res.json(e)
    }
}

module.exports = {
    findAll,
    save,
    findById,
    deleteById,
    update,

}
