const express = require("express");
const cors = require("cors");
const app = express();

//-----------Connect To Database-----------
const connect_MongoDB = require("./helpers/connectDB");
connect_MongoDB();

//-----------App  Middleware-----------
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
//RAM changes 17/06/2023 for IMG BAse64
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

//-----------ROUTES-----------
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/building"));
app.use("/api", require("./routes/seller"));
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/booking"));

//-----------Server-----------
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is working on port : http://localhost:${PORT}`);
});

// Call the function to delete unverified accounts every day at 12:00 AM
const deleteUnverifiedAccounts = require("./helpers/deleteUnverifiedAccounts");

// Call the function once at startup to clean up any existing unverified accounts
deleteUnverifiedAccounts();

// require("node-cron").schedule("0 0 * * *", deleteUnverifiedAccounts);
