import { z } from 'zod'
import { Node } from '@xyflow/react'

/**
 * Biological model.
 */
export const BiologicalModel = z.object({
  id: z.number(),
  name: z.string().default(''),
})

export type BiologicalModel = z.infer<typeof BiologicalModel>

/**
 * Technical challenge.
 */
export const TechnicalChallenge = z.object({
  id: z.number(),
  name: z.string().default(''),
  biologicalModels: z.array(BiologicalModel),
})

export type TechnicalChallenge = z.infer<typeof TechnicalChallenge>

/**
 * Project.
 */
export const Project = z.object({
  id: z.number(),
  name: z.string().default(''),
  technicalChallenges: z.array(TechnicalChallenge),
})

export type Project = z.infer<typeof Project>

/**
 * Node type, intended for custom React Flow nodes.
 */
export const NodeType = z.enum(['project', 'technicalChallenge', 'biologicalModel', 'addBiologicalModel'])

export type NodeType = z.infer<typeof NodeType>

/**
 * React Flow node data, this is usually passed to the node component.
 */
export const AsteriaNodeData = z.union([
  z.object({
    id: z.number(),
    label: z.string().default(''),
    nodeType: z.literal('project').optional(),
  }),
  z.object({
    id: z.number(),
    label: z.string().default(''),
    nodeType: z.literal('technicalChallenge').optional(),
  }),
  z.object({
    id: z.number(),
    label: z.string().default(''),
    nodeType: z.literal('biologicalModel').optional(),
  }),
  z.object({
    id: z.number(),
    label: z.string().default(''),
    challengeId: z.number(),
    nodeType: z.literal('addBiologicalModel').optional(),
  }),
])

export type AsteriaNodeData = z.infer<typeof AsteriaNodeData>

/**
 * React Flow node metadata, notably contains the node type, position, and data.
 */
export type AsteriaNode<T extends NodeType = NodeType> = Node<AsteriaNodeData> & { type: T }

export type ProjectNode = AsteriaNode<'project'>
export type TechnicalChallengeNode = AsteriaNode<'technicalChallenge'>
export type BiologicalModelNode = AsteriaNode<'biologicalModel'>
export type AddBiologicalModelNode = AsteriaNode<'addBiologicalModel'> & {
  data: AsteriaNode<'addBiologicalModel'>['data'] & {
    challengeId: number
  }
}

// Add this type to define the data structure for addBiologicalModel nodes
export interface AddBiologicalModelData {
  id: number
  label: string
  challengeId: number
}

// Update the NodeData type to include the new data type
export type NodeData<T extends string> = T extends 'addBiologicalModel'
  ? AddBiologicalModelData
  : { id: number; label: string }
