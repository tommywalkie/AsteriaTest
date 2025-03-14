import { memo } from 'react'
import { Handle, NodeProps, Position } from '@xyflow/react'
import { AsteriaNode } from 'src/models'

const ProjectNode = memo<NodeProps<AsteriaNode<'project'>>>(({ data }) => {
  return (
    <>
      <div className="w-100 max-w-100 max-h-40 line-clamp-3 px-3 py-2 bg-cyan-100 rounded-md border border-cyan-200 text-center relative">
        {data.label}
      </div>
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-sm text-cyan-500 font-mono">Project</div>
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </>
  )
})

export default ProjectNode
