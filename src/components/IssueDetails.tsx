import React, { useState, useEffect } from "react";
import { Issue, Project } from "../model";

interface IssueDetailsProps {
  selectedIssue: Issue;
  member: string;
  project: Project | undefined;
  declineSelectedIssue: () => void;
  acceptSelectedIssue: () => void;
}

const IssueDetails: React.FC<IssueDetailsProps> = ({
  member,
  project,
  selectedIssue,
  declineSelectedIssue,
  acceptSelectedIssue,
}) => (
  <div className="issue-details-container">
    <div className="issue-content">
      <div style={{ marginTop: 14 }}>
        <p className="issue-project-name">
          {project?.code}: {project?.name}
        </p>
        <h1 className="issue-title">{selectedIssue.title}</h1>
        <div className="issue-details">
          <p
            className="issue-type"
            style={{ background: selectedIssue.typeColor }}
          >
            {selectedIssue.type}
          </p>
          <p className="issue-priority">p{selectedIssue.priority}</p>
        </div>
      </div>
      <p className="issue-description">{selectedIssue.description}</p>
      <div className="issue-actions">
        {selectedIssue.assignee !== "" && (
          <>assigned to {selectedIssue.assignee}</>
        )}
        {selectedIssue.assignee === "" && (
          <>
            <p onClick={declineSelectedIssue} className="action-decline">
              Decline
            </p>
            <p
              onClick={acceptSelectedIssue}
              className={`action-accept ${
                selectedIssue.assignee === member ? "accepted" : ""
              }`}
            >
              Accept
            </p>
          </>
        )}

        {selectedIssue.assignee === member && (
          <p onClick={declineSelectedIssue} className="action-decline">
            Decline
          </p>
        )}
      </div>
    </div>
  </div>
);

export default IssueDetails;