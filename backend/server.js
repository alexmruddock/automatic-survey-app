const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Model imports
const User = require("./models/User");
const Survey = require("./models/Survey");
const Response = require("./models/Response");

// Set up express server
const app = express();
app.use(express.json());
app.use(cors());

// Load environment variables from .env file
require("dotenv").config();

// get tokens from local storage
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Survey App Backend is running");
});

// Refresh token route
app.post("/token", async (req, res) => {
  const { refreshToken } = req.body; // Get refresh token from request body
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token is required" });

  const user = await User.findOne({ refreshToken }); // Find user by refresh token
  if (!user)
    return res
      .status(403)
      .json({ message: "Refresh token is invalid or expired" });

  jwt.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Failed to verify refresh token" });

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      accessTokenSecret,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  });
});

// Register new user with email and password
app.post("/register", async (req, res) => {
  try {
    let { email, password } = req.body;

    // Default role set to 'member'
    const user = new User({ email, password, role: "member" });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error); // Log the full error object
    res.status(500).send("Error registering user: " + error.message); // Send a generic error message
  }
});

// User Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Return JSON response for invalid credentials
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      accessTokenSecret,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      refreshTokenSecret,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    // Return JSON response for server error
    res.status(500).json({ message: "Error logging in user" });
  }
});

// Logout user
app.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  res.sendStatus(204);
});

// fetch user profile
app.get("/fetch-user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("email role");

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json({ email: user.email, role: user.role });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
});

// fetch all users
app.get("/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords for security
    res.json(users);
  } catch (error) {
    res.status(500).send({ message: "Error fetching users." });
  }
});

// update user role
app.put(
  "/update-user/:userId",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params; // Get user ID from request parameters
      const { newRole } = req.body; // 'admin' or 'member'

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }
      res.json({ message: "User role updated successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error updating user role." });
    }
  }
);

// delete user
app.delete(
  "/delete-user/:userId",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params; // Get user ID from request parameters
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found." });
      }
      res.json({ message: "User deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user." });
    }
  }
);

// OpenAI API
const { OpenAI } = require("openai");

// Get key from .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate survey questions from description
app.post("/generate-survey", authenticateToken, isAdmin, async (req, res) => {
  const description = req.body.description;
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant designed to create surveys in JSON format. Include: title, description, question types. For properties names only use underlines, not spaces.",
        },
        {
          role: "user",
          content: `Generate survey questions in a structured format based on this description: ${description}`,
        },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });

    console.log("Survey content: ", chatCompletion.choices[0], "\n");

    // Assuming the last message in the completion is the survey
    const generatedSurvey = chatCompletion.choices[0].message.content;
    console.log("Generated JSON Survey: \n", generatedSurvey);
    res.json({ survey: generatedSurvey }); // what is this line doing?
  } catch (error) {
    console.error("Error generating survey with OpenAI:", error);

    if (error.response) {
      console.error("Response:", error.response.data);
    }
    return res.status(500).send("Error generating survey");
  }
});

// Analyze survey responses
app.post(
  "/analyze-responses/:surveyId",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { surveyId } = req.params;
    try {
      const responses = await Response.find({ surveyId });

      // Prepare data for analysis
      const dataForAnalysis = responses.map((response) => {
        // Format the data in a way that is suitable for OpenAI
        return {
          user: response.userEmail,
          answers: response.answers,
        };
      });

      // Send the data to OpenAI for analysis
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are an expert researcher designed to interpret survey responses and hunt for insights.",
          },
          {
            role: "user",
            content: `Analyze this: ${JSON.stringify(dataForAnalysis)}`,
          },
        ],
        model: "gpt-3.5-turbo-1106",
      });

      console.log(
        "Analysis content: ",
        chatCompletion.choices[0].message.content,
        "\n"
      );

      // Send the analysis result back to the client
      res.json({ analysis: chatCompletion.choices[0].message.content });
    } catch (error) {
      console.error("Error analyzing responses:", error);
      res.status(500).send("Error analyzing responses");
    }
  }
);

// Create a new survey in the database from the generated survey
app.post("/create-survey", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, description, questions } = req.body; // Assuming these fields are in the request body

    const newSurvey = new Survey({ title, description, questions });
    await newSurvey.save(); // Save the survey to the database

    res.status(201).json({
      message: "Survey created successfully",
      surveyId: newSurvey._id,
    });
  } catch (error) {
    console.error("Error creating survey:", error);
    res.status(500).send("Error creating survey");
  }
});

// Submit a response to a survey
app.post("/submit-response", async (req, res) => {
  const { surveyId, answers, userEmail } = req.body;
  try {
    const response = new Response({ surveyId, answers, userEmail });
    await response.save();
    res.status(201).json("Response recorded");
  } catch (error) {
    res.status(500).json("Error submitting response: " + error.message);
  }
});

// Get all surveys
app.get("/get-surveys", async (req, res) => {
  try {
    const surveys = await Survey.find();
    console.log("Sending surveys:", surveys); // Log the surveys to be sent
    res.json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error); // Make sure to log the error
    res.status(500).json({ message: error.message });
  }
});

// Get survey by ID
app.get("/retrieve-survey/:surveyId", async (req, res) => {
  try {
    const surveyId = req.params.surveyId;
    const survey = await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).send("Survey not found");
    }

    res.json(survey);
  } catch (error) {
    console.error("Error fetching survey:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete survey by ID
app.delete(
  "/delete-survey/:surveyId",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const surveyId = req.params.surveyId;
      const survey = await Survey.findByIdAndDelete(surveyId);

      if (!survey) {
        return res.status(404).send("Survey not found");
      }

      res.status(200).send("Survey deleted");
    } catch (error) {
      console.error("Error deleting survey:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get responses for a single survey
app.get(
  "/survey-responses/:surveyId",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const surveyId = req.params.surveyId;
      const responses = await Response.find({ surveyId });
      res.json(responses);
    } catch (error) {
      console.error("Error fetching responses:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Start the server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`, "\n");
});

// Middleware to authenticate JWT token and add user to request object (req.user)
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).send("Access denied");
}