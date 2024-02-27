import React, { useState, useEffect } from "react";
import { Issue, Project } from "./model";

export const useIssuesController = (
  issues: Issue[],
  updateIssues: (updatedIssue: Issue) => void,
  member: string,
  loadingIssues: boolean
) => {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [updatingIssue, setUpdatingIssue] = useState<boolean>(false);

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase());
  };

  const updateIssueOnServer = async (updatedIssue: Issue) => {
    setUpdatingIssue(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/issues/${updatedIssue._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedIssue),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update the issue on the server");
      }
      const data = await response.json();
      updateIssues(data);
      setSelectedIssue(updatedIssue);
    } catch (error) {
      console.error("Error updating issue:", error);
    } finally {
      setUpdatingIssue(false);
    }
  };

  const declineSelectedIssue = () => {
    if (!selectedIssue) return;
    const updatedIssue = {
      ...selectedIssue,
      assignee: "",
    };
    // setSelectedIssue(updatedIssue);
    updateIssueOnServer(updatedIssue);
  };

  const acceptSelectedIssue = () => {
    if (!selectedIssue) return;
    const updatedIssue = {
      ...selectedIssue,
      assignee: member,
    };
    // setSelectedIssue(updatedIssue);
    updateIssueOnServer(updatedIssue);
  };

  const filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(filter) ||
      issue.type.toLowerCase().includes(filter) ||
      issue.assignee.toLowerCase().includes(filter) ||
      issue.priority.toLowerCase().includes(filter) ||
      issue.project.toLowerCase().includes(filter)
  );

  return {
    selectedIssue,
    filteredIssues,
    handleIssueClick,
    handleFilterChange,
    declineSelectedIssue,
    acceptSelectedIssue,
    loadingIssues: loadingIssues || updatingIssue,
  };
};