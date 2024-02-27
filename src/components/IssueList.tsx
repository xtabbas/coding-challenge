import React, { useState, useEffect } from "react";
import { Issue, Project } from "../model";

interface IssueListProps {
  filteredIssues: Issue[];
  handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIssueClick: (issue: Issue) => void;
  selectedIssue: Issue | null;
  loading: Boolean;
}

const IssueList: React.FC<IssueListProps> = ({
  filteredIssues,
  handleFilterChange,
  handleIssueClick,
  selectedIssue,
  loading,
}) => (
  <div className="issue-list">
    <h1> Issue Triage</h1>
    <input
      type="text"
      placeholder="Filter by project, type, or title..."
      onChange={handleFilterChange}
      className="issue-filter-input"
    />
    {loading && <div>Networking...</div>}
    {filteredIssues.map((issue) => (
      <div
        className={`issue-item ${
          selectedIssue && selectedIssue._id === issue._id
            ? "selected-issue"
            : ""
        }`}
        key={issue._id}
        onClick={() => handleIssueClick(issue)}
      >
        <div>
          <p className="issue-title">{issue.title}</p>
          <div className="issue-details">
            <p className="issue-type" style={{ background: issue.typeColor }}>
              {issue.type}
            </p>
            <p className="issue-priority">p{issue.priority}</p>
            <p className="issue-assignee">{issue.assignee || "unassigned"}</p>
          </div>
        </div>
        <p className="issue-project">{issue.project}</p>
      </div>
    ))}
  </div>
);

export default IssueList;