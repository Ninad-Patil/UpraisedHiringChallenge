import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import gadgetRoutes from "./routes/gadgetRoutes.js";
import setupSwagger from "./swagger.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
setupSwagger(app);
app.use("/", (req, res) =>
  res.status(200).json("Hello there, please go to /api-docs")
);
app.use("/auth", authRoutes);
app.use("/gadgets", gadgetRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
