import { useQuery } from '@tanstack/react-query'
import { Project } from '../models'

const ENDPOINT = 'https://technical-test-866419219838.europe-west3.run.app/projects'

/**
 * For the sake of simplicity, make every entity id unique.
 *
 * This helps for React Flow node ID uniqueness.
 */
function sanitize(project: Project): Project {
  const randomId = () => Math.floor(Math.random() * 1000000)
  return {
    ...project,
    id: randomId(),
    technicalChallenges: project.technicalChallenges.map((challenge) => ({
      ...challenge,
      id: randomId(),
      biologicalModels: challenge.biologicalModels.map((model) => ({
        ...model,
        id: randomId(),
      })),
    })),
  }
}

/**
 * Fetch the project from the API.
 */
export function useProject(projectId: number) {
  return useQuery<Project, Error>({
    queryKey: ['asteria-project', projectId],
    queryFn: async () => {
      const res = await fetch(`${ENDPOINT}/${projectId}`)
      if (!res.ok) {
        throw new Error('Failed to fetch project')
      }

      // Check if the project is valid JSON beforehand.
      // The technical test was mentioning about the project 1, which is valid JSON.
      // But if we decided to test with project 2, it's a string 'Hello, world!' (possibly a fallback).
      const text = await res.text()
      if (!text.startsWith('{')) {
        throw new Error('Project is not a valid JSON')
      }

      const json = JSON.parse(text)
      return sanitize(json)
    },
  })
}
