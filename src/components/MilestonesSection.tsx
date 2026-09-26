"use client";

import React from "react";
import { useAdmin } from "@/context/AdminContext";
import { Code, ExternalLink, Edit3, Award } from "lucide-react";
import { GitHubIcon } from "@/components/Icons";

export default function MilestonesSection() {
  const { portfolio, isAdmin, openEditModal } = useAdmin();
  const journey = portfolio?.siteConfig?.journey || {
    eyebrow: "Milestones & Path",
    title: "Interactive Journey & Activity.",
    subtitle:
      "Tracing my transition from computer science fundamentals to full-stack projects, AI experiments, and daily problem solving.",
  };

  const githubData = portfolio?.github || {
    name: "Mehul Pathak",
    username: "Mehulpathak12",
    avatar: "https://avatars.githubusercontent.com/u/148731110?v=4",
    bio: "Full Stack Developer & Applied AI Explorer",
    repos: 18,
    followers: 6,
    following: 4,
    joined: "October 2019",
    profile: "https://github.com/Mehulpathak12",
    recentRepos: [
      { name: "decole-hackathon", lang: "EJS / Node.js", url: "https://github.com/Mehulpathak12/decole-hackathon" },
      { name: "RAG-Application", lang: "Python / AI", url: "https://github.com/Mehulpathak12/RAG-Application" },
      { name: "ComputerGraphy", lang: "C++", url: "https://github.com/Mehulpathak12/ComputerGraphy" },
    ],
  };

  const leetcodeData = portfolio?.leetcode || {
    username: "MehulPathak",
    ranking: 1398151,
    totalSolved: 123,
    totalQuestions: 4059,
    easySolved: 76,
    totalEasy: 966,
    mediumSolved: 43,
    totalMedium: 2117,
    hardSolved: 4,
    totalHard: 976,
    profileUrl: "https://leetcode.com/u/MehulPathak",
    recentSubmissions: [
      { title: "Two Sum", lang: "JAVA", tag: "Algorithm" },
      { title: "Longest Substring", lang: "JAVA", tag: "Sliding Window" },
      { title: "Jump Game II", lang: "JAVA", tag: "Greedy • DP" },
      { title: "Delete Duplicate Emails", lang: "MYSQL", tag: "SQL Query" },
    ],
  };

  return (
    <section id="journey" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 relative">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
              {journey.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
              {journey.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-2xl">
              {journey.subtitle}
            </p>
          </div>

          {isAdmin && (
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => openEditModal("journey", journey)}
                className="apple-edit-btn"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Journey</span>
              </button>
            </div>
          )}
        </div>

        {/* 2 Live Activity Cards (GitHub & LeetCode) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* GitHub Live Card */}
          <div className="apple-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <img
                    src={githubData.avatar}
                    alt={githubData.name}
                    className="w-12 h-12 rounded-full border border-neutral-200 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-neutral-900">{githubData.name}</h4>
                      <GitHubIcon className="w-4 h-4 text-neutral-700" />
                    </div>
                    <a
                      href={githubData.profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      @{githubData.username}
                    </a>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live GitHub Feed
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 mb-6">
                {githubData.bio}
              </p>

              {/* GitHub Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-neutral-50 text-center border border-neutral-100">
                  <span className="text-lg font-bold text-neutral-900 block">{githubData.repos}</span>
                  <span className="text-[11px] text-neutral-500 font-medium">Public Repos</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 text-center border border-neutral-100">
                  <span className="text-lg font-bold text-neutral-900 block">{githubData.followers}</span>
                  <span className="text-[11px] text-neutral-500 font-medium">Followers</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 text-center border border-neutral-100">
                  <span className="text-lg font-bold text-neutral-900 block">{githubData.following}</span>
                  <span className="text-[11px] text-neutral-500 font-medium">Following</span>
                </div>
              </div>

              {/* Recent Repos */}
              <div>
                <h5 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
                  Recent Active Repositories
                </h5>
                <div className="space-y-2">
                  {githubData.recentRepos?.map((repo: any, i: number) => (
                    <a
                      key={i}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-100 flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                        <span className="text-xs font-bold text-neutral-800">{repo.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-600">
                        {repo.lang}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-400">Joined {githubData.joined}</span>
              <a
                href={githubData.profile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-neutral-900 hover:text-blue-600 inline-flex items-center gap-1 transition-colors"
              >
                <span>View Full GitHub Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* LeetCode Live Card */}
          <div className="apple-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg">
                    LC
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-neutral-900">LeetCode Progress</h4>
                    <span className="text-xs text-neutral-500">Global Rank: #{leetcodeData.ranking?.toLocaleString() || "1.3M+"}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Live LeetCode Feed
                </span>
              </div>

              {/* Total Solved Summary */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-500 font-medium">Total Problems Solved</span>
                  <div className="text-3xl font-extrabold text-neutral-900 mt-0.5">
                    {leetcodeData.totalSolved} <span className="text-xs font-semibold text-neutral-400">/ 4,000+</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Active Solver
                  </span>
                </div>
              </div>

              {/* Difficulty Breakdown Bars */}
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-600">Easy ({leetcodeData.easySolved})</span>
                    <span className="text-neutral-400">{Math.round((leetcodeData.easySolved / 966) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, (leetcodeData.easySolved / 966) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-600">Medium ({leetcodeData.mediumSolved})</span>
                    <span className="text-neutral-400">{Math.round((leetcodeData.mediumSolved / 2117) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${Math.min(100, (leetcodeData.mediumSolved / 2117) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-red-600">Hard ({leetcodeData.hardSolved})</span>
                    <span className="text-neutral-400">{Math.round((leetcodeData.hardSolved / 976) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${Math.min(100, (leetcodeData.hardSolved / 976) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Recent Accepted Submissions */}
              <div>
                <h5 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
                  Recent Accepted Solutions
                </h5>
                <div className="space-y-2">
                  {leetcodeData.recentSubmissions?.map((sub: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-neutral-800">{sub.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-600">
                          {sub.lang}
                        </span>
                        <span className="text-[10px] font-semibold text-neutral-400 hidden sm:inline">
                          {sub.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-400">@{leetcodeData.username}</span>
              <a
                href={leetcodeData.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-neutral-900 hover:text-amber-600 inline-flex items-center gap-1 transition-colors"
              >
                <span>View LeetCode Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
