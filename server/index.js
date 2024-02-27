"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var body_parser_1 = require("body-parser");
var cors_1 = require("cors");
var fs_1 = require("fs");
var path_1 = require("path");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3001;
// Connect to MongoDB
mongoose_1.default.connect("mongodb://0.0.0.0:27017/issue_tracker", {});
mongoose_1.default.connection.on("error", function (e) {
    console.log("Error: Could not connect to MongoDB. Did you forget to run `mongod`?", e);
});
// Define a schema for Issues
var issueSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    typeColor: { type: String, required: true },
    project: { type: String, required: true },
    assignee: { type: String, required: false },
    priority: { type: String, required: true },
});
// Define a schema for Projects
var projectSchema = new mongoose_1.default.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
});
// Create models
var Issue = mongoose_1.default.model("Issue", issueSchema);
var Project = mongoose_1.default.model("Project", projectSchema);
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Populate DB from stub.json
var populateDB = function () { return __awaiter(void 0, void 0, void 0, function () {
    var mockDataPath, mockData, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mockDataPath = path_1.default.join(__dirname, "stub.json");
                mockData = JSON.parse(fs_1.default.readFileSync(mockDataPath, "utf8"));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Project.deleteMany({})];
            case 2:
                _a.sent();
                return [4 /*yield*/, Issue.deleteMany({})];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                return [3 /*break*/, 5];
            case 5:
                console.log("mockData", mockData);
                return [4 /*yield*/, Project.insertMany(mockData.projects)];
            case 6:
                _a.sent();
                return [4 /*yield*/, Issue.insertMany(mockData.issues)];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// GET endpoint for issues and projects
app.get("/api/issues", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var issues;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Issue.find({})];
            case 1:
                issues = _a.sent();
                res.json(issues);
                return [2 /*return*/];
        }
    });
}); });
app.get("/api/projects", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var projects;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Project.find({})];
            case 1:
                projects = _a.sent();
                res.json(projects);
                return [2 /*return*/];
        }
    });
}); });
// POST endpoint to update an issue
app.post("/api/issues/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, update, updatedIssue, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                update = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Issue.findByIdAndUpdate(id, update, { new: true })];
            case 2:
                updatedIssue = _a.sent();
                res.json(updatedIssue);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(400).send(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Start the server
app.listen(PORT, function () {
    console.log("Server is running on http://localhost:".concat(PORT));
    populateDB().then(function () { return console.log("DB populated with mock data."); });
});
