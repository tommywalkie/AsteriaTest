import { memo, useState } from 'react'
import { Handle, NodeProps, Position } from '@xyflow/react'
import { AsteriaNode, AddBiologicalModelData } from 'src/models'
import { useProjectContext } from '../contexts/ProjectContext'

// Define a type for the node data without making AsteriaNode generic
const AddBiologicalModelNode = memo<NodeProps<AsteriaNode<'addBiologicalModel'>>>(({ data }) => {
  const [modelName, setModelName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const { addModel } = useProjectContext()

  const handleAddClick = () => {
    setIsAdding(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (modelName.trim()) {
      // Type assertion to access challengeId
      const nodeData = data as AddBiologicalModelData

      // Add the model through the context function
      addModel(nodeData.challengeId, modelName)

      // Reset form
      setModelName('')
      setIsAdding(false)
    }
  }

  const handleCancel = () => {
    setModelName('')
    setIsAdding(false)
  }

  const className = [
    'max-w-100 bg-slate-100 rounded-md border border-slate-300 text-center relative',
    isAdding ? 'w-100' : 'w-max',
  ].join(' ')

  return (
    <>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <div className={className}>
        {!isAdding ? (
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center w-full py-2 px-3 text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Biological Model
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-2">
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Model name"
              className="px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none bg-slate-200"
              autoFocus
            />
            <div className="flex justify-between gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-2 py-1 text-xs bg-slate-300 hover:bg-slate-400 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2 py-1 text-xs bg-slate-300 hover:bg-slate-400 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-300"
                disabled={!modelName.trim()}
              >
                Add
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
})

export default AddBiologicalModelNode
