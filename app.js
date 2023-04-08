const express=require("express");
const cors=require("cors");
const app=express();

//-----------Connect To Database-----------
const connect_MongoDB=require("./helpers/connectDB");
connect_MongoDB();

//-----------App  Middleware-----------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//-----------ROUTES-----------
app.use("/api",require("./routes/auth"))

//-----------Server-----------
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is working on port: http://localhost:${PORT}`);
});
