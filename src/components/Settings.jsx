import React, { useState } from 'react';
import { User, Phone, Mail, MessageSquare, Globe, Save } from 'lucide-react';

export default function Settings({ user, setUser }) {
  const [timeline, setTimeline] = useState('Asia/Colombo');

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-[#0F382C]">Settings</h1>
        <p className="text-xs text-slate-500 font-medium">Customize your timeline and contact support</p>
      </div>

      {/* Timeline Setting */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-[#0F382C] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#1B5E4B]" />
          <span>Timeline / Timezone</span>
        </h3>
        <select 
          value={timeline} 
          onChange={(e) => setTimeline(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-white font-medium"
        >
          <option value="Asia/Colombo">Sri Lanka (Asia/Colombo)</option>
          <option value="UTC">UTC Standard</option>
          <option value="America/New_York">US Eastern Time</option>
        </select>
      </div>

      {/* Contact Support */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#0F382C]">Contact Support</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <a href="tel:0764899065" className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 hover:bg-slate-100">
            <Phone className="w-5 h-5 text-emerald-700" />
            <div>
              <p className="font-bold text-slate-800">Phone</p>
              <p className="text-slate-500">0764899065</p>
            </div>
          </a>

          <a href="https://wa.me/94703566025" target="_blank" rel="noreferrer" className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 hover:bg-slate-100">
            <MessageSquare className="w-5 h-5 text-emerald-700" />
            <div>
              <p className="font-bold text-slate-800">WhatsApp</p>
              <p className="text-slate-500">070 3566025</p>
            </div>
          </a>

          <a href="mailto:nethrathanuja@gmail.com" className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 hover:bg-slate-100">
            <Mail className="w-5 h-5 text-emerald-700" />
            <div>
              <p className="font-bold text-slate-800">Technical Support</p>
              <p className="text-slate-500">nethrathanuja@gmail.com</p>
            </div>
          </a>

          <a href="mailto:neethrathanuja6@gmail.com" className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 hover:bg-slate-100">
            <Mail className="w-5 h-5 text-emerald-700" />
            <div>
              <p className="font-bold text-slate-800">Private Student Analysis</p>
              <p className="text-slate-500">neethrathanuja6@gmail.com</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}