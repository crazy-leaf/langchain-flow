import { useState, useEffect } from 'react';
// import { Node } from '@xyflow/react'; // Remove this line

import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import type { TextNodeData } from '../nodes/TextNode';

// Define a minimal Node type for your usage
type Node = {
  id: string;
  type?: string;
  data?: any;
};

interface SettingsPanelProps {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, data: Partial<TextNodeData>) => void;
  onClose: () => void;
}

/**
 * SettingsPanel Component - Allows editing of selected node properties
 * Features:
 * - Appears when a node is selected
 * - Text editing for message nodes
 * - Extensible for different node types
 * - Auto-saves changes as user types
 */
const SettingsPanel = ({ selectedNode, onNodeUpdate, onClose }: SettingsPanelProps) => {
  const [message, setMessage] = useState('');

  // Initialize message from selected node data
  useEffect(() => {
    if (selectedNode?.type === 'textNode') {
      const nodeData = (selectedNode.data as unknown) as TextNodeData;
      setMessage(nodeData?.label || '');
    }
  }, [selectedNode]);

  // Handle message text changes with debounced updates
  const handleMessageChange = (value: string) => {
    setMessage(value);

    // Update the node immediately for responsive UI
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { label: value });
    }
  };

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="w-64 bg-flow-panel-bg border-r border-flow-panel-border p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-1 h-auto"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold text-foreground">Settings</h3>
      </div>

      {/* Node Type Indicator */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-muted/50 rounded-lg">
        <MessageSquare className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Text Message</span>
      </div>

      {/* Message Editor */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="message-input" className="text-sm font-medium">
            Message Text
          </Label>
          <p className="text-xs text-muted-foreground mb-2">
            Enter the message that will be sent to users
          </p>
          <Textarea
            id="message-input"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            className="min-h-[120px] resize-none"
            autoFocus
          />
        </div>

        {/* Character count */}
        <div className="text-xs text-muted-foreground text-right">
          {message.length} characters
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          💡 Tip: Changes are saved automatically as you type
        </p>
      </div>

      {/* Future: Additional settings for different node types can be added here */}
      {selectedNode.type === 'textNode' && (
        <div className="mt-4 space-y-3">
          {/* Future text node specific settings */}
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;