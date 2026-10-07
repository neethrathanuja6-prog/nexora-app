import React from 'react';
import { BarChart2, CheckCircle, XCircle } from 'lucide-react';

export default function Analysis({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const incompleteTasks = totalTasks - completedTasks;
  
  // Dynamic Study Health % calculated strictly from completed tasks vs total tasks
  const healthScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const paperPracticeTasks = tasks.filter(t => t.category === 'Paper Practice');
  const paperCompleted = paperPracticeTasks.filter(t => t.completed).length;
  const paperAccuracy = paperPracticeTasks.length > 0 ? Math.round((paperCompleted / paperPracticeTasks.length) * 100) : 0;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-[#0F382C]">Study Analysis & Visual Charts</h1>
        <p className="text-xs text-slate-500 font-medium">Dynamic health calculated from completed vs total tasks</p>
      </div>

      {/* Main Health Card */}
      <div className="p-8 rounded-3xl bg-[#0F382C] text-[#FAF7F0] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">DYNAMIC STUDY HEALTH</span>
          <h2 className="text-5xl font-extrabold mt-2">{healthScore}%</h2>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-md">
            Calculated strictly based on {completedTasks} completed out of {totalTasks} total tasks.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center w-full md:w-auto">
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20">
            <p className="text-[10px] text-emerald-200 uppercase font-semibold">Total Completed</p>
            <p className="text-lg font-bold">{completedTasks} / {totalTasks}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20">
            <p className="text-[10px] text-emerald-200 uppercase font-semibold">Paper Accuracy</p>
            <p className="text-lg font-bold">{paperAccuracy}%</p>
          </div>
        </div>
      </div>

      {/* Daily Progress Chart */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F382C] flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#1B5E4B]" />
            <span>Task Completion Overview</span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold">{completedTasks} of {totalTasks} Completed</span>
        </div>

        {totalTasks === 0 ? (
          <p className="text-xs text-slate-400 p-6 text-center">Add and complete tasks to build your analysis chart.</p>
        ) : (
          <div className="space-y-4">
            <div className="w-full bg-slate-100 h-6 rounded-2xl overflow-hidden flex">
              <div 
                className="bg-[#0F382C] h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ width: `${healthScore}%` }}
              >
                {healthScore > 10 && `${healthScore}%`}
              </div>
              <div 
                className="bg-amber-100 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-amber-800"
                style={{ width: `${100 - healthScore}%` }}
              >
                {(100 - healthScore) > 10 && `${100 - healthScore}%`}
              </div>
            </div>

            <div className="flex items-center justify-around pt-2 text-xs font-semibold">
              <div className="flex items-center gap-2 text-[#0F382C]">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Completed Tasks ({completedTasks})</span>
              </div>
              <div className="flex items-center gap-2 text-amber-800">
                <XCircle className="w-4 h-4 text-amber-600" />
                <span>Incomplete Tasks ({incompleteTasks})</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}