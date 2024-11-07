// server/middleware/auth.js
import admin from "../firebasead/firebaseAdmin.js";

// Function to verify token and check expiration
export async function verifyToken(idToken) {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const currentTime = Math.floor(Date.now() / 1000);

        // Ensure the token is no older than 1 minute
        if (currentTime - decodedToken.auth_time > 60) {
            throw new Error("Token is older than 1 minute and considered expired.");
        }

        return decodedToken;
    } catch (error) {
        console.error("Token verification failed:", error);
        throw error;
    }
}

// Middleware to use in routes
export const verifyAuthToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
    if (!idToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decodedToken = await verifyToken(idToken);
        req.user = decodedToken; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: "Token verification failed" });
    }
};
