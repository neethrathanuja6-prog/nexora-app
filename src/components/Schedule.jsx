import React, { useState } from 'react';
import { Plus, Clock, ChevronLeft, ChevronRight, MoveRight, Trash2, CheckCircle } from 'lucide-react';

export default function Schedule({ tasks, schedules, setSchedules }) {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form for custom schedule block
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('09:00 AM');
  const [type, setType] = useState('Custom Task');

  // Drag and Drop state
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnSchedule = (e) => {
    e.preventDefault();
    if (!draggedTask) return;

    const newScheduleItem = {
      id: Date.now(),
      title: `${draggedTask.name} (${draggedTask.subject})`,
      time: '02:00 PM - 03:00 PM',
      type: 'Task Slot'
    };

    setSchedules([...schedules, newScheduleItem]);
    setDraggedTask(null);
  };

  const handleAssignTaskClick = (task) => {
    const newScheduleItem = {
      id: Date.now(),
      title: `${task.name} (${task.subject})`,
      time: `${startTime} - ${endTime}`,
      type: 'Task Slot'
    };
    setSchedules([...schedules, newScheduleItem]);
  };

  const handleAddCustomBlock = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newScheduleItem = {
      id: Date.now(),
      title: title,
      time: `${startTime} - ${endTime}`,
      type: type
    };

    setSchedules([...schedules, newScheduleItem]);
    setTitle('');
    setShowAddModal(false);
  };

  const handleDeleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F382C]">Interactive Schedule Builder</h1>
          <p className="text-xs text-slate-500 font-medium">Drag and drop tasks onto daily time blocks</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F382C] text-white text-xs font-bold shadow-md hover:bg-[#08251C]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Time Block</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Calendar & Unassigned Tasks */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Calendar Picker */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-700">Select Date</h3>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400">
              {['S','M','T','W','T','F','S'].map((d, i) => <div key={i}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedDate === day 
                      ? 'bg-[#0F382C] text-white shadow-md' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Drag and Drop Tasks Pool */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#0F382C]">Unassigned Tasks (Drag or Click)</h3>
            <p className="text-[11px] text-slate-400">Drag a task to the schedule block or click '+' to schedule it.</p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-400 p-4 text-center">No tasks available. Add tasks in Task Manager first.</p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 cursor-grab active:cursor-grabbing hover:border-emerald-400 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#0F382C]">{task.name}</p>
                      <p className="text-[10px] text-slate-500">{task.subject} • {task.duration}m</p>
                    </div>
                    <button
                      onClick={() => handleAssignTaskClick(task)}
                      className="p-1.5 rounded-lg bg-[#0F382C] text-white hover:bg-[#08251C]"
                      title="Add to Schedule"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Daily Time Blocks Dropzone */}
        <div className="lg:col-span-2">
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDropOnSchedule}
            className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm min-h-[450px] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-700">Scheduled Time Blocks for Date {selectedDate}</h3>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">Dropzone Active</span>
            </div>

            {schedules.length === 0 ? (
              <div className="h-72 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 space-y-2">
                <MoveRight className="w-8 h-8 text-slate-300 animate-pulse" />
                <p className="text-xs font-medium">Drag tasks from the left pool and drop them here,</p>
                <p className="text-[11px]">or click "Add Custom Time Block" above to create school/tuition hours.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.map((block) => (
                  <div key={block.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#0F382C] text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{block.time}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{block.title}</h4>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">{block.type}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSchedule(block.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Custom Time Block Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#0F382C]">Add Custom Schedule Block</h3>
            <form onSubmit={handleAddCustomBlock} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Block Title / Event</label>
                <input 
                  type="text" required
                  placeholder="e.g. School Time, Tuition Class, Travel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Start Time</label>
                  <input 
                    type="text" required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="07:30 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">End Time</label>
                  <input 
                    type="text" required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="01:20 PM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="School & Class">School & Class</option>
                  <option value="Personal Study">Personal Study</option>
                  <option value="Travel / Break">Travel / Break</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F382C] text-white text-xs font-semibold"
                >
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}