import { ReactFlow, Background, Controls, useNodesState, useEdgesState, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useProjectFlow } from './hooks/useProjectFlow'
import { useEffect } from 'react'
import { AsteriaNode } from './models'
import { useProject } from './hooks/useProject'

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<AsteriaNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const { data: project, isFetching, error } = useProject(1)
  const [initialNodes, initialEdges] = useProjectFlow(project)

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges])

  if (isFetching) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
