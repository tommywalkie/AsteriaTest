import { ReactFlow, Background, Controls, useNodesState, useEdgesState, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useProjectFlow } from './hooks/useProjectFlow'
import { useEffect } from 'react'
import { AsteriaNode } from './models'
import ProjectNode from './components/ProjectNode'
import BiologicalModelNode from './components/BiologicalModelNode'
import TechnicalChallengeNode from './components/TechnicalChallengeNode'
import AddBiologicalModelNode from './components/AddBiologicalModelNode'
import { ProjectProvider, useProjectContext } from './contexts/ProjectContext'

const nodeTypes = {
  project: ProjectNode,
  biologicalModel: BiologicalModelNode,
  technicalChallenge: TechnicalChallengeNode,
  addBiologicalModel: AddBiologicalModelNode,
}

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<AsteriaNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const { project, loading, error } = useProjectContext()
  const [initialNodes, initialEdges] = useProjectFlow(project)

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="h-screen w-screen relative">
      <div className="absolute top-0 left-0 w-full h-10 bg-slate-100 z-10 border-b border-slate-200">
        <div className="flex gap-2 h-full px-3">
          <div className="text-xl font-bold my-auto">Asteria Test</div>
          <div className="my-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <div className="my-auto">{project?.name}</div>
        </div>
      </div>
      <div className="absolute top-10 left-0 w-full h-[calc(100%-2.5rem)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.2,
          }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ProjectProvider projectId={1}>
      <Flow />
    </ProjectProvider>
  )
}
