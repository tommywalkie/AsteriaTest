import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { AsteriaNode } from 'src/models'

const TechnicalChallengeNode = memo<NodeProps<AsteriaNode<'technicalChallenge'>>>(({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <div className="w-100 max-w-100 max-h-100 line-clamp-6 px-3 py-2 bg-yellow-100 rounded-md border border-yellow-200 text-center relative">
        {data.label}
      </div>
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-sm text-yellow-500 font-mono">
        Technical Challenge
      </div>
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </>
  )
})

export default TechnicalChallengeNode
