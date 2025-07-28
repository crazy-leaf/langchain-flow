import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Button } from "../components/ui/button";
import { Save, AlertCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";

import NodesPanel from "./panels/NodesPanel";
import SettingsPanel from "./panels/SettingsPanel";
import type { TextNodeData } from "./nodes/TextNode";
import TextNode from "./nodes/TextNode";

type Node = {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: any;
  selected?: boolean;
};

type Edge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;
  animated?: boolean;
  label?: string;
};

type Connection = {
  source: string | null;
  target: string | null;
  sourceHandle?: string | null;
  targetHandle?: string | null;
};

type OnNodesChange = (changes: any[]) => void;
type OnEdgesChange = (changes: any[]) => void;
type OnConnect = (connection: Connection) => void;
type NodeTypes = Record<string, any>;

// Define node types for React Flow
const nodeTypes: NodeTypes = {
  textNode: TextNode,
};

// Initial empty state
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

/**
 * FlowBuilder Component - Main component for the chatbot flow builder
 * Features:
 * - Drag and drop nodes from panel
 * - Visual flow editing with React Flow
 * - Node selection and settings editing
 * - Save validation with error checking
 * - Extensible architecture for new node types
 */
const FlowBuilder = () => {
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // React Flow state management
  const [nodes, setNodes, onNodesChange]: [Node[], any, OnNodesChange] =
    useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange]: [Edge[], any, OnEdgesChange] =
    useEdgesState(initialEdges);

  // UI state
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  /**
   * Handle new connections between nodes
   * Validates that source handles can only have one outgoing edge
   */
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      // Check if source handle already has an outgoing edge
      const sourceHasEdge = edges.some(
        (edge) =>
          edge.source === params.source &&
          edge.sourceHandle === params.sourceHandle
      );

      if (sourceHasEdge) {
        toast({
          title: "Connection Limit",
          description:
            "Each source handle can only have one outgoing connection",
          variant: "destructive",
        });
        return;
      }

      setEdges((eds: Edge[]) => addEdge(params as any, eds));
    },
    [edges, setEdges, toast]
  );

  /**
   * Handle drag over events for drop zone
   */
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /**
   * Handle drop events to add new nodes
   */
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      if (!reactFlowInstance || !reactFlowWrapper.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Generate unique ID for new node
      const id = `${type}_${Date.now()}`;

      // Create new node based on type
      const newNode: Node = {
        id,
        type,
        position,
        data: { label: "New message" },
      };

      setNodes((nds: Node[]) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  /**
   * Handle node selection
   */
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  /**
   * Handle clicking on empty canvas to deselect nodes
   */
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  /**
   * Update node data
   */
  const onNodeUpdate = useCallback(
    (nodeId: string, data: Partial<TextNodeData>) => {
      setNodes((nds: Node[]) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
    },
    [setNodes]
  );

  /**
   * Validate and save the flow
   * Shows error if more than one node exists and more than one node has empty target handles
   */
  const handleSave = useCallback(() => {
    // Check if there are multiple nodes
    if (nodes.length <= 1) {
      toast({
        title: "Flow Saved",
        description: "Your chatbot flow has been saved successfully",
      });
      return;
    }

    // Find nodes without incoming edges (empty target handles)
    const nodesWithoutTargets = nodes.filter(
      (node) => !edges.some((edge) => edge.target === node.id)
    );

    // Show error if more than one node has empty target handles
    if (nodesWithoutTargets.length > 1) {
      toast({
        title: "Flow Validation Error",
        description:
          "Cannot save flow: More than one node has empty target handles. Each node should be connected except for the starting node.",
        variant: "destructive",
      });
      return;
    }

    // Save successful
    toast({
      title: "Flow Saved",
      description: "Your chatbot flow has been saved successfully",
    });
  }, [nodes, edges, toast]);

  return (
    <div className="h-screen flex bg-flow-bg">
      {/* Left Panel - Nodes or Settings */}
      {selectedNode ? (
        <SettingsPanel
          selectedNode={selectedNode}
          onNodeUpdate={onNodeUpdate}
          onClose={() => setSelectedNode(null)}
        />
      ) : (
        <NodesPanel />
      )}

      {/* Main Flow Canvas */}
      <div className="flex-1 relative" style={{ minHeight: "100vh" }}>
        <div
          ref={reactFlowWrapper}
          className="w-full h-full"
          style={{ width: "100%", height: "100vh" }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            className="bg-flow-bg"
            defaultViewport={{ x: 0, y: 0, zoom: 1.25 }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="hsl(var(--flow-grid))"
            />
            <Controls className="bg-flow-panel-bg border border-flow-panel-border" />
            <MiniMap
              className="bg-flow-panel-bg border border-flow-panel-border"
              nodeColor="hsl(var(--primary))"
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </div>

        {/* Save Button */}
        <div className="absolute top-4 right-4">
          <Button onClick={handleSave} className="shadow-lg">
            <Save className="w-4 h-4 mr-2" />
            Save Flow
          </Button>
        </div>

        {/* Flow Status Indicator */}
        {nodes.length > 1 && (
          <div className="absolute bottom-4 right-4">
            {nodes.filter(
              (node) => !edges.some((edge) => edge.target === node.id)
            ).length > 1 ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Flow has validation errors</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary">
                <span className="text-sm">✓ Flow is valid</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowBuilder;
