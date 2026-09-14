import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Camera, 
  CameraOff, 
  Mic, 
  Radio, 
  UserCheck,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { speakText, stopSpeaking } from '../lib/speech';

interface VideoInterviewerStageProps {
  questionText: string;
  isEvaluating: boolean;
  questionNumber: number;
  totalQuestions: number;
  domain: string;
}

export const VideoInterviewerStage: React.FC<VideoInterviewerStageProps> = ({
  questionText,
  isEvaluating,
  questionNumber,
  totalQuestions,
  domain,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Toggle user candidate webcam preview in PIP box
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
    } else {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 },
          audio: false 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch (err: any) {
        console.warn('Webcam access was not granted:', err);
        setCameraError('Camera disabled or unavailable in this view.');
        setCameraActive(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSpeakQuestion = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(questionText, () => {
        setIsSpeaking(false);
      });
    }
  };

  // Interviewer name & title based on domain
  const coachTitle = domain === 'Software Engineering' 
    ? 'Principal Engineering Director' 
    : domain === 'Core Engineering' 
      ? 'VP of Systems & Hardware' 
      : 'Senior Executive Talent Partner';

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group select-none">
      {/* Top Video Header Bar matching screenshot */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600/90 text-white text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>REC • AI Coach Live</span>
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-slate-300">
            Simulated 1-on-1 Interview
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio TTS button */}
          <button
            id="coach-tts-btn"
            type="button"
            onClick={handleSpeakQuestion}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md transition-all ${
              isSpeaking
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 ring-2 ring-purple-400'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title="Listen to the interviewer read the question"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Question</span>
              </>
            )}
          </button>

          {/* Toggle Camera button */}
          <button
            type="button"
            onClick={toggleCamera}
            className={`p-1.5 rounded-lg text-xs backdrop-blur-md transition-all ${
              cameraActive 
                ? 'bg-emerald-600 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title={cameraActive ? 'Turn off candidate camera' : 'Turn on candidate camera preview'}
          >
            {cameraActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Video Viewport (AI Interviewer stage matching screenshot 2) */}
      <div className="relative w-full aspect-video min-h-[260px] sm:min-h-[320px] max-h-[400px] flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 overflow-hidden">
        
        {/* Realistic executive office backdrop representation */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-900/60 to-slate-950"></div>
        
        {/* Ambient warm lighting & architectural backdrop elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* AI Interviewer Avatar & Simulation Display matching Screenshot 2 */}
        <div className="relative z-10 flex flex-col items-center text-center p-4">
          
          {/* Animated Avatar Circle with audio pulse rings */}
          <div className="relative mb-3">
            {isSpeaking && (
              <>
                <span className="absolute -inset-2.5 rounded-full border border-purple-500/60 animate-ping"></span>
                <span className="absolute -inset-5 rounded-full border border-indigo-400/40 animate-pulse"></span>
              </>
            )}

            {/* Simulated Interviewer Persona */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-purple-800 via-indigo-700 to-indigo-900 p-1 shadow-2xl ring-4 ring-white/10 overflow-hidden relative">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden relative">
                {/* Clean, professional executive interviewer portrait visual */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-purple-900/30"></div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-white mb-1 shadow-inner">
                    <UserCheck className="w-6 h-6 text-indigo-300" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-300">
                    AI Partner
                  </span>
                </div>
              </div>
            </div>

            {/* Speaking Status Pill */}
            {isSpeaking ? (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-purple-600 text-[10px] font-extrabold text-white flex items-center gap-1 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                Speaking...
              </div>
            ) : isEvaluating ? (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-[10px] font-extrabold text-white flex items-center gap-1 shadow-lg">
                <Sparkles className="w-3 h-3 animate-spin text-indigo-200" />
                Analyzing
              </div>
            ) : (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 text-[10px] font-semibold border border-slate-700 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-emerald-400" />
                Listening
              </div>
            )}
          </div>

          <div className="text-white font-bold text-base sm:text-lg tracking-tight">
            Elena Vance
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {coachTitle} • {domain}
          </div>

          {/* Audio Waveform visualization */}
          <div className="flex items-center gap-1 mt-3.5 h-5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            {[4, 8, 14, 18, 12, 6, 16, 20, 10, 4, 12, 16, 8].map((h, i) => (
              <span
                key={i}
                style={{
                  height: isSpeaking ? `${h}px` : isEvaluating ? '6px' : '3px',
                  transition: 'height 0.15s ease'
                }}
                className={`w-1 rounded-full ${
                  isSpeaking ? 'bg-purple-400' : isEvaluating ? 'bg-indigo-400' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Candidate Picture-in-Picture Mini Box (bottom right, matching screenshot 2) */}
        <div className="absolute bottom-3 right-3 z-20 w-28 h-20 sm:w-36 sm:h-24 rounded-xl bg-slate-900/95 border-2 border-slate-700/80 shadow-xl overflow-hidden backdrop-blur-md flex items-center justify-center">
          {cameraActive ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-1 text-center">
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-1">
                <Camera className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-[10px] font-semibold text-slate-300">You (Candidate)</span>
              <button 
                onClick={toggleCamera}
                className="text-[9px] text-purple-400 hover:text-purple-300 underline font-medium mt-0.5"
              >
                Enable Cam
              </button>
            </div>
          )}
          <div className="absolute top-1 left-1.5 px-1 py-0.2 rounded bg-black/70 text-[8px] font-bold text-white uppercase tracking-wider">
            Candidate
          </div>
        </div>

      </div>

      {/* Video Footer info strip */}
      <div className="px-4 py-2 bg-slate-900/95 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-purple-400 font-medium">{domain}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <span>Simulation Mode</span>
        </div>
      </div>
    </div>
  );
};
