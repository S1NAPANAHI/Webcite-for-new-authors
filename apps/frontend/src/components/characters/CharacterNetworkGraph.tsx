import React, { useEffect, useRef, useState } from 'react';
import { Character, CharacterRelationship, CharacterNetwork } from '../../types/character';
import {
  getCharacterTypeConfig,
  getRelationshipTypeConfig,
  getRelationshipStrengthColor,
  generateCharacterColorTheme
} from '../../utils/characterUtils';
import { useFileUrl } from '../../utils/fileUrls';

interface CharacterNetworkGraphProps {
  characters: Character[];
  centerCharacterId?: string;
  maxConnections?: number;
  onCharacterClick?: (character: Character) => void;
  width?: number;
  height?: number;
  className?: string;
}

interface GraphNode {
  id: string;
  character: Character;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  fixed?: boolean;
}

interface GraphEdge {
  source: GraphNode;
  target: GraphNode;
  relationship: CharacterRelationship;
  strength: number;
}

const CharacterNetworkGraph: React.FC<CharacterNetworkGraphProps> = ({
  characters,
  centerCharacterId,
  maxConnections = 20,
  onCharacterClick,
  width = 800,
  height = 600,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragNode, setDragNode] = useState<GraphNode | null>(null);

  // Build network graph from characters
  useEffect(() => {
    buildNetworkGraph();
  }, [characters, centerCharacterId, maxConnections]);

  // Start animation loop
  useEffect(() => {
    startAnimation();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, edges]);

  const buildNetworkGraph = () => {
    if (characters.length === 0) return;

    // Find center character or use first major character
    const centerCharacter = centerCharacterId 
      ? characters.find(c => c.id === centerCharacterId)
      : characters.find(c => c.is_major_character) || characters[0];

    if (!centerCharacter) return;

    // Create nodes
    const nodeMap = new Map<string, GraphNode>();
    const newNodes: GraphNode[] = [];
    const newEdges: GraphEdge[] = [];

    // Add center character
    const centerNode: GraphNode = {
      id: centerCharacter.id,
      character: centerCharacter,
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      radius: Math.max(30, centerCharacter.importance_score * 0.4),
      fixed: true
    };
    nodeMap.set(centerCharacter.id, centerNode);
    newNodes.push(centerNode);

    // Get relationships for center character
    const relationships = centerCharacter.relationships || [];
    const limitedRelationships = relationships.slice(0, maxConnections);

    // Add related characters as nodes
    limitedRelationships.forEach((relationship, index) => {
      const relatedCharacter = characters.find(c => c.id === relationship.related_character_id);
      if (!relatedCharacter) return;

      // Calculate position in circle around center
      const angle = (2 * Math.PI * index) / limitedRelationships.length;
      const distance = 150 + (Math.random() * 100); // Add some randomness
      
      const relatedNode: GraphNode = {
        id: relatedCharacter.id,
        character: relatedCharacter,
        x: centerNode.x + Math.cos(angle) * distance,
        y: centerNode.y + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius: Math.max(20, relatedCharacter.importance_score * 0.3)
      };
      
      nodeMap.set(relatedCharacter.id, relatedNode);
      newNodes.push(relatedNode);

      // Add edge
      newEdges.push({
        source: centerNode,
        target: relatedNode,
        relationship,
        strength: Math.abs(relationship.strength) / 10
      });
    });

    // Add inter-relationships between related characters
    limitedRelationships.forEach((relationship) => {
      const sourceNode = nodeMap.get(relationship.related_character_id);
      if (!sourceNode) return;

      const sourceCharacter = sourceNode.character;
      const sourceRelationships = sourceCharacter.relationships || [];
      
      sourceRelationships.forEach((innerRelationship) => {
        const targetNode = nodeMap.get(innerRelationship.related_character_id);
        if (targetNode && targetNode.id !== centerNode.id) {
          // Avoid duplicate edges
          const existingEdge = newEdges.find(e => 
            (e.source.id === sourceNode.id && e.target.id === targetNode.id) ||
            (e.source.id === targetNode.id && e.target.id === sourceNode.id)
          );
          
          if (!existingEdge) {
            newEdges.push({
              source: sourceNode,
              target: targetNode,
              relationship: innerRelationship,
              strength: Math.abs(innerRelationship.strength) / 20 // Weaker secondary connections
            });
          }
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const startAnimation = () => {
    const animate = () => {
      updatePhysics();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const updatePhysics = () => {
    if (nodes.length === 0) return;

    const damping = 0.9;
    const repulsion = 1000;
    const attraction = 0.1;

    // Apply forces
    nodes.forEach((node, i) => {
      if (node.fixed) return;

      let fx = 0, fy = 0;

      // Repulsion from other nodes
      nodes.forEach((other, j) => {
        if (i === j) return;
        
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = repulsion / (distance * distance);
        
        fx += (dx / distance) * force;
        fy += (dy / distance) * force;
      });

      // Spring forces from connected edges
      edges.forEach((edge) => {
        if (edge.source.id === node.id) {
          const dx = edge.target.x - node.x;
          const dy = edge.target.y - node.y;
          fx += dx * attraction * edge.strength;
          fy += dy * attraction * edge.strength;
        } else if (edge.target.id === node.id) {
          const dx = edge.source.x - node.x;
          const dy = edge.source.y - node.y;
          fx += dx * attraction * edge.strength;
          fy += dy * attraction * edge.strength;
        }
      });

      // Update velocity and position
      node.vx = (node.vx + fx) * damping;
      node.vy = (node.vy + fy) * damping;
      node.x += node.vx;
      node.y += node.vy;

      // Keep nodes within bounds
      node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
      node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
    });
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw edges
    edges.forEach((edge) => {
      const relationshipConfig = getRelationshipTypeConfig(edge.relationship.relationship_type);
      
      ctx.beginPath();
      ctx.moveTo(edge.source.x, edge.source.y);
      ctx.lineTo(edge.target.x, edge.target.y);
      ctx.strokeStyle = getRelationshipStrengthColor(edge.relationship.strength);
      ctx.lineWidth = Math.max(1, edge.strength * 4);
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Draw nodes
    nodes.forEach((node) => {
      const character = node.character;
      const typeConfig = getCharacterTypeConfig(character.character_type);
      const colorTheme = generateCharacterColorTheme(character);
      const isHovered = hoveredNode?.id === node.id;
      const isSelected = selectedNode?.id === node.id;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
      
      if (isSelected) {
        ctx.fillStyle = colorTheme;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
      } else if (isHovered) {
        ctx.fillStyle = colorTheme + 'dd';
        ctx.strokeStyle = colorTheme;
        ctx.lineWidth = 2;
      } else {
        ctx.fillStyle = colorTheme + 'aa';
        ctx.strokeStyle = colorTheme;
        ctx.lineWidth = 1;
      }
      
      ctx.fill();
      ctx.stroke();

      // Character name
      ctx.fillStyle = '#000000';
      ctx.font = `${Math.max(10, node.radius / 3)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(character.name, node.x, node.y + node.radius + 15);
      
      // Importance indicator for major characters
      if (character.is_major_character) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(node.x + node.radius - 5, node.y - node.radius + 5, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw tooltip for hovered node
    if (hoveredNode) {
      drawTooltip(ctx, hoveredNode);
    }
  };

  const drawTooltip = (ctx: CanvasRenderingContext2D, node: GraphNode) => {
    const character = node.character;
    const tooltipX = node.x + node.radius + 10;
    const tooltipY = node.y - 20;
    const tooltipWidth = 200;
    const tooltipHeight = 80;
    
    // Tooltip background
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
    ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
    
    // Tooltip content
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    ctx.fillText(character.name, tooltipX + 10, tooltipY + 10);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText(getCharacterTypeConfig(character.character_type).label, tooltipX + 10, tooltipY + 30);
    ctx.fillText(`Importance: ${character.importance_score}`, tooltipX + 10, tooltipY + 45);
    ctx.fillText(`Relationships: ${character.relationship_count || 0}`, tooltipX + 10, tooltipY + 60);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    if (isDragging && dragNode) {
      dragNode.x = mouseX;
      dragNode.y = mouseY;
      return;
    }
    
    // Check for hovered node
    const hoveredNode = nodes.find(node => {
      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius;
    });
    
    setHoveredNode(hoveredNode || null);
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const clickedNode = nodes.find(node => {
      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius;
    });
    
    if (clickedNode) {
      setSelectedNode(clickedNode);
      setIsDragging(true);
      setDragNode(clickedNode);
      
      if (onCharacterClick) {
        onCharacterClick(clickedNode.character);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragNode(null);
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded-lg bg-background cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setHoveredNode(null);
          setIsDragging(false);
          setDragNode(null);
        }}
      />
      
      {/* Selected Character Info */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-4 min-w-[250px]">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {selectedNode.character.name}
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Type: {getCharacterTypeConfig(selectedNode.character.character_type).label}</div>
            <div>Status: {selectedNode.character.status}</div>
            <div>Importance: {selectedNode.character.importance_score}/100</div>
            <div>Relationships: {selectedNode.character.relationship_count || 0}</div>
            {selectedNode.character.description && (
              <div className="mt-2">
                <p className="line-clamp-3">{selectedNode.character.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterNetworkGraph;