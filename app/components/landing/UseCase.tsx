"use client";

import { Database, Cloud, GitBranch, Network } from "lucide-react";

export const UseCases = () => {
  const cases = [
    {
      icon: <Network className="w-8 h-8" />,
      title: "System Architecture",
      examples: ["Microservices", "Event-driven", "Monolithic"]
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Database Design",
      examples: ["ER diagrams", "Schema design", "Relationships"]
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Infrastructure",
      examples: ["AWS", "Azure", "GCP"]
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "API Workflows",
      examples: ["REST APIs", "GraphQL", "Webhooks"]
    }
  ];

  return (
    <section className="relative py-24 px-4 ">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built For Every Use Case
          </h2>
          <p className="text-xl text-gray-400">
            From databases to cloud infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((useCase, index) => (
            <div
              key={index}
              className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl hover:border-blue-500/50 transition-all"
            >
              <div className="text-blue-400 mb-4">
                {useCase.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {useCase.title}
              </h3>
              <ul className="space-y-2">
                {useCase.examples.map((example, i) => (
                  <li key={i} className="text-gray-400 text-sm">
                    • {example}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};