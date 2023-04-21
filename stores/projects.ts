import { defineStore } from 'pinia'

import { Project } from '@/models/project'

export type ProjectsState = {
  projects: Project[];
  currentProjectSlug: string;
};


export const useProjectsStore = defineStore('projects', {
  state: () => ({ 
    projects: [
      { name: 'First project', slug: 'first-project', type: "Single", usage: 0},
      { name: 'Second project', slug: 'second-project', type: "Single", usage: 0},
    ],
    currentProjectSlug: ''
  } as ProjectsState),
  getters: {
    // projects: (state) => state.projects,
    // currentProjectSlug: (state) => state.currentProjectSlug,
    currentProject: (state) => state.projects.find(project => project.slug == state.currentProjectSlug)
  },
  actions: {
    setCurrentProject(newSlug: string) {
      this.currentProjectSlug = newSlug
    },
    getProjectBySlug(slug: string) {
      this.projects.find(project => project.slug == slug)
    },
    addProject(project: Project) {
      this.projects.push(project)
    },
    deleteProject(slug: string) {
      this.projects.splice(this.projects.findIndex(project => project.slug == slug), 1)
    },
  },
  persist: true,

})