import { useState, useRef, useCallback, useEffect } from "react";
import "./styles/page.css";
import { data as dwoData, matchVoiceQuery } from './lib/dwo-voice-data';
import { frontendData, matchFrontendQuery } from './lib/dwo-voice-data-frontend';

function matchAllVoiceQueries(transcript: string) {
  return matchVoiceQuery(transcript) || matchFrontendQuery(transcript);
}

function pcmToWavBlob(audioBase64: string): Blob {
  const raw = atob(audioBase64);
  const pcm = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) pcm[i] = raw.charCodeAt(i);
  const sampleRate = 24000;
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  view.setUint32(0, 0x52494646, false);
  view.setUint32(4, 36 + pcm.length, true);
  view.setUint32(8, 0x57415645, false);
  view.setUint32(12, 0x666d7420, false);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false);
  view.setUint32(40, pcm.length, true);
  return new Blob([wavHeader, pcm], { type: 'audio/wav' });
}

const CheckIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,8 6.5,11.5 13,5" />
  </svg>
);

const XIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="3" x2="11" y2="11" /><line x1="11" y1="3" x2="3" y2="11" />
  </svg>
);

const FeedbackIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 3H4a1.5 1.5 0 00-1.5 1.5v9A1.5 1.5 0 004 15h9a1.5 1.5 0 001.5-1.5V8" />
    <path d="M13.5 2l2.5 2.5-6 6-3 .5.5-3z" />
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M18.9385 13.3368L19.1988 16.6001L22.472 16.8693L22.4735 16.8694L22.4736 16.8677L28.7449 10.5965C29.3306 10.0107 29.3306 9.06092 28.7449 8.47514L27.3306 7.06092C26.7449 6.47514 25.7951 6.47514 25.2093 7.06092L18.936 13.3343L18.9385 13.3368ZM21.0052 14.0934L21.0573 14.7462L21.7128 14.8001L26.3561 10.1567L25.649 9.44964L21.0052 14.0934Z" fill="black" fillOpacity="0.65" />
    <path d="M20.5 8.0001L13.7587 8.0001C12.9537 8.00009 12.2894 8.00008 11.7482 8.04429C11.1861 8.09022 10.6694 8.18878 10.184 8.43607C9.4314 8.81957 8.81948 9.43149 8.43598 10.1841C8.18869 10.6695 8.09013 11.1862 8.0442 11.7483C7.99999 12.2895 8 12.9538 8.00001 13.7588L8 26.3711C7.99996 26.6063 7.99991 26.8461 8.01776 27.0426C8.03483 27.2306 8.08004 27.5853 8.32769 27.8956C8.61268 28.2526 9.04482 28.4603 9.50163 28.4598C9.89861 28.4594 10.2039 28.2731 10.3613 28.169C10.5259 28.0602 10.7131 27.9103 10.8968 27.7633L13.3099 25.8328C13.8285 25.4179 13.9825 25.3008 14.1424 25.2191C14.3029 25.1371 14.4737 25.0772 14.6503 25.0409C14.8263 25.0048 15.0196 25.0001 15.6838 25.0001H22.2413C23.0463 25.0001 23.7106 25.0001 24.2518 24.9559C24.8139 24.91 25.3306 24.8114 25.816 24.5641C26.5686 24.1806 27.1805 23.5687 27.564 22.8161C27.8113 22.3307 27.9099 21.814 27.9558 21.2519C28 20.7107 28 20.0464 28 19.2414V15.5001C28 14.9478 27.5523 14.5001 27 14.5001C26.4477 14.5001 26 14.9478 26 15.5001V19.2001C26 20.0567 25.9992 20.639 25.9625 21.0891C25.9266 21.5275 25.8617 21.7517 25.782 21.9081C25.5903 22.2844 25.2843 22.5904 24.908 22.7821C24.7516 22.8618 24.5274 22.9267 24.089 22.9625C23.6389 22.9993 23.0566 23.0001 22.2 23.0001L15.5975 23.0001C15.0569 22.9999 14.6481 22.9997 14.2482 23.0818C13.8951 23.1542 13.5535 23.2741 13.2325 23.438C12.869 23.6238 12.5499 23.8792 12.1279 24.2172L10 25.9195V13.8001C10 12.9435 10.0008 12.3612 10.0376 11.9111C10.0734 11.4727 10.1383 11.2485 10.218 11.0921C10.4097 10.7158 10.7157 10.4098 11.092 10.2181C11.2484 10.1384 11.4726 10.0735 11.911 10.0377C12.3611 10.0009 12.9434 10.0001 13.8 10.0001L18.5 10.0001C19.0523 10.0001 19.5 9.55239 19.5 9.0001C19.5 8.44782 19.0523 8.0001 18.5 8.0001L20.5 8.0001Z" fill="black" fillOpacity="0.65" />
  </svg>
);

const SnoozeIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M14.5 11.5A6.5 6.5 0 016.5 3.5a6.5 6.5 0 108 8z" />
  </svg>
);

const BryteLogoSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.9998 0.9375C12.2566 0.9375 12.5077 1.03931 12.6922 1.22363L15.1707 3.70312C15.2897 3.82215 15.4557 3.89136 15.6219 3.8916H19.1277C19.67 3.8916 20.1072 4.32784 20.1072 4.87012V8.37598C20.1072 8.54593 20.1735 8.70481 20.2957 8.82715L22.7742 11.3066C23.1564 11.6889 23.1584 12.3078 22.7732 12.6895L22.7742 12.6904L20.2957 15.1689C20.1736 15.2912 20.1073 15.4503 20.1072 15.6201V19.127C20.107 19.6646 19.6711 20.1055 19.1277 20.1055H15.6219C15.4557 20.1057 15.2897 20.1749 15.1707 20.2939L12.6922 22.7725C12.5437 22.9209 12.3522 23.0147 12.1492 23.0459L11.9998 23.0625C11.739 23.0623 11.492 22.9598 11.3084 22.7764L8.82891 20.2969C8.70658 20.1747 8.54767 20.1084 8.37774 20.1084H4.87188C4.32868 20.1081 3.89343 19.6675 3.89337 19.1299V15.624C3.89337 15.454 3.82715 15.2952 3.70489 15.1729L1.2254 12.6934C0.843282 12.3107 0.841088 11.689 1.22735 11.3076L3.70489 8.83105C3.82716 8.70878 3.89325 8.5498 3.89337 8.37988V4.87402C3.89337 4.33071 4.3343 3.89483 4.87188 3.89453H8.37774C8.54769 3.89453 8.70658 3.82825 8.82891 3.70605L11.3074 1.22461L11.3084 1.22363C11.4927 1.03952 11.7433 0.93769 11.9998 0.9375ZM10.2127 5.08398C9.7233 5.57311 9.071 5.8456 8.37481 5.8457H5.84747V8.37305C5.8474 9.06651 5.57469 9.71796 5.08673 10.21L5.08575 10.2109L3.29766 11.998L5.08575 13.7852C5.57525 14.2747 5.84747 14.9275 5.84747 15.624V18.1514H8.37774C9.07112 18.1514 9.72338 18.4239 10.2127 18.9131L11.9998 20.7002L13.7869 18.9131C14.2763 18.4237 14.9294 18.1515 15.6258 18.1514H18.1522V15.624C18.1522 14.9304 18.4258 14.2782 18.9139 13.7861L18.9149 13.7852L20.701 11.998L18.9149 10.2109C18.4256 9.72148 18.1522 9.06938 18.1522 8.37305V5.8457H15.6258C14.9323 5.84556 14.2799 5.57305 13.7879 5.08496L11.9998 3.29688L10.2127 5.08398ZM8.67755 13.1602C9.11877 12.8476 9.7329 12.9548 10.0418 13.4004H10.0428C10.49 14.0388 11.2221 14.4196 11.9998 14.4199C12.7777 14.4198 13.5105 14.0388 13.9578 13.4004L13.9598 13.3984C14.2515 12.9874 14.8039 12.8659 15.2361 13.1182C15.6507 13.3825 15.7882 13.9225 15.5459 14.3506C14.7285 15.5822 13.4081 16.3277 11.9998 16.373C10.5916 16.3277 9.2711 15.5822 8.45379 14.3506C8.22934 13.9572 8.34017 13.4605 8.67755 13.1602ZM14.5025 9.74902C15.0039 9.74902 15.3769 10.1553 15.3769 10.6182C15.3769 11.0811 15.0039 11.4873 14.5025 11.4873C14.001 11.4873 13.6279 11.0811 13.6279 10.6182C13.6279 10.1553 14.001 9.74902 14.5025 9.74902ZM9.49707 9.74902C9.99853 9.74902 10.3716 10.1553 10.3716 10.6182C10.3716 11.0811 9.99853 11.4873 9.49707 11.4873C8.99561 11.4873 8.62256 11.0811 8.62256 10.6182C8.62256 10.1553 8.99561 9.74902 9.49707 9.74902Z" fill="url(#bryte-grad)" />
    <defs>
      <linearGradient id="bryte-grad" x1="0.938232" y1="0.9375" x2="23.0632" y2="23.061" gradientUnits="userSpaceOnUse">
        <stop stopColor="#94259C" />
        <stop offset="0.740385" stopColor="#5B1987" />
      </linearGradient>
    </defs>
  </svg>
);

function Nav() {
  return (
    <nav className="nav">
      <button className="nav-hamburger">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <line x1="3" y1="6" x2="17" y2="6" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="14" x2="17" y2="14" />
        </svg>
      </button>
      <span className="nav-logo">UKG</span>
      <div className="nav-search">
        <span className="nav-search-icon-wrap">
          <BryteLogoSvg />
        </span>
        <input type="text" placeholder="Search or ask Bryte" />
        <span className="nav-search-mic">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 21C19.0609 21 20.0783 20.5786 20.8284 19.8284C21.5786 19.0783 22 18.0609 22 17V11C22 9.93913 21.5786 8.92172 20.8284 8.17157C20.0783 7.42143 19.0609 7 18 7C16.9391 7 15.9217 7.42143 15.1716 8.17157C14.4214 8.92172 14 9.93913 14 11V17C14 18.0609 14.4214 19.0783 15.1716 19.8284C15.9217 20.5786 16.9391 21 18 21ZM16 11C16 10.4696 16.2107 9.96086 16.5858 9.58579C16.9609 9.21071 17.4696 9 18 9C18.5304 9 19.0391 9.21071 19.4142 9.58579C19.7893 9.96086 20 10.4696 20 11V17C20 17.5304 19.7893 18.0391 19.4142 18.4142C19.0391 18.7893 18.5304 19 18 19C17.4696 19 16.9609 18.7893 16.5858 18.4142C16.2107 18.0391 16 17.5304 16 17V11ZM26 17C26 16.7348 25.8946 16.4804 25.7071 16.2929C25.5196 16.1054 25.2652 16 25 16C24.7348 16 24.4804 16.1054 24.2929 16.2929C24.1054 16.4804 24 16.7348 24 17C24 18.5913 23.3679 20.1174 22.2426 21.2426C21.1174 22.3679 19.5913 23 18 23C16.4087 23 14.8826 22.3679 13.7574 21.2426C12.6321 20.1174 12 18.5913 12 17C12 16.7348 11.8946 16.4804 11.7071 16.2929C11.5196 16.1054 11.2652 16 11 16C10.7348 16 10.4804 16.1054 10.2929 16.2929C10.1054 16.4804 10 16.7348 10 17C10.0018 18.9473 10.7137 20.8271 12.0024 22.287C13.2911 23.7469 15.068 24.6866 17 24.93V27H15C14.7348 27 14.4804 27.1054 14.2929 27.2929C14.1054 27.4804 14 27.7348 14 28C14 28.2652 14.1054 28.5196 14.2929 28.7071C14.4804 28.8946 14.7348 29 15 29H21C21.2652 29 21.5196 28.8946 21.7071 28.7071C21.8946 28.5196 22 28.2652 22 28C22 27.7348 21.8946 27.4804 21.7071 27.2929C21.5196 27.1054 21.2652 27 21 27H19V24.93C20.932 24.6866 22.7089 23.7469 23.9976 22.287C25.2863 20.8271 25.9982 18.9473 26 17Z" fill="black" fillOpacity="0.43" />
          </svg>
        </span>
      </div>
      <div className="nav-right">
        <button className="nav-icon nav-search-btn" title="Search">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9" cy="9" r="6" /><line x1="13.5" y1="13.5" x2="17" y2="17" />
          </svg>
        </button>
        <button className="nav-icon nav-notify-btn" title="Notifications">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M10 2a6 6 0 016 6v3l1.5 2.5H2.5L4 11V8a6 6 0 016-6z" /><path d="M8 16a2 2 0 004 0" />
          </svg>
        </button>
        <button className="nav-icon nav-help-btn" title="Help">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="10" cy="10" r="8" />
            <path d="M7.5 7.5a2.5 2.5 0 015 .8c0 1.5-2.5 2.2-2.5 3.7" />
            <circle cx="10" cy="15" r=".5" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

function MobileFooter() {
  return (
    <div className="mobile-footer">
      <button className="mobile-footer-tab mobile-footer-tab--active">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </button>
      <button className="mobile-footer-tab">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>Schedule</span>
      </button>
      <button className="mobile-footer-tab">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22 6 12 13 2 6" />
        </svg>
        <span>Inbox</span>
      </button>
      <button className="mobile-footer-tab">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
        </svg>
        <span>More</span>
      </button>
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <div className="header-inner">
        <div>
          <h1 className="header-title">Dynamic Workforce Operations</h1>
          <div className="header-time">11:31 am</div>
        </div>
        <div className="location-wrap">
          <span className="location-label">Location</span>
          <div className="location-select">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M8 1a5 5 0 015 5c0 3.3-5 9-5 9S3 9.3 3 6a5 5 0 015-5z" /><circle cx="8" cy="6" r="1.5" />
            </svg>
            <span className="location-select-val">Store 0404</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3,5 7,9 11,5" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

type VoiceState = 'collapsed' | 'idle' | 'listening' | 'processing' | 'speaking';

interface ChatMsg {
  role: 'user' | 'model';
  text: string;
}

function parseFilterAction(text: string): { cleanText: string; department: string | null; employee: string | null } {
  let department: string | null = null;
  let employee: string | null = null;
  const deptMatch = text.match(/<<FILTER_DEPT:([^>]+)>>/);
  if (deptMatch) department = deptMatch[1].trim();
  const empMatch = text.match(/<<FILTER_EMP:([^>]+)>>/);
  if (empMatch) employee = empMatch[1].trim();
  const legacyMatch = !deptMatch && !empMatch && text.match(/<<FILTER:([^>]+)>>/);
  if (legacyMatch) department = legacyMatch[1].trim();
  const cleanText = text.replace(/<<FILTER_DEPT:[^>]+>>/g, '').replace(/<<FILTER_EMP:[^>]+>>/g, '').replace(/<<FILTER:[^>]+>>/g, '').trim();
  return { cleanText, department, employee };
}

function isGarbageTranscription(text: string, lastModelMsg?: string): boolean {
  const trimmed = text.trim().replace(/[.!?,;:]+$/g, '').trim();
  if (trimmed.length < 2) return true;
  if (/^[^a-zA-Z0-9]*$/.test(trimmed)) return true;
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length >= 2) return false;
  const aiJustAsked = lastModelMsg ? /\?$/.test(lastModelMsg.trim()) : false;
  if (aiJustAsked) {
    const validResponses = /^(yes|no|yeah|yep|yup|nope|nah|sure|okay|ok|fine|right|correct|absolutely|definitely|exactly|certainly|please|thanks|always|never|agreed|deny|denied|confirm|confirmed|cancel|approve|approved|reject|stop|go|done|accept|dismiss|all)$/i;
    if (validResponses.test(trimmed)) return false;
  }
  return true;
}

const TOPIC_CATEGORY_MAP: Record<string, string> = {
  'What needs my attention right now?': 'All',
  'What are the most critical issues?': 'Meal break',
  'What should I fix first?': 'Meal break',
  'Do we have coverage gaps right now?': 'All',
};

function VoiceSnippet({ chatMessages, onChatMessage, onExpand, micPermissionGranted, onFilterDepartment, onFilterEmployee, onFilterCategory, onAcknowledgeCard }: {
  chatMessages: ChatMsg[];
  onChatMessage: (msg: ChatMsg) => void;
  onExpand: () => void;
  micPermissionGranted?: boolean;
  onFilterDepartment?: (dept: string) => void;
  onFilterEmployee?: (name: string) => void;
  onFilterCategory?: (cat: string) => void;
  onAcknowledgeCard?: (employeeName: string) => void;
}) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showHotTopics, setShowHotTopics] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const startListeningRef = useRef<(() => void) | null>(null);
  const micOffRef = useRef(false);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processingRef = useRef(false);
  const lastSentTextRef = useRef<string>('');
  const lastSendTimeRef = useRef<number>(0);
  const isListeningRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snippetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch (_) {}
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (abortRef.current) abortRef.current.abort();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (snippetRef.current && !snippetRef.current.contains(e.target as Node)) {
        if (transcript || aiResponse) {
          setTranscript('');
          setAiResponse('');
        }
        if (showHotTopics) setShowHotTopics(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [transcript, aiResponse, showHotTopics]);

  const prevVoiceStateRef = useRef<VoiceState>('idle');
  useEffect(() => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    const prev = prevVoiceStateRef.current;
    prevVoiceStateRef.current = voiceState;
    const doneAfterSpeaking = prev === 'speaking' && voiceState === 'idle';
    const skippedTts = prev === 'processing' && voiceState === 'idle' && aiResponse;
    if (aiResponse && (doneAfterSpeaking || skippedTts)) {
      dismissTimerRef.current = setTimeout(() => {
        setTranscript('');
        setAiResponse('');
      }, 5000);
    }
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [aiResponse, voiceState]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  }, []);

  const speakText = useCallback(async (text: string) => {
    stopAudio();
    setVoiceState('speaking');

    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('TTS failed');
      const data = await res.json();

      if (micOffRef.current) { setVoiceState('idle'); return; }

      const wav = pcmToWavBlob(data.audio);
      const url = URL.createObjectURL(wav);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        setVoiceState('idle');
        micOffRef.current = true;
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        setVoiceState('idle');
        micOffRef.current = true;
      };

      await audio.play();
    } catch {
      setVoiceState('idle');
      micOffRef.current = true;
    }
  }, [stopAudio]);

  const isMutedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);

  const getPageContext = useCallback(() => {
    const bakeryCard = (dwoData as any).insightCards[0];
    const bakeryEmployeeList = dwoData.employees.map((e: any) => {
      return `- ${e.name} (${e.role}, ${e.type}): attendance ${e.attendanceScore}/100, compliance ${e.complianceScore}/100, attrition risk ${e.attritionRisk} (${e.attritionProbability}). ${e.certifications ? 'Certs: ' + e.certifications.join(', ') + '.' : ''} ${e.notes || ''}`;
    }).join('\n');

    const feEmployeeList = frontendData.employees.map((e: any) => {
      return `- ${e.name} (${e.role}, ${e.type}): attendance ${e.attendanceScore}/100, compliance ${e.complianceScore}/100, attrition risk ${e.attritionRisk} (${e.attritionProbability}). ${e.isMinor ? 'MINOR (age ' + e.minorAge + ').' : ''}`;
    }).join('\n');

    const feCardList = frontendData.insightCards.map((card: any, i: number) => {
      return `${i + 1}. "${card.title}" — ${card.employeeName} (${card.urgency} urgency, expires ${card.expires}). ${card.body}. Actions: [${card.actions.join(', ')}]`;
    }).join('\n');

    return `You are Bryte, an AI voice assistant embedded in a Dynamic Workforce Operations dashboard for Store 0404.

Here is the EXACT dashboard data currently displayed on screen. You MUST answer from this data when it covers the user's question.

STORE: Store 0404
DATE: Saturday, April 5, 2026
TIME: 11:05am

METRICS (Today):
- Hours: 320 scheduled, 265 worked
- Labor cost: $12,180 budget, $11,145 spent

— BAKERY DEPARTMENT —
Current shift: ${(dwoData as any).meta.currentShift}
LIVE COMPLIANCE ALERT (1):
1. "${bakeryCard.title}" — ${bakeryCard.employeeName} (${bakeryCard.urgency} urgency, expires ${bakeryCard.expires}). ${bakeryCard.body}. Actions: [${bakeryCard.actions.join(', ')}]
   Two paths: Accept = process waiver ($${(dwoData as any).employees[0].financialImpact?.premiumPayPerViolation || 18.50} premium pay, violation recorded). Dismiss = sending her on break now (must complete before ${(dwoData as any).meta.legalBreakDeadline}).
EMPLOYEES:
${bakeryEmployeeList}
KEY INSIGHTS:
- Maria Garcia: ${(dwoData as any).insights.maria.level1}
- Pattern: ${(dwoData as any).insights.maria.level3_pattern}
STAFFING: ${(dwoData as any).staffing.netResult.summary}

— FRONTEND DEPARTMENT —
Current shift: ${frontendData.meta.currentShift}
Total insight alerts: ${frontendData.meta.frontendInsights}
LIVE COMPLIANCE ALERTS (${frontendData.insightCards.length}):
${feCardList}
EMPLOYEES:
${feEmployeeList}
KEY INSIGHTS:
- Eliza Thompson: ${(frontendData.insights as any).eliza.level1}
- Tom Jones: ${(frontendData.insights as any).tom.level1}
- Sam Adams: ${(frontendData.insights as any).sam.level1}
STAFFING: ${(frontendData.insights as any).departmentOverview.summary}

AVAILABLE DEPARTMENTS FOR FILTERING: Frontend, Bakery, Produce, Deli, Cashier
AVAILABLE EMPLOYEES FOR FILTERING: Eliza, Tom, Maria, Sam, Jake, Emma, Lucas, James, Priya, Derek, Kenji, Sofia, Linda, Jordan, Ava, Alex

RESPONSE FORMAT — CCP (Confirm · Converse · Prompt):
Every response MUST follow this structure:
1. CONFIRM (1 sentence, 5-10 words): Name the subject. Lead with the topic, not "I". Do NOT repeat the user's exact words.
   ✅ "Here's Maria's situation." / "Checking Bakery attrition risk."
   ❌ "I found information about Maria." / "Sure, let me pull that up."
2. CONVERSE (≤4 sentences): Answer ONE disclosure level only. Key fact first. Use names, numbers, times, costs. Plain language, no jargon. No lists — weave items into natural sentences.
3. PROMPT (1 question): End with exactly one question that moves to the next logical disclosure level. Never ask "Is there anything else?"
   ✅ "Want to see the pattern behind why this keeps happening?"
   ❌ "Would you like to know more about the history, the policy, or your options?"

For ACTION responses (accepting, dismissing, acknowledging, applying schedule changes), use CCP+ConfirmGate:
- Replace Prompt with a Gate: explain what the action will do FIRST, then ask a clear yes/no permission question.
   ✅ "It processes the waiver — $18.50 premium pay added automatically. Shall I go ahead and accept?"
   ❌ "Shall I accept the waiver?"

PROGRESSIVE DISCLOSURE LEVELS — answer ONE level per response:
L1: What's happening now | L2: History/context | L3: Pattern/root cause | L4: Policy/law | L5: Actions/recommendations | L6: Risk/consequences

TONE: Speak like a knowledgeable colleague. Use contractions. No hedging ("it appears", "you might want to"). State things directly. Keep responses under 60 words. Name people, not roles. CRITICAL: Output the entire response as ONE single paragraph with NO line breaks, NO newlines, NO paragraph separations. The Confirm, Converse, and Prompt parts must flow together in one continuous block of text.

DATA RULES:
- Answer from the dashboard data above when it covers the question. Do NOT invent data.
- Only use general knowledge for drill-down questions beyond what's shown.
- DEPARTMENT FILTER: When the user asks about a department, append <<FILTER_DEPT:DepartmentName>> at the end. Do NOT ask for confirmation.
- EMPLOYEE FILTER: When the user asks about a specific employee, append <<FILTER_EMP:FirstName>> at the end. Do NOT ask for confirmation.
- Only one filter tag per response.`;
  }, []);

  const sendToGemini = useCallback(async (text: string) => {
    if (processingRef.current) return;
    const normalizedText = text.trim().replace(/[.!?,;:]+$/g, '').trim().toLowerCase();
    const timeSinceLastSend = Date.now() - lastSendTimeRef.current;
    if (normalizedText === lastSentTextRef.current && timeSinceLastSend < 10000) return;
    processingRef.current = true;
    lastSentTextRef.current = normalizedText;
    lastSendTimeRef.current = Date.now();

    setVoiceState('processing');
    setAiResponse('');

    onChatMessage({ role: 'user', text });

    const voiceMatch = matchAllVoiceQueries(text);
    if (voiceMatch) {
      const responseText = voiceMatch.response;
      setAiResponse(responseText);
      onChatMessage({ role: 'model', text: responseText });

      if (voiceMatch.filterTarget) {
        const ft = voiceMatch.filterTarget as any;
        if (ft.department) onFilterDepartment?.(ft.department);
        if (ft.employeeId) {
          const allEmployees = [...dwoData.employees, ...frontendData.employees];
          const emp = allEmployees.find(e => e.id === ft.employeeId);
          if (emp) onFilterEmployee?.(emp.name.split(' ')[0]);
        }
      }

      if ((voiceMatch as any).action) {
        const action = (voiceMatch as any).action as string;
        if (action.startsWith("acknowledge:")) {
          const empName = action.split(":")[1];
          onAcknowledgeCard?.(empName);
        }
      }

      const wantTts = !isMutedRef.current;
      if (wantTts) {
        speakText(responseText).finally(() => {
          processingRef.current = false;
        });
      } else {
        setVoiceState('idle');
        processingRef.current = false;
        micOffRef.current = true;
      }
      return;
    }

    try {
      abortRef.current = new AbortController();

      const wantTts = !isMutedRef.current;
      const allMsgs = [...chatMessages, { role: 'user' as const, text }];
      const messages = allMsgs.map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          systemInstruction: getPageContext(),
          withTts: wantTts,
        }),
        signal: abortRef.current.signal,
      });
      const data = await res.json();
      const rawText = data.text || 'Sorry, I could not generate a response.';
      const { cleanText: responseText, department: filterDept, employee: filterEmp } = parseFilterAction(rawText);
      setAiResponse(responseText);
      onChatMessage({ role: 'model', text: responseText });

      if (filterDept) onFilterDepartment?.(filterDept);
      else if (filterEmp) onFilterEmployee?.(filterEmp);

      if (wantTts && data.audio && !micOffRef.current) {
        stopAudio();
        setVoiceState('speaking');
        const wav = pcmToWavBlob(data.audio);
        const url = URL.createObjectURL(wav);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          URL.revokeObjectURL(url);
          audioRef.current = null;
          setVoiceState('idle');
          processingRef.current = false;
          micOffRef.current = true;
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          audioRef.current = null;
          setVoiceState('idle');
          processingRef.current = false;
          micOffRef.current = true;
        };
        await audio.play();
      } else if (wantTts && !data.audio) {
        processingRef.current = false;
        speakText(responseText);
      } else {
        setVoiceState('idle');
        processingRef.current = false;
        micOffRef.current = true;
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setAiResponse('Sorry, there was an error processing your request.');
        setVoiceState('idle');
      }
      processingRef.current = false;
    }
  }, [speakText, getPageContext, chatMessages, onChatMessage, stopAudio, onFilterDepartment, onFilterEmployee, onAcknowledgeCard]);

  const startListening = useCallback(async () => {
    if (!hasPermissionRef.current) return;
    if (processingRef.current) return;
    if (isListeningRef.current) return;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') return;
    isListeningRef.current = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      let speechDetected = false;
      let detectionAvailable = false;
      let detectionCancelled = false;
      try {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const dataArr = new Uint8Array(analyser.frequencyBinCount);
        detectionAvailable = true;
        const checkLevel = () => {
          if (detectionCancelled || !mediaStreamRef.current) { audioCtx.close(); return; }
          analyser.getByteFrequencyData(dataArr);
          let sum = 0;
          for (let i = 0; i < dataArr.length; i++) sum += dataArr[i];
          const avg = sum / dataArr.length;
          if (avg > 25) speechDetected = true;
          if (!detectionCancelled && mediaStreamRef.current) requestAnimationFrame(checkLevel);
          else audioCtx.close();
        };
        requestAnimationFrame(checkLevel);
      } catch (_) {
        detectionAvailable = false;
      }

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        detectionCancelled = true;
        stream.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
        isListeningRef.current = false;
        if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }

        if (chunks.length === 0 || micOffRef.current) {
          setVoiceState('idle');
          return;
        }

        if (detectionAvailable && !speechDetected) {
          micOffRef.current = true;
          setVoiceState('idle');
          return;
        }

        const blob = new Blob(chunks, { type: mimeType });
        if (blob.size < 100) {
          micOffRef.current = true;
          setVoiceState('idle');
          return;
        }

        setTranscript('Transcribing...');
        setVoiceState('processing');

        try {
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          const res = await fetch('/api/gemini/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64, mimeType: mimeType.split(';')[0] }),
          });
          if (!res.ok) throw new Error('Transcription failed');
          const data = await res.json();
          const text = data.text?.trim() || '';

          if (micOffRef.current) { setVoiceState('idle'); return; }

          const lastModel = [...chatMessages].reverse().find(m => m.role === 'model');
          if (text && !isGarbageTranscription(text, lastModel?.text)) {
            setTranscript(text);
            setIsMuted(false);
            sendToGemini(text);
          } else {
            setTranscript('');
            setVoiceState('idle');
            micOffRef.current = true;
          }
        } catch {
          setTranscript('');
          setAiResponse('Failed to transcribe audio. Please try again.');
          setVoiceState('idle');
        }
      };

      recorder.start(250);
      setVoiceState('listening');

      silenceTimerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      }, 5000);

    } catch (err: any) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
      hasPermissionRef.current = false;
      setAiResponse('Microphone access was denied. Please allow microphone permissions and try again.');
      setVoiceState('idle');
    }
  }, [sendToGemini, stopAudio]);

  useEffect(() => { startListeningRef.current = startListening; }, [startListening]);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (_) {}
    }
  }, []);

  const hasPermissionRef = useRef(!!micPermissionGranted);

  useEffect(() => {
    if (micPermissionGranted) {
      hasPermissionRef.current = true;
      micOffRef.current = true;
      setTranscript('');
      setAiResponse('');
    }
  }, [micPermissionGranted]);

  const requestMicPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      hasPermissionRef.current = true;
      return true;
    } catch {
      setAiResponse('Microphone access was denied. Please allow microphone permissions and try again.');
      setVoiceState('idle');
      return false;
    }
  }, []);

  const handleMicClick = useCallback(async () => {
    if (voiceState === 'listening') {
      micOffRef.current = true;
      stopListening();
      setVoiceState('idle');
    } else if (voiceState === 'idle') {
      micOffRef.current = false;
      setTranscript('');
      setAiResponse('');
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (!hasPermissionRef.current) {
        const granted = await requestMicPermission();
        if (!granted) return;
      }
      startListening();
    } else if (voiceState === 'speaking') {
      micOffRef.current = false;
      stopAudio();
      setTranscript('');
      setAiResponse('');
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      if (!hasPermissionRef.current) {
        const granted = await requestMicPermission();
        if (!granted) return;
      }
      startListening();
    }
  }, [voiceState, startListening, stopListening, stopAudio, requestMicPermission]);

  const handleHotTopicClick = useCallback(async (topic: string) => {
    setShowHotTopics(false);
    micOffRef.current = false;
    setIsMuted(false);
    stopListening();
    stopAudio();
    setTranscript(topic);
    setAiResponse('');
    const cat = TOPIC_CATEGORY_MAP[topic];
    if (cat) onFilterCategory?.(cat);
    sendToGemini(topic);
  }, [stopListening, stopAudio, sendToGemini, onFilterCategory]);

  const handleEnd = useCallback(() => {
    micOffRef.current = true;
    stopListening();
    stopAudio();
    if (abortRef.current) abortRef.current.abort();
    setTranscript('');
    setAiResponse('');
    setVoiceState('collapsed');
  }, [stopListening, stopAudio]);

  if (voiceState === 'collapsed') {
    return (
      <button className="voice-collapsed-btn" onClick={async () => { micOffRef.current = false; setTranscript(''); setAiResponse(''); setVoiceState('idle'); if (!hasPermissionRef.current) { const ok = await requestMicPermission(); if (!ok) return; } setTimeout(() => startListening(), 50); }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M10 12.5C10.8841 12.5 11.7319 12.1488 12.357 11.5237C12.9821 10.8986 13.3333 10.0507 13.3333 9.16667V4.16667C13.3333 3.28261 12.9821 2.43477 12.357 1.80964C11.7319 1.18452 10.8841 0.833333 10 0.833333C9.11594 0.833333 8.2681 1.18452 7.64298 1.80964C7.01786 2.43477 6.66667 3.28261 6.66667 4.16667V9.16667C6.66667 10.0507 7.01786 10.8986 7.64298 11.5237C8.2681 12.1488 9.11594 12.5 10 12.5ZM16.6667 9.16667C16.6667 8.94565 16.5789 8.73369 16.4226 8.57741C16.2663 8.42113 16.0543 8.33333 15.8333 8.33333C15.6123 8.33333 15.4004 8.42113 15.2441 8.57741C15.0878 8.73369 15 8.94565 15 9.16667C15 10.4927 14.4732 11.7645 13.5355 12.7022C12.5979 13.6399 11.3261 14.1667 10 14.1667C8.67392 14.1667 7.40215 13.6399 6.46447 12.7022C5.52678 11.7645 5 10.4927 5 9.16667C5 8.94565 4.9122 8.73369 4.75592 8.57741C4.59964 8.42113 4.38768 8.33333 4.16667 8.33333C3.94565 8.33333 3.73369 8.42113 3.57741 8.57741C3.42113 8.73369 3.33333 8.94565 3.33333 9.16667C3.3348 10.7894 3.9281 12.3559 5.002 13.5725C6.07589 14.789 7.55665 15.5722 9.16667 15.775V17.5H7.5C7.27899 17.5 7.06702 17.5878 6.91074 17.7441C6.75446 17.9004 6.66667 18.1123 6.66667 18.3333C6.66667 18.5543 6.75446 18.7663 6.91074 18.9226C7.06702 19.0789 7.27899 19.1667 7.5 19.1667H12.5C12.721 19.1667 12.933 19.0789 13.0893 18.9226C13.2455 18.7663 13.3333 18.5543 13.3333 18.3333C13.3333 18.1123 13.2455 17.9004 13.0893 17.7441C12.933 17.5878 12.721 17.5 12.5 17.5H10.8333V15.775C12.4433 15.5722 13.9241 14.789 14.998 13.5725C16.0719 12.3559 16.6652 10.7894 16.6667 9.16667Z" fill="white" />
        </svg>
        <span>Voice</span>
      </button>
    );
  }

  return (
    <div ref={snippetRef} className={`voice-snippet ${voiceState === 'listening' ? 'voice-snippet--listening' : ''} ${voiceState === 'speaking' ? 'voice-snippet--speaking' : ''}`}>
      {showHotTopics && (
        <div className="hot-topics-list">
          <button className="hot-topic-close" onClick={() => setShowHotTopics(false)} aria-label="Close">&times;</button>
          {[
            'What needs my attention right now?',
            'What are the most critical issues?',
            'What should I fix first?',
            'Do we have coverage gaps right now?',
          ].map((topic) => (
            <button key={topic} className="hot-topic-item" onClick={() => handleHotTopicClick(topic)}>{topic}</button>
          ))}
        </div>
      )}
      {(transcript || aiResponse) && !showHotTopics && (
        <div className="voice-transcript-bubble">
          {voiceState === 'processing' ? (
            <button
              className="voice-sound-toggle voice-stop-toggle"
              onClick={() => {
                if (abortRef.current) abortRef.current.abort();
                stopAudio();
                processingRef.current = false;
                setVoiceState('idle');
                setAiResponse('Processing stopped');
                onChatMessage({ role: 'model', text: 'Processing stopped' });
              }}
              title="Stop processing"
            >
              <div className="voice-stop-square-sm" />
            </button>
          ) : (
            <button
              className="voice-sound-toggle"
              onClick={() => {
                stopAudio();
                setIsMuted(true);
              }}
              title="Stop audio"
            >
              {isMuted ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" fill="rgba(0,0,0,.55)"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-3.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z" fill="rgba(0,0,0,.55)"/></svg>
              )}
            </button>
          )}
          {transcript && <div className="voice-transcript-user">{transcript}</div>}
          {voiceState === 'processing' && <div className="voice-transcript-thinking">Thinking...</div>}
          {aiResponse && <div className="voice-transcript-ai">{aiResponse}</div>}
        </div>
      )}
      <button
        className={`voice-snippet-btn ${voiceState === 'listening' ? 'voice-snippet-btn--active' : ''}`}
        title={voiceState === 'listening' ? 'Stop listening' : 'Start voice input'}
        onClick={handleMicClick}
      >
        {voiceState === 'listening' ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12.5C10.8841 12.5 11.7319 12.1488 12.357 11.5237C12.9821 10.8986 13.3333 10.0507 13.3333 9.16667V4.16667C13.3333 3.28261 12.9821 2.43477 12.357 1.80964C11.7319 1.18452 10.8841 0.833333 10 0.833333C9.11594 0.833333 8.2681 1.18452 7.64298 1.80964C7.01786 2.43477 6.66667 3.28261 6.66667 4.16667V9.16667C6.66667 10.0507 7.01786 10.8986 7.64298 11.5237C8.2681 12.1488 9.11594 12.5 10 12.5ZM16.6667 9.16667C16.6667 8.94565 16.5789 8.73369 16.4226 8.57741C16.2663 8.42113 16.0543 8.33333 15.8333 8.33333C15.6123 8.33333 15.4004 8.42113 15.2441 8.57741C15.0878 8.73369 15 8.94565 15 9.16667C15 10.4927 14.4732 11.7645 13.5355 12.7022C12.5979 13.6399 11.3261 14.1667 10 14.1667C8.67392 14.1667 7.40215 13.6399 6.46447 12.7022C5.52678 11.7645 5 10.4927 5 9.16667C5 8.94565 4.9122 8.73369 4.75592 8.57741C4.59964 8.42113 4.38768 8.33333 4.16667 8.33333C3.94565 8.33333 3.73369 8.42113 3.57741 8.57741C3.42113 8.73369 3.33333 8.94565 3.33333 9.16667C3.3348 10.7894 3.9281 12.3559 5.002 13.5725C6.07589 14.789 7.55665 15.5722 9.16667 15.775V17.5H7.5C7.27899 17.5 7.06702 17.5878 6.91074 17.7441C6.75446 17.9004 6.66667 18.1123 6.66667 18.3333C6.66667 18.5543 6.75446 18.7663 6.91074 18.9226C7.06702 19.0789 7.27899 19.1667 7.5 19.1667H12.5C12.721 19.1667 12.933 19.0789 13.0893 18.9226C13.2455 18.7663 13.3333 18.5543 13.3333 18.3333C13.3333 18.1123 13.2455 17.9004 13.0893 17.7441C12.933 17.5878 12.721 17.5 12.5 17.5H10.8333V15.775C12.4433 15.5722 13.9241 14.789 14.998 13.5725C16.0719 12.3559 16.6652 10.7894 16.6667 9.16667Z" fill="black" fillOpacity="0.65" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 11V6C16 3.79 14.21 2 12 2C10.05 2 8.41 3.38 8.07 5.2L16 13.13V11Z" fill="black" fillOpacity="0.65" />
            <path d="M8 9.17V11C8 13.21 9.79 15 12 15C12.3 15 12.59 14.97 12.87 14.9L11.18 13.21C10.47 12.89 8 11.59 8 9.17Z" fill="black" fillOpacity="0.65" />
            <path d="M4.27 3L3 4.27L8 9.27V11C8 13.21 9.79 15 12 15C12.83 15 13.59 14.72 14.21 14.27L18.73 18.79L20 17.52L4.27 3Z" fill="black" fillOpacity="0.65" />
            <path d="M19 11H17C17 11.94 16.73 12.82 16.28 13.57L17.73 15.02C18.53 13.9 19 12.5 19 11Z" fill="black" fillOpacity="0.65" />
            <path d="M12 17C8.69 17 6 14.31 6 11H4C4 15.08 7.05 18.44 11 18.93V22H13V18.93C14.21 18.79 15.34 18.37 16.32 17.73L14.82 16.23C13.97 16.72 12.99 17 12 17Z" fill="black" fillOpacity="0.65" />
          </svg>
        )}
      </button>
      <button
        className={`voice-snippet-btn ${showHotTopics ? 'voice-snippet-btn--active' : ''}`}
        title="Hot topics"
        onClick={() => setShowHotTopics(prev => !prev)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 0.67s0.74 2.65 0.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l0.03-0.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-0.36 3.6-1.21 4.62-2.58 0.39 1.29 0.59 2.65 0.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" fill={showHotTopics ? '#13352C' : 'rgba(0,0,0,0.65)'} />
        </svg>
      </button>
      <button className="voice-snippet-btn" title="Expand" onClick={onExpand}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M2.5 0C1.1686 0 0.0802825 1.04077 0.00424385 2.35311L0 2.5V5C0 5.46024 0.373096 5.83333 0.833333 5.83333C1.2607 5.83333 1.61292 5.51163 1.66106 5.09718L1.66667 5V2.845L4.41074 5.58926C4.73618 5.91469 5.26382 5.91469 5.58926 5.58926C5.88966 5.28885 5.91277 4.81616 5.65858 4.48925L5.58926 4.41074L2.84667 1.66667H5C5.46024 1.66667 5.83333 1.29357 5.83333 0.833333C5.83333 0.40597 5.51163 0.053744 5.09718 0.00560641L5 0H2.5ZM12.5 15C13.8314 15 14.9197 13.9592 14.9958 12.6469L15 12.5V10C15 9.53976 14.6269 9.16667 14.1667 9.16667C13.7393 9.16667 13.3871 9.48837 13.3389 9.90282L13.3333 10V12.155L10.5893 9.41074C10.2638 9.08531 9.73618 9.08531 9.41074 9.41074C9.11034 9.71115 9.08723 10.1838 9.34142 10.5107L9.41074 10.5893L12.1533 13.3333H10C9.53976 13.3333 9.16667 13.7064 9.16667 14.1667C9.16667 14.594 9.48837 14.9463 9.90282 14.9944L10 15H12.5ZM12.5 0C13.8314 0 14.9197 1.04077 14.9958 2.35311L15 2.5V5C15 5.46024 14.6269 5.83333 14.1667 5.83333C13.7393 5.83333 13.3871 5.51163 13.3389 5.09718L13.3333 5V2.845L10.5893 5.58926C10.2638 5.91469 9.73618 5.91469 9.41074 5.58926C9.11034 5.28885 9.08723 4.81616 9.34142 4.48925L9.41074 4.41074L12.1533 1.66667H10C9.53976 1.66667 9.16667 1.29357 9.16667 0.833333C9.16667 0.40597 9.48837 0.053744 9.90282 0.00560641L10 0H12.5ZM2.5 15C1.1686 15 0.0802825 13.9592 0.00424385 12.6469L0 12.5V10C0 9.53976 0.373096 9.16667 0.833333 9.16667C1.2607 9.16667 1.61292 9.48837 1.66106 9.90282L1.66667 10V12.155L4.41074 9.41074C4.73618 9.08531 5.26382 9.08531 5.58926 9.41074C5.88966 9.71115 5.91277 10.1838 5.65858 10.5107L5.58926 10.5893L2.84667 13.3333H5C5.46024 13.3333 5.83333 13.7064 5.83333 14.1667C5.83333 14.594 5.51163 14.9463 5.09718 14.9944L5 15H2.5Z" fill="black" fillOpacity="0.65" />
        </svg>
      </button>
      <button className="voice-snippet-end-btn" onClick={handleEnd}>
        <div className="voice-bars">
          <span className="voice-bar" style={{ height: 6, position: 'absolute', left: 5.6, top: 13 }} />
          <span className="voice-bar" style={{ height: 10, position: 'absolute', left: 11.4, top: 11 }} />
          <span className="voice-bar" style={{ height: 4, position: 'absolute', left: 17.2, top: 14 }} />
          <span className="voice-bar" style={{ height: 6, position: 'absolute', left: 23, top: 13 }} />
        </div>
        <span className="voice-end-label">End</span>
      </button>
    </div>
  );
}

function Shortcuts() {
  return (
    <div className="shortcuts">
      <button className="shortcut-btn">
        <div className="shortcut-icon-wrap">
          <div className="shortcut-icon-box">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.8805 23.1853C28.567 24.1967 29.5992 26.0186 29.6002 27.9851V28.7849H18.401V27.9851C18.402 26.0186 19.4342 24.1967 21.1207 23.1853C21.4733 24.4856 22.6534 25.3884 24.0006 25.3884C25.3479 25.3884 26.5279 24.4856 26.8805 23.1853ZM24.0006 22.3855C24.5977 22.3853 25.1912 22.4766 25.7604 22.657C25.7574 22.6861 25.7574 22.7158 25.7604 22.7449C25.59 23.5838 24.8527 24.1872 23.9967 24.1873C23.1407 24.1873 22.4034 23.5838 22.233 22.7449C22.2328 22.7214 22.2097 22.6833 22.2086 22.6814C22.7856 22.4847 23.3911 22.3848 24.0006 22.3855ZM8.80042 19.9851C9.24211 19.9851 9.60001 20.3433 9.60022 20.7849C9.60022 21.2267 9.24224 21.5857 8.80042 21.5857H7.20081C6.75898 21.5857 6.401 21.2267 6.401 20.7849C6.40121 20.3433 6.75911 19.9851 7.20081 19.9851H8.80042ZM17.6002 16.7849C18.042 16.7849 18.401 17.1439 18.401 17.5857C18.4008 18.0273 18.0419 18.3855 17.6002 18.3855H16.0006C15.5589 18.3855 15.201 18.0273 15.2008 17.5857C15.2008 17.1439 15.5588 16.7849 16.0006 16.7849H17.6002ZM8.80042 13.5857C9.24224 13.5857 9.60022 13.9437 9.60022 14.3855C9.60011 14.8272 9.24218 15.1853 8.80042 15.1853H7.20081C6.75904 15.1853 6.40111 14.8272 6.401 14.3855C6.401 13.9437 6.75898 13.5857 7.20081 13.5857H8.80042ZM23.2008 11.1853H4.00061V7.1853H23.2008V11.1853Z" fill="#3AD6C5" />
              <path fillRule="evenodd" clipRule="evenodd" d="M19.2009 3.18579C19.6426 3.18598 20.0007 3.54388 20.0007 3.9856V5.58521H22.4001C23.7256 5.58521 24.8005 6.66011 24.8005 7.9856V11.9856C24.8004 12.4273 24.4424 12.7853 24.0007 12.7854C23.559 12.7854 23.2011 12.4273 23.2009 11.9856V7.9856C23.2009 7.54377 22.842 7.18579 22.4001 7.18579H20.0007V8.7854C20.0007 9.22709 19.6426 9.58502 19.2009 9.58521C18.7591 9.58521 18.4002 9.2272 18.4001 8.7854V7.18579H8.80054V8.7854C8.80051 9.22715 8.44247 9.58513 8.00073 9.58521C7.55892 9.58521 7.20096 9.2272 7.20093 8.7854V7.18579H4.80054C4.35873 7.18582 4.00073 7.54378 4.00073 7.9856V22.3855C4.00073 22.5058 4.04866 22.6211 4.1337 22.7065C4.21874 22.7919 4.33396 22.8404 4.45426 22.841L4.80054 22.8411V28.7849C4.80054 29.2266 4.44256 29.5855 4.00073 29.5857C3.20041 29.5855 2.41024 29.2673 1.82974 28.6869C1.34959 28.2064 1.05757 27.575 1.00644 26.9063L1.00052 26.7269V7.9856C1.00052 5.88498 2.59363 4.14893 4.6339 3.90919L4.80054 3.89282V3.9856C4.80054 3.54384 5.15838 3.18598 5.60014 3.18579C6.04191 3.18579 6.40034 3.54372 6.40034 3.9856V5.58521H18.4001V3.9856C18.4001 3.54384 18.7591 3.18579 19.2009 3.18579ZM2.60032 22.3855V26.3855C2.60032 27.2688 3.30729 27.9855 4.20093 27.9855V22.841C3.30729 22.841 2.60032 22.8337 2.60032 22.3855Z" fill="#13352C" />
            </svg>
          </div>
        </div>
        <span className="shortcut-label">Employee details</span>
      </button>
    </div>
  );
}

function Tagline() {
  return (
    <div className="tagline">
      <p>
        <strong>Today's operations</strong> show a mix of normal activity and areas that require manager attention.<br />
        Compliance has a few deviations, staffing may need minor adjustments, and attendance shows small schedule shifts. A deeper look is recommended.
      </p>
    </div>
  );
}

function MetricsCard() {
  return (
    <div className="metrics-wrap">
      <div className="metrics-card">
        <div className="metric-col">
          <div className="metric-label">Hours (today)</div>
          <div className="metric-values">
            <span className="metric-val"><span className="metric-num">320</span><span className="metric-unit">scheduled</span></span>
            <div className="metric-vdiv"></div>
            <span className="metric-val"><span className="metric-num">265</span><span className="metric-unit">worked</span></span>
          </div>
        </div>
        <div className="metrics-hdiv"></div>
        <div className="metric-col">
          <div className="metric-label">Labor cost (today)</div>
          <div className="metric-values">
            <span className="metric-val"><span className="metric-num">$12,180</span><span className="metric-unit">budget</span></span>
            <div className="metric-vdiv"></div>
            <span className="metric-val"><span className="metric-num">$11,145</span><span className="metric-unit">spent</span></span>
          </div>
        </div>
        <div className="metrics-hdiv"></div>
        <div className="metric-col">
          <div className="metric-label">Coverage (1pm – 2pm)</div>
          <div className="metric-values">
            <span className="metric-val"><span className="metric-num">64</span><span className="metric-unit">scheduled</span></span>
            <div className="metric-vdiv"></div>
            <span className="metric-val"><span className="metric-num">70</span><span className="metric-unit">live</span></span>
          </div>
        </div>
        <div className="metrics-hdiv"></div>
        <div className="metric-col">
          <div className="metric-label">Open shifts (1pm – 2pm)</div>
          <div className="metric-values">
            <span className="metric-val"><span className="metric-num">5</span><span className="metric-unit">shifts</span></span>
            <div className="metric-vdiv"></div>
            <span className="metric-val"><span className="metric-num">15</span><span className="metric-unit">hours</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BryteStar() {
  return (
    <svg className="bryte-star" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M13.23 3.81494C13.526 3.81514 13.7909 3.99733 13.8979 4.27197L16.1411 9.76123C16.2197 9.95337 16.3728 10.1054 16.5649 10.1841L22.0542 12.4282C22.3286 12.5353 22.5109 12.7994 22.5112 13.0952L22.5024 13.2046C22.464 13.4551 22.2945 13.6693 22.0542 13.7632L16.5649 16.0063C16.3728 16.0849 16.2198 16.2381 16.1411 16.4302L13.8979 21.9194C13.7909 22.1941 13.5261 22.3763 13.23 22.3765L13.1206 22.3677C12.9061 22.3345 12.7181 22.2057 12.6099 22.0181L12.563 21.9194L10.3188 16.4302C10.25 16.262 10.1244 16.124 9.96533 16.0396L9.896 16.0063L4.40674 13.7632C4.13189 13.6561 3.94971 13.3915 3.94971 13.0952C3.95 12.7992 4.13211 12.5352 4.40674 12.4282L9.896 10.1841C10.064 10.1151 10.2023 9.98963 10.2866 9.83057L10.3188 9.76123L12.563 4.27197C12.6701 3.99749 12.934 3.81511 13.23 3.81494ZM11.8374 10.3813C11.5922 10.9812 11.1159 11.4573 10.5161 11.7026L7.10889 13.0952L10.5161 14.4878C11.0408 14.7024 11.4712 15.0942 11.7349 15.5903L11.8374 15.8101L13.23 19.2163L14.6226 15.8101L14.7251 15.5903C14.9888 15.0941 15.42 14.7023 15.9448 14.4878L19.3511 13.0952L15.9448 11.7026C15.3448 11.4574 14.8678 10.9814 14.6226 10.3813L13.23 6.97412L11.8374 10.3813ZM4.76611 1.62354C4.94634 1.62368 5.09565 1.73332 5.15967 1.89014L5.86084 3.59229C5.90124 3.69009 5.97973 3.76794 6.07764 3.80811L7.78271 4.50635L7.83936 4.53467C7.9655 4.60869 8.05029 4.74305 8.05029 4.90088C8.05003 5.05853 7.96549 5.19322 7.83936 5.26709L7.78271 5.29443L6.07764 5.99268C5.97967 6.03308 5.90101 6.11138 5.86084 6.20947L5.16357 7.91455C5.09939 8.07119 4.94924 8.18115 4.76904 8.18115C4.58884 8.18093 4.43848 8.07041 4.37451 7.91357L3.67725 6.20947C3.63699 6.11116 3.55873 6.033 3.46045 5.99268L1.78271 5.30518C1.77377 5.30307 1.76402 5.30186 1.75537 5.29834C1.5986 5.23431 1.48892 5.08401 1.48877 4.90381C1.48881 4.72356 1.59862 4.57339 1.75537 4.50928L3.45654 3.81201C3.55464 3.77177 3.63301 3.69325 3.67334 3.59521L4.37158 1.89014L4.3999 1.8335C4.47387 1.70754 4.61269 1.62354 4.76611 1.62354Z" fill="url(#bryte-star-grad)" />
      <defs>
        <linearGradient id="bryte-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C730AF" />
          <stop offset="76%" stopColor="#5B1987" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface InsightCardProps {
  title: string;
  badgeType: "blue" | "yellow";
  badgeLabel: string;
  department: string;
  time: string;
  description: string;
  personImg: string;
  personLabel: string;
  showAccept?: boolean;
  showDismiss?: boolean;
  showSnooze?: boolean;
  onAccept?: () => void;
  onDismiss?: () => void;
}

function InsightCard({ title, badgeType, badgeLabel, department, time, description, personImg, personLabel, showAccept = true, showDismiss = false, showSnooze = false, onAccept, onDismiss }: InsightCardProps) {
  return (
    <div className="icard">
      <div className="icard-top">
        <div>
          <h3 className="icard-title">{title}</h3>
          <div className="icard-meta" style={{ marginTop: 8 }}>
            <span className={`badge ${badgeType === "blue" ? "badge-blue" : "badge-yellow"}`}>{badgeLabel}</span>
            <span className="badge badge-gray">{department}</span>
            <span className="icard-time">{time}</span>
          </div>
        </div>
        <p className="icard-desc">{description}</p>
        <div className="icard-person">
          <div className="avatar"><img src={personImg} alt="" /></div>
          <span className="person-name">{personLabel}</span>
        </div>
      </div>
      <div className="icard-footer">
        <div className="icard-actions">
          {showAccept && (
            <button className="btn-action btn-ack" onClick={onAccept}>
              <CheckIcon />
              {showDismiss ? "Accept" : "Acknowledge"}
            </button>
          )}
          {showDismiss && (
            <button className="btn-action btn-dismiss" onClick={onDismiss}>
              <XIcon />
              Dismiss
            </button>
          )}
        </div>
        <div className="icard-icons">
          {showSnooze && (
            <button className="icon-btn" title="Snooze"><SnoozeIcon /></button>
          )}
          <button className="icon-btn" title="Feedback"><FeedbackIcon /></button>
        </div>
      </div>
    </div>
  );
}

const COMPLIANCE_INSIGHTS = [
  {
    id: "mb-001",
    category: "Meal break",
    department: "Frontend",
    title: "Late for meal break",
    time: "11:05 am",
    expiresAt: "11:08 am",
    description: "Eliza Thompson is 15m late for their meal break, send them now",
    employee: { name: "Eliza", shift: "Saturday 7a–3p Frontend / Bagger", avatarUrl: "https://i.pravatar.cc/40?img=47" },
    actions: ["acknowledge"] as string[],
    showSnooze: true,
  },
  {
    id: "mb-002",
    category: "Meal break",
    department: "Frontend",
    title: "Scheduled break is no longer compliant",
    time: "11:05 am",
    expiresAt: "11:22 am",
    description: "Tom Jones had started their shift 5 minutes earlier than scheduled. Their scheduled break is no longer compliant and it needs to be adjusted",
    employee: { name: "Tom", shift: "Saturday 7a–3p Frontend / Bagger", avatarUrl: "https://i.pravatar.cc/40?img=12" },
    actions: ["accept", "dismiss"] as string[],
    showSnooze: false,
  },
  {
    id: "mb-003",
    category: "Meal break",
    department: "Bakery",
    title: "Employee missed meal break window",
    time: "11:05 am",
    expiresAt: "11:35 am",
    description: "Maria Garcia has passed their required meal break window without clocking out for a break. A waiver or immediate break is required to stay compliant.",
    employee: { name: "Maria", shift: "Saturday 8a–4p Bakery / Baker", avatarUrl: "https://i.pravatar.cc/40?img=5" },
    actions: ["accept", "dismiss"] as string[],
    showSnooze: false,
  },
  {
    id: "mn-001",
    category: "Minor",
    department: "Frontend",
    title: "Minor working beyond legal hours",
    time: "11:05 am",
    expiresAt: "11:28 am",
    description: "Sam Adams (minor) is currently working past permitted hours. Send them home to remain compliant.",
    employee: { name: "Sam", shift: "Saturday 7a–3p Frontend / Bagger", avatarUrl: "https://i.pravatar.cc/40?img=33" },
    actions: ["acknowledge"] as string[],
    showSnooze: false,
  },
  {
    id: "mn-002",
    category: "Minor",
    department: "Produce",
    title: "Minor approaching daily hour limit",
    time: "11:05 am",
    expiresAt: "11:45 am",
    description: "Jake Wilson (minor) has worked 7.5 of their 8-hour daily maximum. Schedule a break or end their shift within the next 30 minutes to avoid a violation.",
    employee: { name: "Jake", shift: "Saturday 7a–3p Produce / Stocker", avatarUrl: "https://i.pravatar.cc/40?img=15" },
    actions: ["acknowledge"] as string[],
    showSnooze: true,
  },
  {
    id: "mn-003",
    category: "Minor",
    department: "Deli",
    title: "Minor scheduled during restricted hours",
    time: "11:05 am",
    expiresAt: "12:05 pm",
    description: "Emma Chen (minor) is scheduled past 9:00 PM on a school night, which exceeds permitted hours for minors under 16. Adjust the schedule or obtain proper authorization.",
    employee: { name: "Emma", shift: "Saturday 3p–9p Deli / Associate", avatarUrl: "https://i.pravatar.cc/40?img=9" },
    actions: ["accept", "dismiss"] as string[],
    showSnooze: false,
  },
  {
    id: "mn-004",
    category: "Minor",
    department: "Cashier",
    title: "Minor exceeded weekly hour limit",
    time: "11:05 am",
    expiresAt: "11:50 am",
    description: "Lucas Martin (minor) has reached 18 hours this week — the maximum for school weeks. Any additional hours today will create a compliance violation.",
    employee: { name: "Lucas", shift: "Saturday 9a–1p Cashier / Cashier", avatarUrl: "https://i.pravatar.cc/40?img=52" },
    actions: ["accept", "dismiss"] as string[],
    showSnooze: false,
  },
];

const COMPLIANCE_CATEGORIES = ["All", "Meal break", "Minor", "Overtime"];

function AcknowledgeDialog({ insightId, onDone, onCancel }: { insightId: string; onDone: () => void; onCancel: () => void }) {
  const insight = COMPLIANCE_INSIGHTS.find(i => i.id === insightId);
  const name = insight?.employee?.name || "Employee";
  return (
    <div className="ack-dialog-overlay" onClick={onCancel}>
      <div className="ack-dialog" onClick={e => e.stopPropagation()}>
        <h3 className="ack-dialog-heading">Acknowledged</h3>
        <p className="ack-dialog-body">{name}'s meal break exception has been recorded.</p>
        <div className="ack-dialog-actions">
          <button className="ack-dialog-btn ack-dialog-cancel" onClick={onCancel}>Cancel</button>
          <button className="ack-dialog-btn ack-dialog-done" onClick={onDone}>Done</button>
        </div>
      </div>
    </div>
  );
}

function ComplianceSection({ departmentFilter, employeeFilter, categoryFilter, onClearFilter, dismissedIds, ackDialogId, onAcknowledge, onAckDone, onAckCancel, onDismissCard }: {
  departmentFilter?: string | null;
  employeeFilter?: string | null;
  categoryFilter?: string | null;
  onClearFilter?: () => void;
  dismissedIds: string[];
  ackDialogId: string | null;
  onAcknowledge: (id: string) => void;
  onAckDone: () => void;
  onAckCancel: () => void;
  onDismissCard: (id: string) => void;
}) {
  const [selectedChip, setSelectedChip] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const activeInsights = COMPLIANCE_INSIGHTS.filter(i => !dismissedIds.includes(i.id));

  const isDeptMode = !!departmentFilter;
  const isEmpMode = !!employeeFilter;
  const isFilterMode = isDeptMode || isEmpMode;

  const filteredByActiveFilter = isDeptMode
    ? activeInsights.filter(i => i.department === departmentFilter)
    : isEmpMode
      ? activeInsights.filter(i => i.employee.name.toLowerCase() === employeeFilter!.toLowerCase())
      : activeInsights;

  const filterLabel = isDeptMode ? departmentFilter! : isEmpMode ? employeeFilter! : "";

  const categoryCounts = isFilterMode
    ? [
        { label: "All", count: activeInsights.length },
        { label: filterLabel, count: filteredByActiveFilter.length },
      ]
    : COMPLIANCE_CATEGORIES.map(cat => ({
        label: cat,
        count: cat === "All" ? activeInsights.length : activeInsights.filter(i => i.category === cat).length,
      }));

  const chipLabels = categoryCounts.map(c => c.label);

  const safeChip = selectedChip < chipLabels.length ? selectedChip : 0;
  const selectedLabel = chipLabels[safeChip];
  const filtered = isFilterMode
    ? (selectedLabel === "All" ? activeInsights : filteredByActiveFilter)
    : (selectedLabel === "All" ? activeInsights : activeInsights.filter(i => i.category === selectedLabel));
  const displayed = showAll ? filtered : filtered.slice(0, 3);

  useEffect(() => {
    if (isFilterMode) {
      setSelectedChip(1);
      setShowAll(false);
    } else if (categoryFilter) {
      const idx = COMPLIANCE_CATEGORIES.findIndex(c => c.toLowerCase() === categoryFilter.toLowerCase());
      setSelectedChip(idx >= 0 ? idx : 0);
      setShowAll(false);
      setAccordionOpen(true);
    } else {
      setSelectedChip(0);
      setShowAll(false);
    }
  }, [departmentFilter, employeeFilter, isFilterMode, categoryFilter]);

  const handleAcceptAll = () => {
    if (filtered.length === 1) {
      onAcknowledge(filtered[0].id);
    } else {
      filtered.forEach(i => onDismissCard(i.id));
    }
  };

  return (
    <div className="section">
      <div className="section-head">
        <div className="section-title-row">
          <h2 className="section-title">Compliance</h2>
          <BryteStar />
        </div>
        <p className="section-sub">Compliance insights flag issues like late meals, overtime, and other scheduling concerns. When you take action, it's applied right away and the insight disappears from the list.</p>
      </div>

      <div className="panel">
        <div className="accordion-header">
          <span className="accordion-title">Insights</span>
          <button className={`accordion-chevron ${accordionOpen ? "open" : ""}`} onClick={() => setAccordionOpen(!accordionOpen)}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="5,13 10,8 15,13" /></svg>
          </button>
        </div>

        {accordionOpen && (
          <div>
            <div className="filter-row">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
                {categoryCounts.map((cat, i) => {
                  const isSelected = i === safeChip;
                  const isFilterChip = isFilterMode && i === 1;
                  return (
                    <button
                      key={cat.label}
                      className={`chip ${isSelected ? "chip-selected" : "chip-idle"}`}
                      onClick={() => { setSelectedChip(i); setShowAll(false); }}
                      style={isFilterChip ? { display: "inline-flex", alignItems: "center", gap: 6 } : undefined}
                    >
                      {cat.label} ({cat.count})
                      {isFilterChip && (
                        <span
                          className="chip-close"
                          onClick={(e) => { e.stopPropagation(); onClearFilter?.(); }}
                          style={{ display: "inline-flex", alignItems: "center", marginLeft: 2, cursor: "pointer", borderRadius: "50%", padding: 2 }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="3" y1="3" x2="9" y2="9" /><line x1="9" y1="3" x2="3" y2="9" />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <button className="sort-btn">
                Sort by <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="4,6 8,10 12,6" /></svg>
              </button>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "#888", fontSize: 14 }}>
                No insights in this category
              </div>
            ) : (
              <>
                <div className="card-row">
                  {displayed.map(insight => (
                    <InsightCard
                      key={insight.id}
                      title={insight.title}
                      badgeType={insight.category === "Meal break" ? "blue" : "yellow"}
                      badgeLabel={insight.category}
                      department={insight.department}
                      time={`${insight.time} – Expires at ${insight.expiresAt}`}
                      description={insight.description}
                      personImg={insight.employee.avatarUrl}
                      personLabel={`${insight.employee.name}: ${insight.employee.shift}`}
                      showAccept={insight.actions.includes("accept") || insight.actions.includes("acknowledge")}
                      showDismiss={insight.actions.includes("dismiss")}
                      showSnooze={insight.showSnooze}
                      onAccept={() => onAcknowledge(insight.id)}
                      onDismiss={() => onDismissCard(insight.id)}
                    />
                  ))}
                </div>

                <div className="bottom-row">
                  {filtered.length > 3 && (
                    <span className="show-more" onClick={() => setShowAll(!showAll)}>
                      {showAll ? "Show less" : `Show more (${filtered.length - 3})`}
                    </span>
                  )}
                  {filtered.length <= 3 && <span />}
                  <button className="btn-accept-all" onClick={handleAcceptAll}>
                    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="3,9 7,13 15,5" /></svg>
                    Accept all insights ({filtered.length})
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {ackDialogId && (
        <AcknowledgeDialog insightId={ackDialogId} onDone={onAckDone} onCancel={onAckCancel} />
      )}
    </div>
  );
}

interface StaffingInsightItemProps {
  text: string;
  checkDone?: boolean;
  xDone?: boolean;
}

function StaffingInsightItem({ text, checkDone = false, xDone = false }: StaffingInsightItemProps) {
  return (
    <div className="insight-item">
      <span className="insight-text">{text}</span>
      <div className="insight-item-actions">
        <button className={`circle-btn circle-check ${checkDone ? "done" : ""}`}>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="2,7 5.5,10.5 12,4" /></svg>
        </button>
        <button className={`circle-btn circle-x ${xDone ? "done" : ""}`}>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="3" x2="11" y2="11" /><line x1="11" y1="3" x2="3" y2="11" /></svg>
        </button>
        <button className="share-btn"><ShareIcon /></button>
      </div>
    </div>
  );
}

function StaffingSection() {
  return (
    <div className="section" style={{ marginBottom: 0 }}>
      <div className="section-head">
        <div className="section-title-row">
          <h2 className="section-title">Staffing intelligence</h2>
          <BryteStar />
        </div>
        <p className="section-sub">Staffing insights help you spot and fix coverage gaps. All actions are applied at once after you submit.</p>
      </div>

      <div className="staffing-panel" style={{ paddingBottom: 0 }}>
        <div className="info-bar">
          <span className="info-bar-time">Generated at 10:46am</span>
          <div className="info-bar-div"></div>
          <button className="btn-refresh">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.6498 6.34999C16.0198 4.71999 13.7098 3.77999 11.1698 4.03999C7.49978 4.40999 4.47978 7.38999 4.06978 11.06C3.51978 15.91 7.26978 20 11.9998 20C15.1898 20 17.9298 18.13 19.2098 15.44C19.5298 14.77 19.0498 14 18.3098 14C17.9398 14 17.5898 14.2 17.4298 14.53C16.2998 16.96 13.5898 18.5 10.6298 17.84C8.40978 17.35 6.61978 15.54 6.14978 13.32C5.30978 9.43999 8.25978 5.99999 11.9998 5.99999C13.6598 5.99999 15.1398 6.68999 16.2198 7.77999L14.7098 9.28999C14.0798 9.91999 14.5198 11 15.4098 11H18.9998C19.5498 11 19.9998 10.55 19.9998 9.99999V6.40999C19.9998 5.51999 18.9198 5.06999 18.2898 5.69999L17.6498 6.34999Z" fill="#0B1E19" /></svg>
            Refresh
          </button>
          <button className="btn-new">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13.23 3.81494C13.526 3.81514 13.7909 3.99733 13.8979 4.27197L16.1411 9.76123C16.2197 9.95337 16.3728 10.1054 16.5649 10.1841L22.0542 12.4282C22.3286 12.5353 22.5109 12.7994 22.5112 13.0952L22.5024 13.2046C22.464 13.4551 22.2945 13.6693 22.0542 13.7632L16.5649 16.0063C16.3728 16.0849 16.2198 16.2381 16.1411 16.4302L13.8979 21.9194C13.7909 22.1941 13.5261 22.3763 13.23 22.3765L13.1206 22.3677C12.9061 22.3345 12.7181 22.2057 12.6099 22.0181L12.563 21.9194L10.3188 16.4302C10.25 16.262 10.1244 16.124 9.96533 16.0396L9.896 16.0063L4.40674 13.7632C4.13189 13.6561 3.94971 13.3915 3.94971 13.0952C3.95 12.7992 4.13211 12.5352 4.40674 12.4282L9.896 10.1841C10.064 10.1151 10.2023 9.98963 10.2866 9.83057L10.3188 9.76123L12.563 4.27197C12.6701 3.99749 12.934 3.81511 13.23 3.81494ZM11.8374 10.3813C11.5922 10.9812 11.1159 11.4573 10.5161 11.7026L7.10889 13.0952L10.5161 14.4878C11.0408 14.7024 11.4712 15.0942 11.7349 15.5903L11.8374 15.8101L13.23 19.2163L14.6226 15.8101L14.7251 15.5903C14.9888 15.0941 15.42 14.7023 15.9448 14.4878L19.3511 13.0952L15.9448 11.7026C15.3448 11.4574 14.8678 10.9814 14.6226 10.3813L13.23 6.97412L11.8374 10.3813ZM4.76611 1.62354C4.94634 1.62368 5.09565 1.73332 5.15967 1.89014L5.86084 3.59229C5.90124 3.69009 5.97973 3.76794 6.07764 3.80811L7.78271 4.50635L7.83936 4.53467C7.9655 4.60869 8.05029 4.74305 8.05029 4.90088C8.05003 5.05853 7.96549 5.19322 7.83936 5.26709L7.78271 5.29443L6.07764 5.99268C5.97967 6.03308 5.90101 6.11138 5.86084 6.20947L5.16357 7.91455C5.09939 8.07119 4.94924 8.18115 4.76904 8.18115C4.58884 8.18093 4.43848 8.07041 4.37451 7.91357L3.67725 6.20947C3.63699 6.11116 3.55873 6.033 3.46045 5.99268L1.78271 5.30518C1.77377 5.30307 1.76402 5.30186 1.75537 5.29834C1.5986 5.23431 1.48892 5.08401 1.48877 4.90381C1.48881 4.72356 1.59862 4.57339 1.75537 4.50928L3.45654 3.81201C3.55464 3.77177 3.63301 3.69325 3.67334 3.59521L4.37158 1.89014L4.3999 1.8335C4.47387 1.70754 4.61269 1.62354 4.76611 1.62354Z" fill="url(#bryte-star-grad)" /></svg>
            Get new insights
          </button>
        </div>

        <div className="staffing-cols">
          <div className="staffing-left">
            <div className="scheduling-mobile-title">Scheduling issues</div>

            <div className="dept-group">
              <div className="dept-name">Front End</div>
              <div className="dept-job">Job name</div>
              <div className="issue-card issue-card-avatar">
                <div className="issue-avatar-row">
                  <div className="avatar"><img src="https://i.pravatar.cc/64?img=11" alt="" /></div>
                  <div className="issue-plus-badge">+3</div>
                </div>
                <span className="issue-label">4 employees called out sick</span>
              </div>
              <div className="issue-card issue-card-text">
                <span className="issue-label">Evening shift is understaffed by one team member</span>
              </div>
              <div className="dept-job">Job name</div>
              <div className="issue-card issue-card-avatar">
                <div className="issue-avatar-row">
                  <div className="avatar"><img src="https://i.pravatar.cc/64?img=5" alt="" /></div>
                  <div className="avatar"><img src="https://i.pravatar.cc/64?img=6" alt="" /></div>
                </div>
                <span className="issue-label">Jasmine Patel and Sam Ortiz shifts are too long without a break</span>
              </div>
            </div>

            <div className="dept-group">
              <div className="dept-name">Deli</div>
              <div className="dept-job">Job name</div>
              <div className="issue-card issue-card-avatar">
                <div className="issue-avatar-row">
                  <div className="avatar"><img src="https://i.pravatar.cc/64?img=9" alt="" /></div>
                </div>
                <span className="issue-label">Tom Davis is currently working outside of his scheduled working hours</span>
              </div>
              <div className="issue-card issue-card-text">
                <span className="issue-label">Evening shift is understaffed by one team member</span>
              </div>
              <div className="dept-job">Job name</div>
              <div className="issue-card issue-card-avatar">
                <div className="issue-avatar-row">
                  <div className="avatar"><img src="https://i.pravatar.cc/64?img=5" alt="" /></div>
                  <div className="avatar"><img src="https://i.pravatar.cc/64?img=6" alt="" /></div>
                </div>
                <span className="issue-label">Jasmine Patel and Sam Ortiz shifts are too long without a break</span>
              </div>
              <div className="issue-card issue-card-avatar">
                <div className="issue-avatar-row">
                  <div className="avatar"><img src="https://i.pravatar.cc/64?img=2" alt="" /></div>
                </div>
                <span className="issue-label">Ann Thompson is currently working outside of her scheduled working hours</span>
              </div>
            </div>

            <div className="dept-group">
              <div className="dept-name">Meat</div>
              <div className="dept-job">Job name</div>
              <div className="issue-card issue-card-text">
                <span className="issue-label">Evening shift is understaffed by one team member</span>
              </div>
              <div className="issue-card issue-card-avatar">
                <div className="issue-avatar-row">
                  <div className="avatar"><img src="https://i.pravatar.cc/64?img=2" alt="" /></div>
                </div>
                <span className="issue-label">Ann Thompson is currently working outside of her scheduled working hours</span>
              </div>
              <div className="dept-job">Job name</div>
              <div className="issue-card issue-card-text">
                <span className="issue-label">Evening shift is understaffed by one team member</span>
              </div>
            </div>

            <div className="dept-group">
              <div className="dept-name">Pharmacy</div>
              <div className="dept-job">Job name</div>
              <div className="issue-card issue-card-avatar">
                <div className="issue-avatar-row">
                  <div className="avatar"><img src="https://i.pravatar.cc/64?img=2" alt="" /></div>
                </div>
                <span className="issue-label">Ann Thompson is currently working outside of her scheduled working hours</span>
              </div>
              <div className="issue-card issue-card-text">
                <span className="issue-label">Evening shift is understaffed by one team member</span>
              </div>
              <div className="issue-card issue-card-text">
                <span className="issue-label">Evening shift is understaffed by one team member</span>
              </div>
            </div>
          </div>

          <div className="staffing-right">
            <div className="insights-header">
              <span className="insights-title">
                Insights
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13.23 3.81494C13.526 3.81514 13.7909 3.99733 13.8979 4.27197L16.1411 9.76123C16.2197 9.95337 16.3728 10.1054 16.5649 10.1841L22.0542 12.4282C22.3286 12.5353 22.5109 12.7994 22.5112 13.0952L22.5024 13.2046C22.464 13.4551 22.2945 13.6693 22.0542 13.7632L16.5649 16.0063C16.3728 16.0849 16.2198 16.2381 16.1411 16.4302L13.8979 21.9194C13.7909 22.1941 13.5261 22.3763 13.23 22.3765L13.1206 22.3677C12.9061 22.3345 12.7181 22.2057 12.6099 22.0181L12.563 21.9194L10.3188 16.4302C10.25 16.262 10.1244 16.124 9.96533 16.0396L9.896 16.0063L4.40674 13.7632C4.13189 13.6561 3.94971 13.3915 3.94971 13.0952C3.95 12.7992 4.13211 12.5352 4.40674 12.4282L9.896 10.1841C10.064 10.1151 10.2023 9.98963 10.2866 9.83057L10.3188 9.76123L12.563 4.27197C12.6701 3.99749 12.934 3.81511 13.23 3.81494ZM11.8374 10.3813C11.5922 10.9812 11.1159 11.4573 10.5161 11.7026L7.10889 13.0952L10.5161 14.4878C11.0408 14.7024 11.4712 15.0942 11.7349 15.5903L11.8374 15.8101L13.23 19.2163L14.6226 15.8101L14.7251 15.5903C14.9888 15.0941 15.42 14.7023 15.9448 14.4878L19.3511 13.0952L15.9448 11.7026C15.3448 11.4574 14.8678 10.9814 14.6226 10.3813L13.23 6.97412L11.8374 10.3813ZM4.76611 1.62354C4.94634 1.62368 5.09565 1.73332 5.15967 1.89014L5.86084 3.59229C5.90124 3.69009 5.97973 3.76794 6.07764 3.80811L7.78271 4.50635L7.83936 4.53467C7.9655 4.60869 8.05029 4.74305 8.05029 4.90088C8.05003 5.05853 7.96549 5.19322 7.83936 5.26709L7.78271 5.29443L6.07764 5.99268C5.97967 6.03308 5.90101 6.11138 5.86084 6.20947L5.16357 7.91455C5.09939 8.07119 4.94924 8.18115 4.76904 8.18115C4.58884 8.18093 4.43848 8.07041 4.37451 7.91357L3.67725 6.20947C3.63699 6.11116 3.55873 6.033 3.46045 5.99268L1.78271 5.30518C1.77377 5.30307 1.76402 5.30186 1.75537 5.29834C1.5986 5.23431 1.48892 5.08401 1.48877 4.90381C1.48881 4.72356 1.59862 4.57339 1.75537 4.50928L3.45654 3.81201C3.55464 3.77177 3.63301 3.69325 3.67334 3.59521L4.37158 1.89014L4.3999 1.8335C4.47387 1.70754 4.61269 1.62354 4.76611 1.62354Z" fill="url(#bryte-star-grad)" /></svg>
              </span>
              <button className="btn-accept">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="2,7 5.5,10.5 12,4" /></svg>
                Accept all
              </button>
              <button className="btn-dismiss-all">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="3" x2="11" y2="11" /><line x1="11" y1="3" x2="3" y2="11" /></svg>
                Dismiss all
              </button>
            </div>

            <div className="insight-list">
              <span className="insight-dept-chip">Frontend</span>
              <div className="dept-job">Job name</div>
              <StaffingInsightItem text="Shorten Jordan's Friday shift by 3 hours to prevent overtime" checkDone />
              <StaffingInsightItem text="Extend Sam Rivera's Friday shift by 2 hours to fill part of the uncovered workload" checkDone />
              <StaffingInsightItem text="Add a 1-hour extension to Ava Johnson's shift to cover remaining demand without triggering overtime" xDone />
              <StaffingInsightItem text="Move Alex Park from Front-End to Grocery for the last hour of the shift to maintain adequate skill coverage" checkDone />

              <span className="insight-dept-chip">Deli</span>
              <div className="dept-job">Job name</div>
              <StaffingInsightItem text="Shorten Jordan's Friday shift by 3 hours to prevent overtime" />
              <StaffingInsightItem text="Extend Sam Rivera's Friday shift by 2 hours to fill part of the uncovered workload" checkDone />

              <span className="insight-dept-chip">Meat</span>
              <div className="dept-job">Job name</div>
              <StaffingInsightItem text="Shorten Jordan's Friday shift by 3 hours to prevent overtime" />
              <StaffingInsightItem text="Extend Sam Rivera's Friday shift by 2 hours to fill part of the uncovered workload" />

              <span className="insight-dept-chip">Pharmacy</span>
              <div className="dept-job">Job name</div>
              <StaffingInsightItem text="Shorten Jordan's Friday shift by 3 hours to prevent overtime" xDone />
              <StaffingInsightItem text="Extend Sam Rivera's Friday shift by 2 hours to fill part of the uncovered workload" checkDone />
            </div>
          </div>
        </div>

        <div className="submit-row">
          <button className="btn-submit">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="3,9 7,13 15,5" /></svg>
            Submit (12)
          </button>
        </div>
      </div>
    </div>
  );
}

const AddButtonIcon = () => (
  <button className="bryte-footer-add-btn">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2" strokeLinecap="round">
      <line x1="10" y1="4" x2="10" y2="16" /><line x1="4" y1="10" x2="16" y2="10" />
    </svg>
  </button>
);

function BrytePanel({ chatMessages, onClose, onChatMessage, micPermissionGranted, onFilterDepartment, onFilterEmployee, onFilterCategory, onAcknowledgeCard }: {
  chatMessages: ChatMsg[];
  onClose: () => void;
  onChatMessage: (msg: ChatMsg) => void;
  micPermissionGranted?: boolean;
  onFilterDepartment?: (dept: string) => void;
  onFilterEmployee?: (name: string) => void;
  onFilterCategory?: (cat: string) => void;
  onAcknowledgeCard?: (employeeName: string) => void;
}) {
  const [inputVal, setInputVal] = useState('');
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const [footerMode, setFooterMode] = useState<'text' | 'voice'>('text');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelAudioRef = useRef<HTMLAudioElement | null>(null);
  const startListeningRef = useRef<(() => void) | null>(null);
  const isSoundMutedRef = useRef(isSoundMuted);
  const footerModeRef = useRef(footerMode);
  const isMicMutedRef = useRef(isMicMuted);
  const hasPermissionRef = useRef(!!micPermissionGranted);
  const lastSentTextRef = useRef<string>('');
  const lastSendTimeRef = useRef<number>(0);
  const isListeningRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelAbortRef = useRef<AbortController | null>(null);
  const requestSeqRef = useRef(0);
  const ttsResolveRef = useRef<(() => void) | null>(null);

  const schedulePanelRestart = useCallback((delayMs: number) => {
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    restartTimerRef.current = setTimeout(() => {
      restartTimerRef.current = null;
      if (!isMicMutedRef.current) {
        startListeningRef.current?.();
      }
    }, delayMs);
  }, []);

  const stopPanelAudio = useCallback(() => {
    if (ttsResolveRef.current) {
      ttsResolveRef.current();
      ttsResolveRef.current = null;
    }
    if (panelAudioRef.current) {
      panelAudioRef.current.onended = null;
      panelAudioRef.current.onerror = null;
      panelAudioRef.current.pause();
      panelAudioRef.current.src = '';
      panelAudioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  useEffect(() => { isSoundMutedRef.current = isSoundMuted; }, [isSoundMuted]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { footerModeRef.current = footerMode; }, [footerMode]);
  useEffect(() => { isMicMutedRef.current = isMicMuted; }, [isMicMuted]);
  useEffect(() => { if (micPermissionGranted) hasPermissionRef.current = true; }, [micPermissionGranted]);

  const requestMicPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      hasPermissionRef.current = true;
      return true;
    } catch {
      onChatMessage({ role: 'model', text: 'Microphone access was denied. Please allow microphone permissions and try again.' });
      return false;
    }
  }, [onChatMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const bakeryCardPanel = (dwoData as any).insightCards[0];
  const bakeryEmployeeListText = dwoData.employees.map((e: any) => {
    return `- ${e.name} (${e.role}, ${e.type}): attendance ${e.attendanceScore}/100, compliance ${e.complianceScore}/100, attrition risk ${e.attritionRisk} (${e.attritionProbability}). ${e.certifications ? 'Certs: ' + e.certifications.join(', ') + '.' : ''} ${e.notes || ''}`;
  }).join('\n');

  const feEmployeeListText = frontendData.employees.map((e: any) => {
    return `- ${e.name} (${e.role}, ${e.type}): attendance ${e.attendanceScore}/100, compliance ${e.complianceScore}/100, attrition risk ${e.attritionRisk} (${e.attritionProbability}). ${e.isMinor ? 'MINOR (age ' + e.minorAge + ').' : ''}`;
  }).join('\n');

  const feCardListText = frontendData.insightCards.map((card: any, i: number) => {
    return `${i + 1}. "${card.title}" — ${card.employeeName} (${card.urgency} urgency, expires ${card.expires}). ${card.body}. Actions: [${card.actions.join(', ')}]`;
  }).join('\n');

  const systemInstruction = `You are Bryte, an AI assistant embedded in a Dynamic Workforce Operations dashboard for Store 0404.

Here is the EXACT dashboard data currently displayed on screen. You MUST answer from this data when it covers the user's question.

STORE: Store 0404
DATE: Saturday, April 5, 2026
TIME: 11:05am

METRICS (Today):
- Hours: 320 scheduled, 265 worked
- Labor cost: $12,180 budget, $11,145 spent

— BAKERY DEPARTMENT —
Current shift: ${(dwoData as any).meta.currentShift}
LIVE COMPLIANCE ALERT (1):
1. "${bakeryCardPanel.title}" — ${bakeryCardPanel.employeeName} (${bakeryCardPanel.urgency} urgency, expires ${bakeryCardPanel.expires}). ${bakeryCardPanel.body}. Actions: [${bakeryCardPanel.actions.join(', ')}]
   Two paths: Accept = process waiver ($${(dwoData as any).employees[0].financialImpact?.premiumPayPerViolation || 18.50} premium pay, violation recorded). Dismiss = sending her on break now (must complete before ${(dwoData as any).meta.legalBreakDeadline}).
EMPLOYEES:
${bakeryEmployeeListText}
KEY INSIGHTS:
- Maria Garcia: ${(dwoData as any).insights.maria.level1}
- Pattern: ${(dwoData as any).insights.maria.level3_pattern}
STAFFING: ${(dwoData as any).staffing.netResult.summary}

— FRONTEND DEPARTMENT —
Current shift: ${frontendData.meta.currentShift}
Total insight alerts: ${frontendData.meta.frontendInsights}
LIVE COMPLIANCE ALERTS (${frontendData.insightCards.length}):
${feCardListText}
EMPLOYEES:
${feEmployeeListText}
KEY INSIGHTS:
- Eliza Thompson: ${(frontendData.insights as any).eliza.level1}
- Tom Jones: ${(frontendData.insights as any).tom.level1}
- Sam Adams: ${(frontendData.insights as any).sam.level1}
STAFFING: ${(frontendData.insights as any).departmentOverview.summary}

AVAILABLE DEPARTMENTS FOR FILTERING: Frontend, Bakery, Produce, Deli, Cashier
AVAILABLE EMPLOYEES FOR FILTERING: Eliza, Tom, Maria, Sam, Jake, Emma, Lucas, James, Priya, Derek, Kenji, Sofia, Linda, Jordan, Ava, Alex

RESPONSE FORMAT — CCP (Confirm · Converse · Prompt):
Every response MUST follow this structure:
1. CONFIRM (1 sentence, 5-10 words): Name the subject. Lead with the topic, not "I". Do NOT repeat the user's exact words.
   ✅ "Here's Maria's situation." / "Checking Bakery attrition risk."
   ❌ "I found information about Maria." / "Sure, let me pull that up."
2. CONVERSE (≤4 sentences): Answer ONE disclosure level only. Key fact first. Use names, numbers, times, costs. Plain language, no jargon. No lists — weave items into natural sentences.
3. PROMPT (1 question): End with exactly one question that moves to the next logical disclosure level. Never ask "Is there anything else?"
   ✅ "Want to see the pattern behind why this keeps happening?"
   ❌ "Would you like to know more about the history, the policy, or your options?"

For ACTION responses (accepting, dismissing, acknowledging, applying schedule changes), use CCP+ConfirmGate:
- Replace Prompt with a Gate: explain what the action will do FIRST, then ask a clear yes/no permission question.
   ✅ "It processes the waiver — $18.50 premium pay added automatically. Shall I go ahead and accept?"
   ❌ "Shall I accept the waiver?"

PROGRESSIVE DISCLOSURE LEVELS — answer ONE level per response:
L1: What's happening now | L2: History/context | L3: Pattern/root cause | L4: Policy/law | L5: Actions/recommendations | L6: Risk/consequences

TONE: Speak like a knowledgeable colleague. Use contractions. No hedging ("it appears", "you might want to"). State things directly. Name people, not roles. In text chat, responses can be slightly longer than voice (up to 80 words). CRITICAL: Output the entire response as ONE single paragraph with NO line breaks, NO newlines, NO paragraph separations. The Confirm, Converse, and Prompt parts must flow together in one continuous block of text.

DATA RULES:
- Answer from the dashboard data above when it covers the question. Do NOT invent data.
- Only use general knowledge for drill-down questions beyond what's shown.
- DEPARTMENT FILTER: When the user asks about a department, append <<FILTER_DEPT:DepartmentName>> at the end. Do NOT ask for confirmation.
- EMPLOYEE FILTER: When the user asks about a specific employee, append <<FILTER_EMP:FirstName>> at the end. Do NOT ask for confirmation.
- Only one filter tag per response.`;

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || sendingRef.current) return;
    const normalizedText = text.trim().replace(/[.!?,;:]+$/g, '').trim().toLowerCase();
    const timeSinceLastSend = Date.now() - lastSendTimeRef.current;
    if (normalizedText === lastSentTextRef.current && timeSinceLastSend < 10000) return;

    if (panelAbortRef.current) panelAbortRef.current.abort();
    const abortCtrl = new AbortController();
    panelAbortRef.current = abortCtrl;
    const mySeq = ++requestSeqRef.current;

    stopPanelAudio();

    sendingRef.current = true;
    lastSentTextRef.current = normalizedText;
    lastSendTimeRef.current = Date.now();
    setSending(true);
    onChatMessage({ role: 'user', text });

    const voiceMatch = matchAllVoiceQueries(text);
    if (voiceMatch) {
      const responseText = voiceMatch.response;
      onChatMessage({ role: 'model', text: responseText });

      if (voiceMatch.filterTarget) {
        const ft = voiceMatch.filterTarget as any;
        if (ft.department) onFilterDepartment?.(ft.department);
        if (ft.employeeId) {
          const allEmployees = [...dwoData.employees, ...frontendData.employees];
          const emp = allEmployees.find(e => e.id === ft.employeeId);
          if (emp) onFilterEmployee?.(emp.name.split(' ')[0]);
        }
      }

      if ((voiceMatch as any).action) {
        const action = (voiceMatch as any).action as string;
        if (action.startsWith("acknowledge:")) {
          const empName = action.split(":")[1];
          onAcknowledgeCard?.(empName);
        }
      }

      sendingRef.current = false;
      setSending(false);

      const wantTts = footerModeRef.current === 'voice' && !isSoundMutedRef.current;
      if (wantTts) {
        try {
          const ttsRes = await fetch('/api/gemini/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: responseText }),
          });
          if (ttsRes.ok) {
            const ttsData = await ttsRes.json();
            if (ttsData.audio) {
              stopPanelAudio();
              setIsSpeaking(true);
              const wav = pcmToWavBlob(ttsData.audio);
              const url = URL.createObjectURL(wav);
              const audio = new Audio(url);
              panelAudioRef.current = audio;
              await new Promise<void>((resolve) => {
                ttsResolveRef.current = resolve;
                const cleanup = () => {
                  ttsResolveRef.current = null;
                  URL.revokeObjectURL(url);
                  panelAudioRef.current = null;
                  setIsSpeaking(false);
                  if (footerModeRef.current === 'voice') {
                    isMicMutedRef.current = true;
                    setIsMicMuted(true);
                  }
                  resolve();
                };
                audio.onended = cleanup;
                audio.onerror = cleanup;
                audio.play().catch(() => { ttsResolveRef.current = null; resolve(); });
              });
            }
          }
        } catch { /* TTS failed, text response already shown */ }
      }
      return;
    }

    const wantTts = footerModeRef.current === 'voice' && !isSoundMutedRef.current;

    try {
      const allMsgs = [...chatMessages, { role: 'user' as const, text }];
      const messages = allMsgs.map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, systemInstruction, withTts: wantTts }),
        signal: abortCtrl.signal,
      });

      if (mySeq !== requestSeqRef.current) return;

      const data = await res.json();
      const rawText = data.text || 'Sorry, I could not generate a response.';
      const { cleanText: responseText, department: filterDept, employee: filterEmp } = parseFilterAction(rawText);
      onChatMessage({ role: 'model', text: responseText });

      if (filterDept) onFilterDepartment?.(filterDept);
      else if (filterEmp) onFilterEmployee?.(filterEmp);

      if (wantTts && data.audio && mySeq === requestSeqRef.current) {
        stopPanelAudio();
        setIsSpeaking(true);

        if (footerModeRef.current !== 'voice' || isMicMutedRef.current) {
          setIsSpeaking(false);
        } else {
          const wav = pcmToWavBlob(data.audio);
          const url = URL.createObjectURL(wav);
          const audio = new Audio(url);
          panelAudioRef.current = audio;

          await new Promise<void>((resolve) => {
            ttsResolveRef.current = resolve;
            const cleanup = () => {
              ttsResolveRef.current = null;
              URL.revokeObjectURL(url);
              panelAudioRef.current = null;
              setIsSpeaking(false);
              if (footerModeRef.current === 'voice') {
                isMicMutedRef.current = true;
                setIsMicMuted(true);
              }
              resolve();
            };
            audio.onended = cleanup;
            audio.onerror = cleanup;
            audio.play().catch(() => {
              ttsResolveRef.current = null;
              resolve();
            });
          });
        }
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      if (mySeq === requestSeqRef.current) {
        onChatMessage({ role: 'model', text: 'Sorry, there was an error processing your request.' });
      }
    } finally {
      if (mySeq === requestSeqRef.current) {
        sendingRef.current = false;
        setSending(false);
      }
    }
  }, [sending, chatMessages, onChatMessage, systemInstruction, stopPanelAudio, onFilterDepartment, onFilterEmployee, onAcknowledgeCard]);

  const stopRecording = useCallback(() => {
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (_) {}
    }
  }, []);

  const startListening = useCallback(async () => {
    if (footerModeRef.current !== 'voice') return;
    if (!hasPermissionRef.current) return;
    if (sendingRef.current) return;
    if (isSpeakingRef.current) return;
    if (isListeningRef.current) return;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') return;
    isListeningRef.current = true;
    stopPanelAudio();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      let speechDetected = false;
      let detectionAvailable = false;
      let detectionCancelled = false;
      try {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const dataArr = new Uint8Array(analyser.frequencyBinCount);
        detectionAvailable = true;
        const checkLevel = () => {
          if (detectionCancelled || !mediaStreamRef.current) { audioCtx.close(); return; }
          analyser.getByteFrequencyData(dataArr);
          let sum = 0;
          for (let i = 0; i < dataArr.length; i++) sum += dataArr[i];
          const avg = sum / dataArr.length;
          if (avg > 25) speechDetected = true;
          if (!detectionCancelled && mediaStreamRef.current) requestAnimationFrame(checkLevel);
          else audioCtx.close();
        };
        requestAnimationFrame(checkLevel);
      } catch (_) {
        detectionAvailable = false;
      }

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        detectionCancelled = true;
        stream.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
        isListeningRef.current = false;
        if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
        if (restartTimerRef.current) { clearTimeout(restartTimerRef.current); restartTimerRef.current = null; }
        setIsListening(false);

        if (footerModeRef.current !== 'voice') return;
        if (chunks.length === 0 || isMicMutedRef.current) return;
        if (sendingRef.current || isSpeakingRef.current) return;

        if (detectionAvailable && !speechDetected) {
          if (!isMicMutedRef.current && !sendingRef.current && !isSpeakingRef.current) schedulePanelRestart(300);
          return;
        }

        const blob = new Blob(chunks, { type: mimeType });
        if (blob.size < 100) {
          if (!isMicMutedRef.current && !sendingRef.current && !isSpeakingRef.current) schedulePanelRestart(300);
          return;
        }

        try {
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          if (sendingRef.current || isSpeakingRef.current) return;

          const res = await fetch('/api/gemini/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio: base64, mimeType: mimeType.split(';')[0] }),
          });
          if (!res.ok) throw new Error('Transcription failed');
          const data = await res.json();
          const text = data.text?.trim() || '';

          if (footerModeRef.current !== 'voice' || isMicMutedRef.current || sendingRef.current || isSpeakingRef.current) return;

          const lastModel = [...chatMessages].reverse().find(m => m.role === 'model');
          if (text && !isGarbageTranscription(text, lastModel?.text)) {
            sendMessage(text);
          } else if (!isMicMutedRef.current && !sendingRef.current && !isSpeakingRef.current) {
            schedulePanelRestart(300);
          }
        } catch {
          if (!sendingRef.current) {
            onChatMessage({ role: 'model', text: 'Failed to transcribe audio. Please try again.' });
          }
          if (!isMicMutedRef.current && !sendingRef.current && !isSpeakingRef.current) schedulePanelRestart(300);
        }
      };

      recorder.start(250);
      setIsListening(true);

      silenceTimerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      }, 5000);

    } catch {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
      hasPermissionRef.current = false;
      onChatMessage({ role: 'model', text: 'Microphone access was denied. Please allow microphone permissions and try again.' });
    }
  }, [sendMessage, onChatMessage]);

  useEffect(() => { startListeningRef.current = startListening; }, [startListening]);

  

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch (_) {}
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (panelAbortRef.current) panelAbortRef.current.abort();
      if (ttsResolveRef.current) { ttsResolveRef.current(); ttsResolveRef.current = null; }
      if (panelAudioRef.current) { panelAudioRef.current.onended = null; panelAudioRef.current.onerror = null; panelAudioRef.current.pause(); panelAudioRef.current.src = ''; panelAudioRef.current = null; }
    };
  }, []);

  const handleTextSend = useCallback(() => {
    const text = inputVal.trim();
    if (!text) return;
    setInputVal('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    sendMessage(text);
  }, [inputVal, sendMessage]);

  const handleVoiceModeClick = useCallback(async () => {
    if (!hasPermissionRef.current) {
      const granted = await requestMicPermission();
      if (!granted) return;
    }
    footerModeRef.current = 'voice';
    isMicMutedRef.current = true;
    setFooterMode('voice');
    setIsMicMuted(true);
  }, [requestMicPermission]);

  const handleTypeClick = useCallback(() => {
    footerModeRef.current = 'text';
    isMicMutedRef.current = true;
    stopRecording();
    stopPanelAudio();
    setIsMicMuted(true);
    setIsListening(false);
    setIsSpeaking(false);
    setFooterMode('text');
  }, [stopRecording, stopPanelAudio]);

  const handleEndClick = useCallback(() => {
    footerModeRef.current = 'text';
    isMicMutedRef.current = true;
    stopRecording();
    stopPanelAudio();
    setIsMicMuted(true);
    setIsListening(false);
    setIsSpeaking(false);
    setFooterMode('text');
  }, [stopRecording, stopPanelAudio]);

  const handleMicToggle = useCallback(async () => {
    if (sending) return;
    const newMuted = !isMicMuted;
    isMicMutedRef.current = newMuted;
    setIsMicMuted(newMuted);
    if (newMuted) {
      stopRecording();
      setIsListening(false);
    } else {
      if (!hasPermissionRef.current) {
        const granted = await requestMicPermission();
        if (!granted) { isMicMutedRef.current = true; setIsMicMuted(true); return; }
      }
      setTimeout(() => startListeningRef.current?.(), 300);
    }
  }, [isMicMuted, sending, requestMicPermission, stopRecording]);

  const handleStopProcessing = useCallback(() => {
    if (panelAbortRef.current) panelAbortRef.current.abort();
    stopPanelAudio();
    sendingRef.current = false;
    setSending(false);
    setIsSpeaking(false);
    onChatMessage({ role: 'model', text: 'Processing stopped' });
  }, [stopPanelAudio, onChatMessage]);

  const handleVoiceCancel = useCallback(() => {
    const wasSending = sendingRef.current;
    if (panelAbortRef.current) panelAbortRef.current.abort();
    if (restartTimerRef.current) { clearTimeout(restartTimerRef.current); restartTimerRef.current = null; }
    stopRecording();
    stopPanelAudio();
    isMicMutedRef.current = true;
    sendingRef.current = false;
    setSending(false);
    setIsMicMuted(true);
    setIsListening(false);
    setIsSpeaking(false);
    if (wasSending) {
      onChatMessage({ role: 'model', text: 'Processing stopped' });
    }
  }, [stopRecording, stopPanelAudio, onChatMessage]);

  const handleTapToSpeak = useCallback(async () => {
    if (sending || isSpeaking) return;
    if (!hasPermissionRef.current) {
      const granted = await requestMicPermission();
      if (!granted) return;
    }
    isMicMutedRef.current = false;
    setIsMicMuted(false);
    setTimeout(() => startListeningRef.current?.(), 200);
  }, [sending, isSpeaking, requestMicPermission]);

  const handleSoundToggle = useCallback(() => {
    const newMuted = !isSoundMuted;
    setIsSoundMuted(newMuted);
    if (newMuted) {
      stopPanelAudio();
      setIsSpeaking(false);
    }
  }, [isSoundMuted, stopPanelAudio]);

  const isBusy = sending || isSpeaking;
  const hasText = inputVal.trim().length > 0;
  const isMicOn = !sending && !isMicMuted;

  return (
    <div className="bryte-panel">
      <div className="bryte-panel-header">
        <button className="bryte-panel-close" onClick={onClose}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth="2" strokeLinecap="round">
            <line x1="1" y1="1" x2="12" y2="12" /><line x1="12" y1="1" x2="1" y2="12" />
          </svg>
        </button>
        <div className="bryte-panel-title">
          <BryteLogoSvg />
          <span>Bryte</span>
        </div>
        <div className="bryte-panel-actions">
          <button className="bryte-panel-action-btn" title="New chat">
            <ShareIcon />
          </button>
        </div>
      </div>
      <div className="bryte-panel-content" ref={scrollRef}>
        {chatMessages.length === 0 && (
          <div className="bryte-panel-empty">Ask Bryte anything about your dashboard data, staffing, or compliance.</div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} className={`bryte-msg ${msg.role === 'user' ? 'bryte-msg--user' : 'bryte-msg--ai'}`}>
            <div className={`bryte-msg-bubble ${msg.role === 'user' ? 'bryte-msg-bubble--user' : 'bryte-msg-bubble--ai'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="bryte-msg bryte-msg--ai">
            <div className="bryte-msg-bubble bryte-msg-bubble--ai bryte-msg-thinking">Thinking...</div>
          </div>
        )}
      </div>
      {showSuggestions && <div className="bryte-suggestions-overlay" onClick={() => setShowSuggestions(false)} />}

      {footerMode === 'text' ? (
        <div className="bryte-footer-text">
          {showSuggestions ? (
            <div className="bryte-suggestions bryte-suggestions--expanded">
              {[
                { label: 'What needs my attention right now?', full: 'What needs my attention right now?' },
                { label: 'What are the most critical issues?', full: 'What are the most critical issues?' },
                { label: 'What should I fix first?', full: 'What should I fix first?' },
                { label: 'Do we have coverage gaps right now?', full: 'Do we have coverage gaps right now?' },
              ].map((s) => (
                <button key={s.label} className={`bryte-suggestion-pill${isBusy ? ' bryte-suggestion-pill--disabled' : ''}`} onClick={() => { if (!isBusy) { setShowSuggestions(false); const cat = TOPIC_CATEGORY_MAP[s.full]; if (cat) onFilterCategory?.(cat); sendMessage(s.full); } }}>
                  <span>{s.label}</span>
                </button>
              ))}
              <button className="bryte-suggestions-close" onClick={() => setShowSuggestions(false)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="rgba(0,0,0,.5)" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
          ) : (
            <div className="bryte-suggestions">
              <button className={`bryte-suggestion-pill${isBusy ? ' bryte-suggestion-pill--disabled' : ''}`} onClick={() => { if (!isBusy) { onFilterCategory?.('Meal break'); sendMessage('What are the most critical issues?'); } }}>
                <span>Most critical issues</span>
              </button>
              <button className="bryte-suggestions-expand" onClick={() => setShowSuggestions(true)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="rgba(0,0,0,.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          )}
          <div className="bryte-footer-text-bar">
            <div className="bryte-footer-text-input-wrap">
              <textarea
                ref={inputRef}
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!isBusy) handleTextSend(); } }}
                placeholder="Search or ask Bryte"
                rows={1}
                className="bryte-footer-textarea"
              />
            </div>
            <div className="bryte-footer-text-actions">
              <AddButtonIcon />
              {isBusy ? (
                <button
                  className="bryte-footer-stop-btn"
                  onClick={handleStopProcessing}
                  title="Stop"
                >
                  <div className="bryte-footer-stop-square" />
                </button>
              ) : hasText ? (
                <button
                  className="bryte-footer-send-icon"
                  onClick={handleTextSend}
                >
                  <img src="/images/send-filled.svg" alt="Send" style={{ width: 24, height: 24 }} />
                </button>
              ) : (
                <button
                  className="bryte-footer-voice-btn"
                  onClick={handleVoiceModeClick}
                >
                  <img src="/images/voice-mode.svg" alt="Voice mode" style={{ width: 24, height: 24 }} />
                </button>
              )}
            </div>
          </div>
          <div className="bryte-disclaimer">
            Bryte uses AI. Always check for surprises and mistakes. <a href="#" onClick={(e) => e.preventDefault()}>Learn more</a>
          </div>
        </div>
      ) : (
        <div className="bryte-footer-voice">
          {isListening && (
            <div className="bryte-voice-status-label">
              <span>Listening ...</span>
            </div>
          )}
          <div className="bryte-voice-card">
            <div className="bryte-voice-search-label">Search or ask Bryte</div>
            <div className="bryte-voice-icons-row">
              <button className="bryte-voice-toolbar-btn" onClick={handleTypeClick} title="Attachment">
                <img src="/images/attachment-icon.svg" alt="Attachment" className="bryte-voice-toolbar-icon" />
              </button>
              <button className="bryte-voice-sound-btn" onClick={handleSoundToggle}>
                <img
                  src="/images/volume-down.svg"
                  alt={!isSoundMuted ? 'Sound on' : 'Sound off'}
                  className="bryte-voice-sound-icon"
                  style={isSoundMuted ? { opacity: 0.25 } : undefined}
                />
              </button>
              {(sending || isSpeaking) ? (
                <button className="bryte-voice-stop-btn" onClick={handleVoiceCancel}>
                  <div className="bryte-voice-stop-square" />
                </button>
              ) : isListening ? (
                <div className="bryte-voice-mic-breathing">
                  <img src="/images/mic-animated.svg" alt="Listening" className="bryte-voice-mic-breathing-icon" />
                </div>
              ) : (
                <button className="bryte-voice-mic-tap" onClick={handleTapToSpeak}>
                  <img src="/images/mic-idle.svg" alt="Tap to speak" className="bryte-voice-mic-tap-icon" />
                </button>
              )}
              <button className="bryte-voice-toolbar-btn" onClick={handleEndClick} title="Close">
                <img src="/images/close-voice.svg" alt="Close voice" className="bryte-voice-toolbar-icon bryte-voice-close-icon" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BryteVoiceDialog({ onAllow, onDismiss }: { onAllow: () => void; onDismiss: () => void }) {
  return (
    <div className="bryte-voice-overlay">
      <div className="bryte-voice-dialog">
        <div className="bryte-voice-dialog-heading">Bryte would like to access the microphone</div>
        <div className="bryte-voice-dialog-body">
          <p>Bryte requires access to the microphone so you can use your voice to filter results, search or ask questions.</p>
        </div>
        <div className="bryte-voice-dialog-actions">
          <button className="bryte-voice-dialog-btn bryte-voice-dialog-btn--secondary" onClick={onDismiss}>Not now</button>
          <button className="bryte-voice-dialog-btn bryte-voice-dialog-btn--primary" onClick={onAllow}>Allow</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const urlParams = new URLSearchParams(window.location.search);
  const [bryteOpen, setBryteOpen] = useState(urlParams.get('panel') === '1');
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [showMicDialog, setShowMicDialog] = useState(!urlParams.get('panel'));
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [employeeFilter, setEmployeeFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [ackDialogId, setAckDialogId] = useState<string | null>(null);
  const lastAppliedFilterRef = useRef<string | null>(null);

  const handleChatMessage = useCallback((msg: ChatMsg) => {
    setChatMessages(prev => [...prev, msg]);
  }, []);

  const handleExpand = useCallback(() => {
    setBryteOpen(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setBryteOpen(false);
  }, []);

  const handleMicAllow = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setMicPermissionGranted(true);
    } catch {
      setMicPermissionGranted(false);
    }
    setShowMicDialog(false);
  }, []);

  const handleMicDismiss = useCallback(() => {
    setShowMicDialog(false);
  }, []);

  const VALID_DEPARTMENTS = ["Frontend", "Bakery", "Produce", "Deli", "Cashier"];
  const DEPT_ALIASES: Record<string, string> = { "front end": "Frontend", "frontend": "Frontend", "front-end": "Frontend" };
  const VALID_EMPLOYEES = ["Eliza", "Tom", "Maria", "Sam", "Jake", "Emma", "Lucas"];

  const resolveDepartment = useCallback((dept: string): string | null => {
    if (VALID_DEPARTMENTS.includes(dept)) return dept;
    const alias = DEPT_ALIASES[dept.toLowerCase()];
    if (alias) return alias;
    const match = VALID_DEPARTMENTS.find(d => d.toLowerCase() === dept.toLowerCase());
    return match || null;
  }, []);

  const handleFilterDepartment = useCallback((dept: string) => {
    const resolved = resolveDepartment(dept);
    if (resolved && lastAppliedFilterRef.current !== `dept:${resolved}`) {
      lastAppliedFilterRef.current = `dept:${resolved}`;
      setEmployeeFilter(null);
      setCategoryFilter(null);
      setDepartmentFilter(resolved);
    }
  }, [resolveDepartment]);

  const handleFilterEmployee = useCallback((name: string) => {
    const match = VALID_EMPLOYEES.find(e => e.toLowerCase() === name.toLowerCase());
    if (match && lastAppliedFilterRef.current !== `emp:${match}`) {
      lastAppliedFilterRef.current = `emp:${match}`;
      setDepartmentFilter(null);
      setCategoryFilter(null);
      setEmployeeFilter(match);
    }
  }, []);

  const handleFilterCategory = useCallback((cat: string) => {
    lastAppliedFilterRef.current = null;
    setDepartmentFilter(null);
    setEmployeeFilter(null);
    setCategoryFilter(cat);
  }, []);

  const handleClearFilter = useCallback(() => {
    lastAppliedFilterRef.current = null;
    setDepartmentFilter(null);
    setEmployeeFilter(null);
    setCategoryFilter(null);
  }, []);

  const handleAcknowledgeCard = useCallback((id: string) => {
    setAckDialogId(id);
  }, []);

  const handleAckDone = useCallback(() => {
    if (ackDialogId) {
      setDismissedIds(prev => [...prev, ackDialogId]);
      setAckDialogId(null);
    }
  }, [ackDialogId]);

  const handleAckCancel = useCallback(() => {
    setAckDialogId(null);
  }, []);

  const handleDismissCard = useCallback((id: string) => {
    setDismissedIds(prev => [...prev, id]);
  }, []);

  const handleAcknowledgeByEmployee = useCallback((employeeName: string) => {
    const insight = COMPLIANCE_INSIGHTS.find(i =>
      i.employee.name.toLowerCase() === employeeName.toLowerCase() && !dismissedIds.includes(i.id)
    );
    if (insight) {
      setAckDialogId(insight.id);
    }
  }, [dismissedIds]);

  return (
    <div className="app-layout">
      <div className="app-main">
        <Nav />
        <div className="page">
          <Header />
          <Shortcuts />
          <Tagline />
          <MetricsCard />
          <div className="main">
            <ComplianceSection departmentFilter={departmentFilter} employeeFilter={employeeFilter} categoryFilter={categoryFilter} onClearFilter={handleClearFilter} dismissedIds={dismissedIds} ackDialogId={ackDialogId} onAcknowledge={handleAcknowledgeCard} onAckDone={handleAckDone} onAckCancel={handleAckCancel} onDismissCard={handleDismissCard} />
            <StaffingSection />
          </div>
        </div>
      </div>
      <MobileFooter />
      {!bryteOpen && (
        <VoiceSnippet chatMessages={chatMessages} onChatMessage={handleChatMessage} onExpand={handleExpand} micPermissionGranted={micPermissionGranted} onFilterDepartment={handleFilterDepartment} onFilterEmployee={handleFilterEmployee} onFilterCategory={handleFilterCategory} onAcknowledgeCard={handleAcknowledgeByEmployee} />
      )}
      {bryteOpen && (
        <BrytePanel chatMessages={chatMessages} onClose={handleClosePanel} onChatMessage={handleChatMessage} micPermissionGranted={micPermissionGranted} onFilterDepartment={handleFilterDepartment} onFilterEmployee={handleFilterEmployee} onFilterCategory={handleFilterCategory} onAcknowledgeCard={handleAcknowledgeByEmployee} />
      )}
      {showMicDialog && (
        <BryteVoiceDialog onAllow={handleMicAllow} onDismiss={handleMicDismiss} />
      )}
    </div>
  );
}
