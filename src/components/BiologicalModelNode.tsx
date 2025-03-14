import { memo } from 'react'
import { Handle, NodeProps, Position } from '@xyflow/react'
import { AsteriaNode } from 'src/models'

const BiologicalModelNode = memo<NodeProps<AsteriaNode>>(({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <div className="w-100 max-w-100 max-h-100 line-clamp-6 px-3 py-2 bg-green-100 rounded-md border border-green-200 text-center relative">
        {data.label}
      </div>
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-sm text-green-500 font-mono">
        Biological Model
      </div>
    </>
  )
})

export default BiologicalModelNode
