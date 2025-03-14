import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { BiologicalModel, Project } from '../models'
import { useProject } from '../hooks/useProject'

interface ProjectContextType {
  project: Project | undefined
  loading: boolean
  error: Error | null
  addModel: (challengeId: number, modelName: string) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function useProjectContext() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider')
  }
  return context
}

interface ProjectProviderProps {
  children: ReactNode
  projectId?: number
}

export function ProjectProvider({ children, projectId = 1 }: ProjectProviderProps) {
  const { data: initialProject, isFetching, error } = useProject(projectId)
  const [project, setProject] = useState<Project | undefined>(undefined)

  useEffect(() => {
    if (initialProject) {
      setProject(initialProject)
    }
  }, [initialProject])

  // Function to add a new biological model to a challenge
  const addModel = (challengeId: number, modelName: string) => {
    if (!project) return

    // Create a new model with a unique ID
    const newModel: BiologicalModel = {
      id: Date.now(),
      name: modelName,
    }

    // Create a new project with the updated model
    const updatedProject = {
      ...project,
      technicalChallenges: project.technicalChallenges.map((challenge) => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            biologicalModels: [...challenge.biologicalModels, newModel],
          }
        }
        return challenge
      }),
    }

    // Update the project state
    setProject(updatedProject)
  }

  const value = {
    project,
    loading: isFetching,
    error,
    addModel,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
