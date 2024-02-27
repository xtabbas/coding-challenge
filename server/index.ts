import express, { Request, Response } from "express";
import mongoose, { Schema, Document, Model, ConnectOptions } from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";

interface IIssue extends Document {
  name: string;
  description: string;
  project: string;
}

interface IProject extends Document {
  name: string;
  description: string;
}

const app: express.Application = express();
const PORT: string | number = process.env.PORT || 3001;

// Connect to MongoDB

mongoose.connect(
  "mongodb://0.0.0.0:27017/issue_tracker",
  {} as ConnectOptions
);

mongoose.connection.on("error", function (e) {
  console.log(
    "Error: Could not connect to MongoDB. Did you forget to run `mongod`?",
     e
  );
});

// Define a schema for Issues
const issueSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  typeColor: { type: String, required: true },
  project: { type: String, required: true },
  assignee: { type: String, required: false },
  priority: { type: String, required: true },
});

// Define a schema for Projects
const projectSchema: Schema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
});

// Create models
const Issue: Model<IIssue> = mongoose.model<IIssue>("Issue", issueSchema);
const Project: Model<IProject> = mongoose.model<IProject>(
  "Project",
  projectSchema
);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Populate DB from stub.json
const populateDB = async (): Promise<void> => {
  const mockDataPath: string = path.join(__dirname, "stub.json");
  const mockData: { projects: IProject[]; issues: IIssue[] } = JSON.parse(
    fs.readFileSync(mockDataPath, "utf8")
  );

  try {
    await Project.deleteMany({});
    await Issue.deleteMany({});
  } catch (e) {}

  console.log("mockData", mockData);

  await Project.insertMany(mockData.projects);
  await Issue.insertMany(mockData.issues);
};

// GET endpoint for issues and projects
app.get("/api/issues", async (req: Request, res: Response) => {
  const issues: IIssue[] = await Issue.find({});
  res.json(issues);
});

app.get("/api/projects", async (req: Request, res: Response) => {
  const projects: IProject[] = await Project.find({});
  res.json(projects);
});

// POST endpoint to update an issue
app.post("/api/issues/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const update = req.body;

  try {
    const updatedIssue: IIssue | null = await Issue.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );
    res.json(updatedIssue);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  populateDB().then(() => console.log("DB populated with mock data."));
});
