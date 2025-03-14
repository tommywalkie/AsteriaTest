import { useMemo } from 'react'
import { Edge, MarkerType, Position } from '@xyflow/react'
import { AsteriaNode, Project } from '../models'

export const PROJECT_COLUMN = 0
export const TECHNICAL_CHALLENGE_COLUMN = 500
export const BIOLOGICAL_MODEL_COLUMN = 1000
export const MODEL_SPACING = 120

/**
 * Compute the React Flow nodes and edges for a project.
 *
 * Attempts to structure the nodes with 3 columns:
 * - Project
 * - Technical Challenges
 * - Biological Models
 *
 * Also, tries to make the technical challenges align with their first biological model.
 */
export function useProjectFlow(project?: Project) {
  return useMemo<[AsteriaNode[], Edge[]]>(() => {
    if (!project) return [[], []]
    const projectNode: AsteriaNode = {
      id: project.id.toString(),
      type: 'project',
      data: { id: project.id, label: project?.name },
      position: { x: PROJECT_COLUMN, y: 0 },
      sourcePosition: Position.Right,
      draggable: true,
    }

    let currentY = 0
    const technicalChallenges: AsteriaNode[] = []
    const biologicalModels: AsteriaNode[] = []
    const edges: Edge[] = []

    project.technicalChallenges?.forEach((challenge) => {
      technicalChallenges.push({
        id: challenge.id.toString(),
        type: 'technicalChallenge',
        data: {
          id: challenge.id,
          label: challenge.name,
        },
        position: { x: TECHNICAL_CHALLENGE_COLUMN, y: currentY },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: true,
      })
      edges.push({
        id: `project-${project.id}-challenge-${challenge.id}`,
        source: project.id.toString(),
        target: challenge.id.toString(),
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      })

      let modelY = currentY
      challenge.biologicalModels.forEach((model) => {
        biologicalModels.push({
          id: model.id.toString(),
          type: 'biologicalModel',
          data: { id: model.id, label: model.name },
          position: { x: BIOLOGICAL_MODEL_COLUMN, y: modelY },
          targetPosition: Position.Left,
          draggable: true,
        })
        edges.push({
          id: `challenge-${challenge.id}-model-${model.id}`,
          source: challenge.id.toString(),
          target: model.id.toString(),
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        })
        modelY += MODEL_SPACING
      })
      currentY += Math.max(MODEL_SPACING, challenge.biologicalModels.length * MODEL_SPACING)
    })

    const nodes = [projectNode, ...technicalChallenges, ...biologicalModels]
    return [nodes, edges]
  }, [project])
}
