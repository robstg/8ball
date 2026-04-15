'use client'

import { useForm, ValidationError } from '@formspree/react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  // Use the Formspree hook with your unique ID
  const [state, handleSubmit] = useForm('xbdqlejw');

  // 1. Success State: When the ball is potted
  if (state.succeeded) {
    return (
      <div className="bg-white border border-emerald-100 p-16 rounded-[2rem] text-center shadow-xl">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-6">
          <CheckCircle className="text-emerald-500" size={40} />
        </div>
        <h3 className="text-3xl font-black uppercase italic text-slate-900 tracking-tighter">
          Ball Potted!
        </h3>
        <p className="text-slate-500 mt-3 max-w-xs mx-auto leading-relaxed">
          Your message is in the pocket. We'll get back to you shortly.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  // 2. The Form (Main View)
  return (
    <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100">
      <div className="grid md:grid-cols-5">
        
        {/* Left Branding Side */}
        <div className="md:col-span-2 bg-[#004d33] p-12 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
              Get in <br />Touch
            </h3>
            <p className="text-emerald-100/70 text-sm leading-relaxed">
              Have a question about a review or a tip for the archive? Drop us a line.
            </p>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400/50">
            Pot The Black — Auckland, NZ
          </div>
        </div>

        {/* Right Form Side */}
        <form onSubmit={handleSubmit} className="md:col-span-3 p-10 space-y-6">
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <input
                id="name"
                type="text" 
                name="name"
                required
                placeholder="Full Name"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all"
              />
              <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-xs mt-1 ml-2" />
            </div>

            {/* Email Field */}
            <div>
              <input
                id="email"
                type="email" 
                name="email"
                required
                placeholder="Email Address"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all"
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1 ml-2" />
            </div>

            {/* Message Field */}
            <div>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder="How can we help?"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm resize-none transition-all"
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-xs mt-1 ml-2" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={state.submitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-3 group"
          >
            {state.submitting ? 'Sending...' : 'Send Message'}
            <Send size={18} className={state.submitting ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'} />
          </button>

          {/* Error Handling */}
          {state.errors && state.errors.length > 0 && (
            <div className="flex items-center gap-2 text-red-500 justify-center">
              <AlertCircle size={14} />
              <p className="text-[10px] font-bold uppercase tracking-widest">Something went wrong. Try again.</p>
            </div>
          )}
        </form>

      </div>
    </div>
  )
}