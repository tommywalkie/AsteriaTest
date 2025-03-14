import { renderHook } from '@testing-library/react'
import {
  useProjectFlow,
  PROJECT_COLUMN,
  TECHNICAL_CHALLENGE_COLUMN,
  BIOLOGICAL_MODEL_COLUMN,
  MODEL_SPACING,
} from './useProjectFlow'
import { Project } from '../models'
import { Position, MarkerType, EdgeMarker } from '@xyflow/react'
import { describe, it, expect } from 'vitest'

describe('useProjectFlow', () => {
  // Sample test project data
  const testProject: Project = {
    id: 42,
    name: 'Artificial Photosynthesis System',
    technicalChallenges: [
      {
        id: 101,
        name: 'Develop efficient light-harvesting complexes that can capture a broad spectrum of solar energy',
        biologicalModels: [
          {
            id: 201,
            name: 'Chlorophyll-Inspired Synthetic Pigments with Enhanced Absorption Range',
          },
          {
            id: 202,
            name: 'Quantum Dot Arrays Mimicking Photosystem II Structure',
          },
        ],
      },
      {
        id: 102,
        name: 'Design catalytic systems for water oxidation that operate at ambient conditions',
        biologicalModels: [
          {
            id: 203,
            name: 'Manganese-Calcium Complex Based on OEC Structure',
          },
        ],
      },
    ],
  }

  it('should return empty arrays when no project is provided', () => {
    const { result } = renderHook(() => useProjectFlow())

    expect(result.current[0]).toEqual([])
    expect(result.current[1]).toEqual([])
  })

  it('should create correct nodes and edges from project data', () => {
    const { result } = renderHook(() => useProjectFlow(testProject))
    const [nodes, edges] = result.current

    // Check total number of nodes and edges
    expect(nodes.length).toBe(6) // 1 project + 2 challenges + 3 models
    expect(edges.length).toBe(5) // 2 project->challenge + 3 challenge->model
  })

  it('should create a project node with correct properties', () => {
    const { result } = renderHook(() => useProjectFlow(testProject))
    const [nodes] = result.current

    const projectNode = nodes.find((node) => node.id === testProject.id.toString())

    expect(projectNode).toBeDefined()
    expect(projectNode?.type).toBe('project')
    expect(projectNode?.data.label).toBe(testProject.name)
    expect(projectNode?.position.x).toBe(PROJECT_COLUMN)
    expect(projectNode?.position.y).toBe(0)
    expect(projectNode?.sourcePosition).toBe(Position.Right)
    expect(projectNode?.draggable).toBe(true)
  })

  it('should create technical challenge nodes with correct properties', () => {
    const { result } = renderHook(() => useProjectFlow(testProject))
    const [nodes] = result.current

    const challengeNodes = nodes.filter((node) => node.type === 'technicalChallenge')

    expect(challengeNodes.length).toBe(2)

    // Check first challenge node
    const firstChallenge = challengeNodes[0]
    expect(firstChallenge.id).toBe(testProject.technicalChallenges[0].id.toString())
    expect(firstChallenge.data.label).toBe(testProject.technicalChallenges[0].name)
    expect(firstChallenge.position.x).toBe(TECHNICAL_CHALLENGE_COLUMN)
    expect(firstChallenge.sourcePosition).toBe(Position.Right)
    expect(firstChallenge.targetPosition).toBe(Position.Left)
  })

  it('should create biological model nodes with correct properties', () => {
    const { result } = renderHook(() => useProjectFlow(testProject))
    const [nodes] = result.current

    const modelNodes = nodes.filter((node) => node.type === 'biologicalModel')

    expect(modelNodes.length).toBe(3)

    // Check a specific model node
    const secondModel = modelNodes[1]
    expect(secondModel.type).toBe('biologicalModel')
    expect(secondModel.position.x).toBe(BIOLOGICAL_MODEL_COLUMN)
    expect(secondModel.targetPosition).toBe(Position.Left)
  })

  it('should create edges connecting project to challenges', () => {
    const { result } = renderHook(() => useProjectFlow(testProject))
    const [, edges] = result.current

    const projectEdges = edges.filter((edge) => edge.source === testProject.id.toString())

    expect(projectEdges.length).toBe(2)

    // Check properties of first edge
    const firstEdge = projectEdges[0]
    expect(firstEdge.target).toBe(testProject.technicalChallenges[0].id.toString())
    expect(firstEdge.animated).toBe(true)
    expect((firstEdge.markerEnd as EdgeMarker)?.type).toBe(MarkerType.ArrowClosed)
  })

  it('should create edges connecting challenges to models', () => {
    const { result } = renderHook(() => useProjectFlow(testProject))
    const [, edges] = result.current

    const firstChallengeEdges = edges.filter((edge) => edge.source === testProject.technicalChallenges[0].id.toString())

    expect(firstChallengeEdges.length).toBe(2) // First challenge has 2 models

    const secondChallengeEdges = edges.filter(
      (edge) => edge.source === testProject.technicalChallenges[1].id.toString(),
    )

    expect(secondChallengeEdges.length).toBe(1) // Second challenge has 1 model
  })

  it('should position biological models with proper vertical spacing', () => {
    const { result } = renderHook(() => useProjectFlow(testProject))
    const [nodes] = result.current

    const modelNodes = nodes.filter((node) => node.type === 'biologicalModel')

    // Check vertical spacing between models of the first challenge
    const firstChallengeModels = modelNodes.filter(
      (node) =>
        node.id === testProject.technicalChallenges[0].biologicalModels[0].id.toString() ||
        node.id === testProject.technicalChallenges[0].biologicalModels[1].id.toString(),
    )

    expect(firstChallengeModels[1].position.y - firstChallengeModels[0].position.y).toBe(MODEL_SPACING)
  })
})
