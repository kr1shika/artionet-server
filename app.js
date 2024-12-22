const express = require('express');
const app = express();
const connectDb = require("./config/db")
const userRouter = require("./route/userRoute")
const purchaseRouter = require("./route/purchaseRoute")
const artworkRouter = require("./route/artworkRoute")
const AuthRouter = require("./route/adminRoute")


connectDb();
app.use(express.json());

const port = 5055;
app.listen(port, () => {
    console.log('Server running at http://localhost:${port}' + port);
});

app.use("/api/user", userRouter);
app.use("/api/purchases", purchaseRouter);
app.use("/api/artwork", artworkRouter);

app.use("/api/auth", AuthRouter)