import React, { useState, useEffect } from "react";

export interface Issue {
  _id: string;
  title: string;
  description: string;
  type: string;
  project: string;
  assignee: string;
  typeColor: string;
  priority: string;
}

export interface Project {
  code: string;
  name: string;
  description: string;
}

export const useIssuesModel = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/issues")
      .then((response) => response.json())
      .then((data) => {
        setIssues(data);
        setLoadingIssues(false);
      });
  }, []);

  const updateIssues = (updatedIssue: Issue) => {
    const updatedIssues = issues.map((issue) =>
      issue._id === updatedIssue._id ? updatedIssue : issue
    );
    setIssues(updatedIssues);
  };

  return { issues, updateIssues, loadingIssues };
};

export const useProjectsModel = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setLoadingProjects(false);
      });
  }, []);

  const updateProjects = (updatedProject: Project) => {
    const updatedProjects = projects.map((project) =>
      project.code === updatedProject.code ? updatedProject : project
    );
    setProjects(updatedProjects);
  };

  return { projects, updateProjects, loadingProjects };
};