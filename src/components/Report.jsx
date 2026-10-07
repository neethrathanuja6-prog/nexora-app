import React, { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Report({ user, tasks }) {
  const [reportType, setReportType] = useState('Daily');
  const [isGenerating, setIsGenerating] = useState(false);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const focusMinsTotal = tasks.filter(t => t.completed).reduce((acc, curr) => acc + (parseInt(curr.duration) || 0), 0);
  const focusHours = Math.floor(focusMinsTotal / 60);
  const focusMins = focusMinsTotal % 60;

  const handleDownloadPDF = async () => {
    const element = document.getElementById('report-sheet');
    if (!element) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`NEXORA_Study_${reportType}_Report.pdf`);
    } catch (error) {
      console.error("PDF generation failed, falling back to print:", error);
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F382C]">Study Reports</h1>
          <p className="text-xs text-slate-500 font-medium">Export official performance summaries as PDF</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {['Daily', 'Weekly', 'Monthly', 'Annually'].map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  reportType === type 
                    ? 'bg-[#0F382C] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F382C] text-white text-xs font-bold shadow-md hover:bg-[#08251C] disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isGenerating ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Report Document */}
      <div id="report-sheet" className="p-8 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-6 text-slate-800">
        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0F382C] uppercase">{reportType} Study Report</h2>
            <p className="text-xs font-bold text-slate-500 mt-1">Student: {user?.firstName} {user?.lastName} (ID: {user?.userId})</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              Generated Live
            </span>
          </div>
        </div>

        {/* Dynamic Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-xs font-semibold text-slate-500">Overall Progress</p>
            <p className="text-2xl font-extrabold text-[#0F382C] mt-1">{overallProgress}%</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-xs font-semibold text-slate-500">Tasks Completed</p>
            <p className="text-2xl font-extrabold text-[#0F382C] mt-1">{completedTasks} / {totalTasks}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-xs font-semibold text-slate-500">Focus Time</p>
            <p className="text-2xl font-extrabold text-[#0F382C] mt-1">{focusHours}h {focusMins}m</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-xs font-semibold text-slate-500">Backlog Tasks</p>
            <p className="text-2xl font-extrabold text-[#0F382C] mt-1">
              {tasks.filter(t => t.category === 'Backlog' && !t.completed).length}
            </p>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#0F382C]">Subject Performance Breakdown</h3>
          {(!user?.subjects || user.subjects.length === 0) ? (
            <p className="text-xs text-slate-400">No subjects configured.</p>
          ) : (
            <div className="space-y-2">
              {user.subjects.map((s, i) => {
                const subTasks = tasks.filter(t => t.subject === s.name);
                const subCompleted = subTasks.filter(t => t.completed).length;
                const score = subTasks.length > 0 ? Math.round((subCompleted / subTasks.length) * 100) : 0;
                const status = subTasks.length === 0 ? 'No Tasks' : score >= 80 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Focus';

                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium">
                    <span>{s.name}</span>
                    <span className="font-extrabold text-[#0F382C]">{score}% ({status})</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Summary */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
          {totalTasks === 0 
            ? "Welcome to NEXORA STUDY! Start adding tasks to generate performance reports." 
            : `You have completed ${overallProgress}% of your planned work. Keep maintaining your momentum!`}
        </div>
      </div>
    </div>
  );
}