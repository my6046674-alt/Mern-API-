import dotenv from "dotenv";

dotenv.config();

const config = {
    appUrl: process.env.APP_URL || "http://localhost:8000",

    port: Number(process.env.PORT) ||8000,

    mongodbUrl: process.env.MONGODB_URL || process.env.MONGODB_URL || "",

    jwtSecret: process.env.JWT_SECRET || "",

    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.CLOUDINARY_API_KEY || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    },

    khalti: {
        apiUrl: process.env.KHALTI_API_URL || "",
        secretKey: process.env.KHALTI_SECRET_KEY || "",
        return_url: process.env.KHALTI_RETURN_URL || "",
    },
    // geminiApiKey: process.env.GEMINI_API_KEY || "",
};

export default config;
