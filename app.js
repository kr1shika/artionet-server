const express = require('express');
const app = express();
const connectDb = require("./config/db");
const userRouter = require("./route/userRoute");
const purchaseRouter = require("./route/purchaseRoute");
const artworkRouter = require("./route/artworkRoute");
const artEnquiryRoute = require("./route/artEnquiryRoute");

const AuthRouter = require("./route/adminRoute");
const cors = require("cors");
const path = require("path");
app.use("/artwork_space", express.static(path.join(__dirname, "artwork_space")));
app.use("/artist_identity", express.static(path.join(__dirname, "artist_identity")));

connectDb();
app.use(express.json());

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

const port = 5055;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/purchases", purchaseRouter);
app.use("/api/artwork", artworkRouter);
app.use("/api/enquiry", artEnquiryRoute)
app.use("/api/auth", AuthRouter);
