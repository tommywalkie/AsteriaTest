import { renderHook } from '@testing-library/react'
import {
  useProjectFlow,
  PROJECT_COLUMN,
  TECHNICAL_CHALLENGE_COLUMN,
  BIOLOGICAL_MODEL_COLUMN,
  MODEL_SPACING,
} from './useProjectFlow'
import { AddBiologicalModelData, Project } from '../models'
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

    expect(nodes.length).toBe(8) // 1 project + 2 challenges + 3 models + 2 add nodes
    expect(edges.length).toBe(7) // 2 project->challenge + 3 challenge->model + 2 challenge->add
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

    // Filter out edges that connect to add model nodes
    const firstChallengeModelEdges = edges.filter(
      (edge) =>
        edge.source === testProject.technicalChallenges[0].id.toString() && !edge.target.startsWith('add-model-to-'),
    )

    expect(firstChallengeModelEdges.length).toBe(2) // First challenge has 2 models

    // Same for second challenge
    const secondChallengeModelEdges = edges.filter(
      (edge) =>
        edge.source === testProject.technicalChallenges[1].id.toString() && !edge.target.startsWith('add-model-to-'),
    )

    expect(secondChallengeModelEdges.length).toBe(1) // Second challenge has 1 model
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

  it('should create "add biological model" nodes for each technical challenge', () => {
    const { result } = renderHook(() => useProjectFlow(testProject))
    const [nodes, edges] = result.current

    const addModelNodes = nodes.filter((node) => node.type === 'addBiologicalModel')

    // Should have one add node per technical challenge
    expect(addModelNodes.length).toBe(testProject.technicalChallenges.length)

    // Check properties of add nodes
    addModelNodes.forEach((node, index) => {
      const challengeId = testProject.technicalChallenges[index].id

      // Check node properties
      expect(node.id).toBe(`add-model-to-${challengeId}`)
      expect(node.data.id).toBe(challengeId)
      expect((node.data as AddBiologicalModelData).challengeId).toBe(challengeId)
      expect(node.position.x).toBe(BIOLOGICAL_MODEL_COLUMN)
      expect(node.targetPosition).toBe(Position.Left)

      // Check that there's an edge from the challenge to the add node
      const edgeToAddNode = edges.find((edge) => edge.source === challengeId.toString() && edge.target === node.id)
      expect(edgeToAddNode).toBeDefined()
    })
  })

  it('should position add model nodes after the last biological model of each challenge', () => {
    const { result } = renderHook(() => useProjectFlow(testProject))
    const [nodes] = result.current

    // For the first challenge with 2 models
    const firstChallengeModels = nodes.filter(
      (node) =>
        node.type === 'biologicalModel' &&
        testProject.technicalChallenges[0].biologicalModels.some((model) => model.id.toString() === node.id),
    )

    const firstChallengeAddNode = nodes.find(
      (node) =>
        node.type === 'addBiologicalModel' &&
        (node.data as AddBiologicalModelData).challengeId === testProject.technicalChallenges[0].id,
    )

    // The add node should be positioned after the last model
    const lastModelY = Math.max(...firstChallengeModels.map((node) => node.position.y))
    expect(firstChallengeAddNode?.position.y).toBe(lastModelY + MODEL_SPACING)
  })
})
