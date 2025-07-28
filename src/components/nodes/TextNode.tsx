import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';

// Define the data structure for Text Node
export interface TextNodeData {
  label: string;
}

// Define a minimal NodeProps type for your usage
interface NodeProps {
  data: TextNodeData;
  selected?: boolean;
}

/**
 * TextNode Component - Represents a text message in the chatbot flow
 * Features:
 * - One source handle (only one outgoing connection allowed)
 * - One target handle (multiple incoming connections allowed)
 * - Displays message content and icon
 * - Visual feedback for selection state
 */
const TextNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = (data as unknown) as TextNodeData;
  
  return (
    <div 
      className={`
        relative min-w-[200px] max-w-[300px] px-4 py-3 
        bg-flow-node-bg border-2 rounded-lg shadow-sm
        transition-all duration-200
        ${selected 
          ? 'border-flow-node-selected shadow-md' 
          : 'border-flow-node-border hover:border-flow-handle'
        }
      `}
    >
      {/* Target Handle - Allows multiple incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-flow-handle border-2 border-flow-panel-bg !rounded-full"
      />
      
      <div className="flex items-start gap-3">
        {/* Message Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <MessageSquare className="w-5 h-5 text-flow-handle" />
        </div>
        
        {/* Message Content */}
        <div className="flex-1 min-h-[40px]">
          <div className="text-sm font-medium text-flow-node-text mb-1">
            Text Message
          </div>
          <div className="text-sm text-muted-foreground break-words">
            {nodeData?.label || 'Click to edit message...'}
          </div>
        </div>
      </div>
      
      {/* Source Handle - Only one outgoing connection allowed */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-flow-handle border-2 border-flow-panel-bg !rounded-full"
      />
    </div>
  );
});

TextNode.displayName = 'TextNode';

export default TextNode;