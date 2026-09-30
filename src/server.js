
import app from "./app.js";

import config from "./config/config.js";
import connectDB from "./config/database.js";
import connectCloudinary from "./config/cloudinary.js";

connectDB();

connectCloudinary();

app.listen(config.port, () => {
  console.log(`Server running at port ${config.port}...`);
});

