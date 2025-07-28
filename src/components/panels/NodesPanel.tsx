import { MessageSquare } from 'lucide-react';

/**
 * NodesPanel Component - Contains all available node types for the flow builder
 * Features:
 * - Draggable node types that can be added to the flow
 * - Extensible design for adding new node types in the future
 * - Visual feedback during drag operations
 */
const NodesPanel = () => {
  
  /**
   * Handle drag start event for nodes
   * Sets the drag data type and node type for React Flow to handle
   */
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-flow-panel-bg border-r border-flow-panel-border p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Nodes Panel</h3>
        <p className="text-sm text-muted-foreground">Drag nodes to add them to your flow</p>
      </div>
      
      <div className="space-y-3">
        {/* Text Message Node */}
        <div
          className="
            flex items-center gap-3 p-3 
            bg-card border border-border rounded-lg
            cursor-grab active:cursor-grabbing
            hover:bg-accent hover:border-accent-foreground/20
            transition-all duration-200
            shadow-sm hover:shadow-md
          "
          draggable
          onDragStart={(event) => onDragStart(event, 'textNode')}
        >
          <div className="flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">Message</div>
            <div className="text-xs text-muted-foreground">Send a text message</div>
          </div>
        </div>
        
        {/* Future node types can be added here */}
        {/* Example: 
        <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg opacity-50">
          <Bot className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-sm font-medium text-muted-foreground">AI Response</div>
            <div className="text-xs text-muted-foreground">Coming soon...</div>
          </div>
        </div>
        */}
      </div>
      
      <div className="mt-6 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          💡 Tip: Drag a node from here to the canvas to add it to your chatbot flow
        </p>
      </div>
    </div>
  );
};

export default NodesPanel;