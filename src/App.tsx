import React, { useState, useEffect } from "react";
import "./css/App.css";
import IssueList from "./components/IssueList";
import IssueDetails from "./components/IssueDetails";
import { useIssuesModel } from "./model";
import { useProjectsModel } from "./model";
import { useIssuesController } from "./controller";
import { Issue, Project } from "./model";

function App() {
  const member: string = "Abbas K.";

  const { issues, updateIssues, loadingIssues } = useIssuesModel();
  const { projects, updateProjects, loadingProjects } = useProjectsModel();

  const {
    selectedIssue,
    filteredIssues,
    handleIssueClick,
    handleFilterChange,
    declineSelectedIssue,
    acceptSelectedIssue,
    loadingIssues: controllerLoadingIssues,
  } = useIssuesController(issues, updateIssues, member, loadingIssues);

  // View

  return (
    <div className="App">
      <div className="app-container">
        <IssueList
          loading={loadingIssues || loadingProjects}
          filteredIssues={filteredIssues}
          handleFilterChange={handleFilterChange}
          handleIssueClick={handleIssueClick}
          selectedIssue={selectedIssue}
        />
        {selectedIssue && (
          <IssueDetails
            project={projects.find((p) => p.code === selectedIssue.project)}
            selectedIssue={selectedIssue}
            declineSelectedIssue={declineSelectedIssue}
            acceptSelectedIssue={acceptSelectedIssue}
            member={member}
          />
        )}
      </div>
    </div>
  );
}

export default App;

