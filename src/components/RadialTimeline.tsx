"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCw } from "lucide-react";

export interface MilestoneNode {
  id: string;
  year: string;
  title: string;
  category: string;
  badge: string;
  color: string;
  description: string;
  angle: number;
}

const MILESTONES: MilestoneNode[] = [
  {
    id: "m1",
    year: "2023",
    title: "CS Fundamentals & Java",
    category: "Foundation",
    badge: "Computer Science",
    color: "#3b82f6",
    description: "Built strong grounding in object-oriented programming, data structures, and algorithms at MDS University.",
    angle: 0,
  },
  {
    id: "m2",
    year: "2024",
    title: "Full Stack & REST APIs",
    category: "Web Development",
    badge: "React & Node.js",
    color: "#6366f1",
    description: "Built end-to-end applications with React, Express, MongoDB, and Tailwind CSS. Shipped dynamic platforms and hackathon submissions.",
    angle: 72,
  },
  {
    id: "m3",
    year: "2024",
    title: "Hackathon Solutions",
    category: "Leadership & Build",
    badge: "Decole & GDG",
    color: "#10b981",
    description: "Led developer teams in collegiate hackathons, designing multilingual web platforms and earning GDG On Campus credentials.",
    angle: 144,
  },
  {
    id: "m4",
    year: "2025",
    title: "Applied AI & RAG Tooling",
    category: "Intelligent Systems",
    badge: "Python & LLMs",
    color: "#8b5cf6",
    description: "Engineered retrieval-augmented generation systems in Python, vector search embeddings, and local Ollama desktop integrations.",
    angle: 216,
  },
  {
    id: "m5",
    year: "2026",
    title: "Algorithmic Consistency",
    category: "Problem Solving",
    badge: "LeetCode 120+",
    color: "#f59e0b",
    description: "Maintaining a daily problem-solving streak in Java on LeetCode covering arrays, two-pointers, hash tables, and dynamic programming.",
    angle: 288,
  },
];

export default function RadialTimeline() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedNode, setSelectedNode] = useState<MilestoneNode | null>(null);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const animate = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isPlaying && !selectedNode) {
        setRotationAngle((prev) => (prev + delta * 12) % 360);
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, selectedNode]);

  const radius = 180;

  return (
    <div className="apple-card p-6 sm:p-10 mb-12 overflow-hidden relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-4 border-b border-neutral-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
            <h3 className="text-base font-bold text-neutral-900">Orbital Milestone Radar</h3>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">Click any orbiting milestone to inspect growth trajectory</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? "Pause Orbit" : "Resume Orbit"}</span>
          </button>
          <button
            onClick={() => {
              setRotationAngle(0);
              setSelectedNode(null);
            }}
            className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all cursor-pointer"
            title="Reset Orbit"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Radial Orbit Area */}
      <div className="radial-timeline-wrapper">
        <div className="radial-orbit-container">
          <div className="radial-orbit-ring" />

          {/* Pulsing Core */}
          <div className="radial-center-core">
            <div className="radial-center-ping-1" />
            <div className="radial-center-ping-2" />
            <div className="radial-center-dot" />
          </div>

          {/* Nodes */}
          {MILESTONES.map((node) => {
            const currentAngle = (node.angle + rotationAngle) % 360;
            const radians = (currentAngle * Math.PI) / 180;
            const x = Math.round(radius * Math.cos(radians) * 100) / 100;
            const y = Math.round(radius * Math.sin(radians) * 100) / 100;
            const isSelected = selectedNode?.id === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(isSelected ? null : node)}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  zIndex: isSelected ? 200 : 20,
                }}
                className={`radial-node ${isSelected ? "expanded" : ""}`}
              >
                <div
                  className="radial-node-btn"
                  style={{
                    backgroundColor: isSelected ? node.color : "#ffffff",
                    color: isSelected ? "#ffffff" : node.color,
                    border: `2px solid ${node.color}`,
                  }}
                >
                  <span className="font-bold text-xs">{node.year.slice(2)}</span>
                </div>

                <span className="radial-node-title text-neutral-800">
                  {node.title.split(" ")[0]}
                </span>

                {/* Popup Card */}
                {isSelected && (
                  <div
                    className="radial-card-popup"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="radial-card-pointer" />
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: node.color }}
                      >
                        {node.year} • {node.badge}
                      </span>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="text-xs text-neutral-400 hover:text-neutral-700"
                      >
                        ✕
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 mb-1">{node.title}</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">{node.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
