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
export const NodeType = z.enum(['project', 'technicalChallenge', 'biologicalModel'])

export type NodeType = z.infer<typeof NodeType>

/**
 * React Flow node data, this is usually passed to the node component.
 */
export const AsteriaNodeData = z.object({
  id: z.number(),
  label: z.string().default(''),
})

export type AsteriaNodeData = z.infer<typeof AsteriaNodeData>

/**
 * React Flow node metadata, notably contains the node type, position, and data.
 */
export type AsteriaNode = Node<AsteriaNodeData> & { type: NodeType }
