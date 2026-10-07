import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, BookOpen, KeyRound, ArrowRight, Check, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [grade, setGrade] = useState('A/L');
  const [alStream, setAlStream] = useState('Commerce');
  
  // Custom Subjects State
  const [subjects, setSubjects] = useState([
    { name: 'Accounting', color: '#0F382C' },
    { name: 'Economics', color: '#1B5E4B' },
    { name: 'Business Studies', color: '#2D8A6E' }
  ]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('#0F382C');

  // Forgot Password state
  const [resetSent, setResetSent] = useState(false);

  // Password Match Check
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleGradeChange = (selectedGrade) => {
    setGrade(selectedGrade);
    if (selectedGrade === 'A/L') {
      setSubjects([
        { name: 'Accounting', color: '#0F382C' },
        { name: 'Economics', color: '#1B5E4B' },
        { name: 'Business Studies', color: '#2D8A6E' }
      ]);
    } else if (selectedGrade === 'O/L') {
      setSubjects(Array(9).fill(null).map((_, i) => ({ name: `Subject ${i + 1}`, color: '#0F382C' })));
    } else {
      setSubjects([{ name: 'Mathematics', color: '#0F382C' }]);
    }
  };

  const handleStreamChange = (stream) => {
    setAlStream(stream);
    if (stream === 'Commerce') {
      setSubjects([
        { name: 'Accounting', color: '#0F382C' },
        { name: 'Economics', color: '#1B5E4B' },
        { name: 'Business Studies', color: '#2D8A6E' }
      ]);
    } else if (stream === 'Maths') {
      setSubjects([
        { name: 'Combined Maths', color: '#0F382C' },
        { name: 'Physics', color: '#1B5E4B' },
        { name: 'Chemistry', color: '#2D8A6E' }
      ]);
    } else if (stream === 'Science') {
      setSubjects([
        { name: 'Biology', color: '#0F382C' },
        { name: 'Physics', color: '#1B5E4B' },
        { name: 'Chemistry', color: '#2D8A6E' }
      ]);
    } else if (stream === 'Art') {
      setSubjects([
        { name: 'Sinhala', color: '#0F382C' },
        { name: 'Logic', color: '#1B5E4B' },
        { name: 'Political Science', color: '#2D8A6E' }
      ]);
    } else if (stream === 'Tech') {
      setSubjects([
        { name: 'SFT', color: '#0F382C' },
        { name: 'ET/BST', color: '#1B5E4B' },
        { name: 'ICT', color: '#2D8A6E' }
      ]);
    }
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    setSubjects([...subjects, { name: newSubjectName.trim(), color: newSubjectColor }]);
    setNewSubjectName('');
  };

  const handleSubjectNameChange = (index, name) => {
    const updated = [...subjects];
    updated[index].name = name;
    setSubjects(updated);
  };

  const handleSubjectColorChange = (index, color) => {
    const updated = [...subjects];
    updated[index].color = color;
    setSubjects(updated);
  };

  // Helper Function to send Auto Welcome Email via EmailJS
  const sendWelcomeEmail = (toEmail, userName, userId) => {
    const templateParams = {
      to_email: toEmail,
      user_name: userName,
      user_id: userId,
      app_name: 'NEXORA STUDY'
    };

    // Replace with your EmailJS credentials if configured
    emailjs.send(
      'YOUR_SERVICE_ID', 
      'YOUR_TEMPLATE_ID', 
      templateParams, 
      'YOUR_PUBLIC_KEY'
    ).catch(err => console.log('EmailJS trigger fallback:', err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isLogin && passwordMismatch) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // MySQL Login API Call
        const res = await fetch('https://most-fanciness-moonscape.ngrok-free.dev/api/login', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' // මෙන්න මේ Header පේළිය එකතු කරන්න
  },
  body: JSON.stringify({ email, password })
});

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');

        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      } else {
        // MySQL Registration API Call
        const generatedUserId = 'NEX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const payload = {
          userId: generatedUserId,
          firstName,
          lastName,
          email,
          password,
          grade,
          alStream: grade === 'A/L' ? alStream : null,
          subjects: subjects.filter(s => s.name.trim() !== '')
        };

        const res = await fetch('https://most-fanciness-moonscape.ngrok-free.dev/api/register', {
    method: 'POST',
     headers: { 
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' // මෙන්න මේ Header පේළිය එකතු කරන්න
  },
  body: JSON.stringify({ email, password })
});

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');

        // Trigger Welcome Email
        sendWelcomeEmail(email, `${firstName} ${lastName}`, generatedUserId);

        if (onLoginSuccess) {
          onLoginSuccess(payload);
        }
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setResetSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FDFBF7]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-3xl p-8 border border-slate-100 shadow-xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0F382C] text-[#FAF7F0] mb-3 shadow-md">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#0F382C] tracking-wide">
            NEXORA <span className="text-[#1B5E4B]">STUDY</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isForgotPassword 
              ? 'Reset your account password' 
              : isLogin 
                ? 'Welcome back! Sign in to continue.' 
                : 'Create your personalized NEXORA account'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
            {errorMessage}
          </div>
        )}

        {/* Forgot Password Flow */}
        {isForgotPassword ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {resetSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm text-center">
                <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                Password reset link has been sent to <strong>{email}</strong>.
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="thanuja@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F382C] text-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0F382C] text-white font-semibold text-sm shadow-md hover:bg-[#08251C]"
                >
                  Send Reset Link
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => { setIsForgotPassword(false); setResetSent(false); setErrorMessage(''); }}
              className="w-full text-center text-xs text-[#1B5E4B] font-semibold mt-2 hover:underline"
            >
              Back to Sign In
            </button>
          </form>
        ) : (
          /* Main Auth Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Thanuja"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F382C] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nethra"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F382C] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ID Number</label>
                  <input 
                    type="text" 
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="200301234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F382C] text-sm"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="thanuja@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F382C] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F382C] text-sm"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none ${
                      passwordsMatch 
                        ? 'border-emerald-500 bg-emerald-50/20 text-emerald-900' 
                        : passwordMismatch 
                          ? 'border-red-500 bg-red-50/20 text-red-900' 
                          : 'border-slate-200'
                    }`}
                  />
                  {passwordsMatch && (
                    <Check className="absolute right-3.5 top-3 w-4 h-4 text-emerald-600" />
                  )}
                  {passwordMismatch && (
                    <AlertCircle className="absolute right-3.5 top-3 w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
            )}

            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Your Grade / Stage</label>
                  <select
                    value={grade}
                    onChange={(e) => handleGradeChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#0F382C]"
                  >
                    <option value="Grade 06">Grade 06</option>
                    <option value="Grade 07">Grade 07</option>
                    <option value="Grade 08">Grade 08</option>
                    <option value="Grade 09">Grade 09</option>
                    <option value="O/L">O/L</option>
                    <option value="A/L">A/L</option>
                  </select>
                </div>

                {grade === 'A/L' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">A/L Stream</label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                      {['Maths', 'Science', 'Commerce', 'Art', 'Tech'].map((stream) => (
                        <button
                          key={stream}
                          type="button"
                          onClick={() => handleStreamChange(stream)}
                          className={`py-2 rounded-lg border transition-all ${
                            alStream === stream 
                              ? 'bg-[#0F382C] text-white border-[#0F382C]' 
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {stream}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Your Subjects & Label Colors ({subjects.length} Labels)
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-slate-50/80 rounded-xl border border-slate-200">
                    {subjects.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => handleSubjectNameChange(idx, e.target.value)}
                          placeholder={`Subject ${idx + 1}`}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                        />
                        <input
                          type="color"
                          value={sub.color}
                          onChange={(e) => handleSubjectColorChange(idx, e.target.value)}
                          className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>

                  {(grade !== 'O/L' && grade !== 'A/L') && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Add extra subject..."
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none"
                      />
                      <input
                        type="color"
                        value={newSubjectColor}
                        onChange={(e) => setNewSubjectColor(e.target.value)}
                        className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={handleAddSubject}
                        className="px-3 py-1.5 rounded-lg bg-[#0F382C] text-white text-xs font-medium"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-4 rounded-xl bg-[#0F382C] text-white font-semibold text-sm shadow-md hover:bg-[#08251C] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs text-[#1B5E4B] hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setErrorMessage(''); }}
                className="text-xs text-slate-600 font-medium"
              >
                {isLogin ? "Don't have an account? " : "Already registered? "}
                <span className="text-[#0F382C] font-bold hover:underline">
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}