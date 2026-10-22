import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useUIStore } from '../stores/uiStore';
import CustomDropdown from '../components/CustomDropdown';

export interface ZTTeamTextStoryPreset {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  themeStyle: 'midnight_dark' | 'frosted_pastel' | 'reading_corner';
  authorName: string;
  authorSubtitle: string;
  authorSubmeta2?: string;
  avatarUrl: string;
  avatarBorderColor: string;
  hasVerified: boolean;
  hasFollowBtn: boolean;
  isCensoredName: boolean;
  bgGradient: string;
  bgImage?: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  cardBackdropBlur: string;
  textColor: string;
  hookColor: string;
  hlColor: string;
  ctaText: string;
  ctaColor: string;
  hasBottomPill: boolean;
  bottomPillText: string;
  bottomPillColor: string;
  storyTitle: string;
  storyContent: string;
  highlightPhrases: string[];
  fontSize: number;
  lineHeight: number;
}

const ZTTEAM_STORY_PRESETS: ZTTeamTextStoryPreset[] = [
  {
    id: 'preset_midnight_derek',
    name: 'Midnight Dark Story (Derek West)',
    tagline: 'Card xanh đen phát sáng, tích xanh Facebook, chữ vàng hổ phách huyền ảo',
    badge: 'Mẫu 1 • Dark Glow',
    themeStyle: 'midnight_dark',
    authorName: 'Derek West',
    authorSubtitle: '4hrs ago · A Text Story',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    avatarBorderColor: '#38bdf8',
    hasVerified: true,
    hasFollowBtn: false,
    isCensoredName: false,
    bgGradient: 'radial-gradient(ellipse at 85% 15%, #05264a 0%, #031226 40%, #01060f 100%)',
    cardBg: 'rgba(5, 19, 41, 0.72)',
    cardBorder: '1.5px solid rgba(56, 189, 248, 0.35)',
    cardShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.22)',
    cardBackdropBlur: 'blur(20px)',
    textColor: '#e2e8f0',
    hookColor: '#fbbf24',
    hlColor: '#fbbf24',
    ctaText: 'Continue Reading...',
    ctaColor: '#38bdf8',
    hasBottomPill: false,
    bottomPillText: '',
    bottomPillColor: '#22c55e',
    storyTitle: 'My parents demanded 50% of my salary, so I gave them exactly what they asked for.',
    storyContent: `My parents demanded 50% of my salary, so I gave them exactly what they asked for. The day after discovering how much I earned, my parents showed up at my apartment—with a calculator. Dad sat down and announced, "Half your monthly income is fair. We raised you." Mom nodded. "It's time you gave back." They forgot all the years I had spent paying their bills, covering their rent, and watching my own dreams disappear while they spent my money. Then Dad placed a "family support agreement" in front of me. My name was already typed on the signature line. I didn't argue. I simply walked to my desk and returned with an envelope. "Fine," I said. "Here's what I owe you." Mom opened it. Her smile vanished. Dad stopped breathing. Because inside was something they had never expected to see...`,
    highlightPhrases: [
      '50% of my salary',
      'The day after discovering how much I earned',
      'They forgot all the years I had spent paying their bills',
      'Because inside was something they had never expected to see...'
    ],
    fontSize: 14,
    lineHeight: 1.35,
  },
  {
    id: 'preset_frosted_ruthie',
    name: 'Frosted Glass Pastel (Ruthie Bannsor)',
    tagline: 'Kính mờ cao cấp Frosted Glassmorphism, nền Pastel mềm mại, chữ đen sắc nét',
    badge: 'Mẫu 2 • Frosted Glass',
    themeStyle: 'frosted_pastel',
    authorName: 'Ruthie Bannsor',
    authorSubtitle: '14 hours ago · 👥 Tales.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    avatarBorderColor: '#94a3b8',
    hasVerified: false,
    hasFollowBtn: false,
    isCensoredName: true,
    bgGradient: 'linear-gradient(135deg, #e0e7ff 0%, #fae8ff 50%, #dbeafe 100%)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    cardBorder: '1.5px solid rgba(255, 255, 255, 0.95)',
    cardShadow: '0 25px 60px rgba(0, 0, 0, 0.18), 0 4px 20px rgba(255, 255, 255, 0.4)',
    cardBackdropBlur: 'blur(30px)',
    textColor: '#0f172a',
    hookColor: '#1e3a8a',
    hlColor: '#2563eb',
    ctaText: '... Continue Reading',
    ctaColor: '#1e3a8a',
    hasBottomPill: false,
    bottomPillText: '',
    bottomPillColor: '#22c55e',
    storyTitle: 'My neighbor Gene called me at 6 in the morning: "Ruthie, look out your back window"',
    storyContent: `My neighbor Gene called me at 6 in the morning: "Ruthie, look out your back window - slow, and don't turn the light on. Been going on since before five. Just look" I shuffled to the window in the dark, pulled the curtain back an inch, looked out at my own back fence - and I had to sit right down on the kitchen floor.

I'm 72, and I sleep like the dead. My Harold used to say a freight train could roll through the bedroom and I'd ask it to keep the noise down. So whatever'd been happening back there in the dark, all these mornings, I'd slept clean through every bit of it.

I didn't call the police, not yet. I made my coffee with hands that weren't quite steady, got dressed, and waited for the sun, calm as could be.

Because I knew that back corner of my property – the survey stakes, the old oak, the fence line my Harold put in himself in 1985.

And what those men were doing out there wasn't right. So the minute it was light, I put on my coat and started walking right up to them... to them ...`,
    highlightPhrases: [
      'at 6 in the morning:',
      'look out your back window',
      'had to sit right down on the kitchen floor.',
      'sleep like the dead.',
      'slept clean through every bit of it.',
      "didn't call the police, not yet.",
      'fence line my Harold put in himself in 1985.',
      "wasn't right.",
      'walking right up to them... to them ...'
    ],
    fontSize: 13.5,
    lineHeight: 1.32,
  },
  {
    id: 'preset_reading_mauro',
    name: 'Reading Corner Cinema (Mauro)',
    tagline: 'Viền vàng ánh kim, nút + Follow Facebook, highlight vàng chanh, Banner đáy CTA',
    badge: 'Mẫu 3 • Viral Hook & Follow',
    themeStyle: 'reading_corner',
    authorName: 'READING CORNER',
    authorSubtitle: '2hrs ago • 🌐',
    authorSubmeta2: 'Real Story 🔍',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80',
    avatarBorderColor: '#eab308',
    hasVerified: false,
    hasFollowBtn: true,
    isCensoredName: false,
    bgGradient: 'radial-gradient(circle at 50% 25%, #1c1103 0%, #080501 55%, #020100 100%)',
    cardBg: 'rgba(12, 10, 8, 0.76)',
    cardBorder: '1.8px solid rgba(234, 179, 8, 0.45)',
    cardShadow: '0 25px 65px rgba(0, 0, 0, 0.95), 0 0 35px rgba(234, 179, 8, 0.25)',
    cardBackdropBlur: 'blur(24px)',
    textColor: '#f8fafc',
    hookColor: '#fde047',
    hlColor: '#fde047',
    ctaText: 'Continue Reading...',
    ctaColor: '#eab308',
    hasBottomPill: true,
    bottomPillText: 'Full Story In Comment 👇',
    bottomPillColor: '#22c55e',
    storyTitle: 'My husband stole my platinum card to take his parents on a trip.',
    storyContent: `My husband stole my platinum card to take his parents on a trip. When I canceled it, he yelled at me: 'Reactivate it right now or I'm divorcing you!', and his mother swore she'd kick me out of the house... I just laughed."
"If you don't reactivate that card right now, I swear I'm cutting you out of my life by tomorrow!" That was the line Mauro shouted at me over the phone from the airport, not knowing that while he was making threats, I had already made the decision that would break his family apart forever.
"Are you even listening to me, Re-becca?" he roared. "My mom is here, my dad is here, Jamie is crying, and you're leaving us stranded as if we were common..."`,
    highlightPhrases: [
      'platinum card to take his parents',
      '"If you don\'t reactivate that card right now,',
      '"Are you even listening to me, Re-becca?"'
    ],
    fontSize: 14.2,
    lineHeight: 1.34,
  },
];

export default function ReelTemplateLibrary() {
  const { ztteam_showToast, ztteam_showConfirm } = useUIStore();

  /** State preset đang được kích hoạt */
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset_midnight_derek');
  const currentPreset = ZTTEAM_STORY_PRESETS.find((p) => p.id === selectedPresetId) || ZTTEAM_STORY_PRESETS[0];

  /** Tùy biến cục bộ */
  const [authorName, setAuthorName] = useState(currentPreset.authorName);
  const [authorSubtitle, setAuthorSubtitle] = useState(currentPreset.authorSubtitle);
  const [authorSubmeta2, setAuthorSubmeta2] = useState(currentPreset.authorSubmeta2 || '');
  const [avatarUrl, setAvatarUrl] = useState(currentPreset.avatarUrl);
  const [hasVerified, setHasVerified] = useState(currentPreset.hasVerified);
  const [hasFollowBtn, setHasFollowBtn] = useState(currentPreset.hasFollowBtn);
  const [isCensoredName, setIsCensoredName] = useState(currentPreset.isCensoredName);
  const [storyContent, setStoryContent] = useState(currentPreset.storyContent);
  const [highlightInput, setHighlightInput] = useState(currentPreset.highlightPhrases.join('\n'));
  const [hlColor, setHlColor] = useState(currentPreset.hlColor);
  const [ctaText, setCtaText] = useState(currentPreset.ctaText);
  const [hasBottomPill, setHasBottomPill] = useState(currentPreset.hasBottomPill);
  const [bottomPillText, setBottomPillText] = useState(currentPreset.bottomPillText || 'Full Story In Comment 👇');
  const [fontSize, setFontSize] = useState(currentPreset.fontSize);
  const [lineHeight, setLineHeight] = useState(currentPreset.lineHeight);

  /** Fanpage List để gán mặc định */
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageForApply, setSelectedPageForApply] = useState<string>('');
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRenderingTest, setIsRenderingTest] = useState(false);
  const [testVideoUrl, setTestVideoUrl] = useState<string | null>(null);

  /** Active Tab Điều Khiển */
  const [activeTab, setActiveTab] = useState<'branding' | 'text' | 'footer' | 'apply'>('branding');

  /** Đồng bộ khi đổi Preset */
  useEffect(() => {
    setAuthorName(currentPreset.authorName);
    setAuthorSubtitle(currentPreset.authorSubtitle);
    setAuthorSubmeta2(currentPreset.authorSubmeta2 || '');
    setAvatarUrl(currentPreset.avatarUrl);
    setHasVerified(currentPreset.hasVerified);
    setHasFollowBtn(currentPreset.hasFollowBtn);
    setIsCensoredName(currentPreset.isCensoredName);
    setStoryContent(currentPreset.storyContent);
    setHighlightInput(currentPreset.highlightPhrases.join('\n'));
    setHlColor(currentPreset.hlColor);
    setCtaText(currentPreset.ctaText);
    setHasBottomPill(currentPreset.hasBottomPill);
    setBottomPillText(currentPreset.bottomPillText || 'Full Story In Comment 👇');
    setFontSize(currentPreset.fontSize);
    setLineHeight(currentPreset.lineHeight);
    setTestVideoUrl(null);
  }, [selectedPresetId]);

  /** Tải danh sách Fanpage */
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await api.get('facebook/pages');
        setPages(res.data || []);
      } catch (err) {
        /** ignore */
      }
    };
    fetchPages();
  }, []);

  /** Tách danh sách từ khóa highlight */
  const highlightPhrases = highlightInput
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  /** Render văn bản có highlight thông minh */
  const ztteam_renderHighlightedText = (text: string) => {
    if (!highlightPhrases || highlightPhrases.length === 0) {
      return <span>{text}</span>;
    }

    // Sắp xếp các cụm từ highlight dài hơn lên trước để tránh xung đột
    const sortedPhrases = [...highlightPhrases].sort((a, b) => b.length - a.length);
    const escaped = sortedPhrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    if (!escaped) return <span>{text}</span>;

    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, idx) => {
      const isMatch = sortedPhrases.some((p) => p.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <span
            key={idx}
            style={{ color: hlColor }}
            className="font-black drop-shadow-xs"
          >
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  /** Áp dụng mẫu Text Story cho Fanpage */
  const ztteam_applyToFanpage = async () => {
    if (!selectedPageForApply) {
      ztteam_showToast('Vui lòng chọn Fanpage muốn áp dụng', 'error');
      return;
    }

    const confirmed = await ztteam_showConfirm(
      'Áp dụng mẫu giao diện',
      `Bạn có muốn thiết lập Fanpage này sử dụng công nghệ Text Story Reel với giao diện "${currentPreset.name}" không?`
    );
    if (!confirmed) return;

    try {
      setIsApplying(true);
      await api.put(`facebook/pages/${selectedPageForApply}/settings`, {
        video_engine: 'text_story',
      });
      ztteam_showToast(`Đã áp dụng mẫu "${currentPreset.name}" cho Fanpage thành công!`, 'success');
    } catch (err: any) {
      ztteam_showToast(err.response?.data?.message || 'Lỗi khi áp dụng cho Fanpage', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  /** Lưu template vào hệ thống */
  const ztteam_saveTemplate = async () => {
    try {
      setIsSaving(true);
      await api.post('templates', {
        name: `Text Story - ${currentPreset.name}`,
        format: 'video',
        content_type: 'text_story',
        layout: {
          presetId: selectedPresetId,
          themeStyle: currentPreset.themeStyle,
          authorName,
          authorSubtitle,
          hasVerified,
          hasFollowBtn,
          isCensoredName,
          hlColor,
          ctaText,
          hasBottomPill,
          bottomPillText,
          fontSize,
          lineHeight,
        },
      });
      ztteam_showToast('Đã lưu cấu hình mẫu giao diện Reel thành công!', 'success');
    } catch (err: any) {
      ztteam_showToast(err.response?.data?.message || 'Lỗi khi lưu mẫu giao diện', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 pb-12">
      {/** 1. Header Banner */}
      <div className="bg-fb-surface rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-fb-surface-hover/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
              Viral Reel Studio
            </span>
            <span className="text-xs text-fb-text-muted">• Tỉ lệ 9:16 (1080x1920)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-fb-text tracking-tight flex items-center gap-2.5">
            <span className="material-symbols-outlined text-cyan-400 text-3xl">auto_stories</span>
            Kho Giao Diện Reel (Text Story)
          </h2>
          <p className="text-xs sm:text-sm font-medium text-fb-text-muted mt-1 leading-relaxed max-w-3xl">
            Bộ sưu tập các mẫu Text Story Reel lan truyền triệu view trên Facebook & TikTok: Khung kính mờ Frosted Glass, Tích xanh Verified, Nút Follow, Highlight từ khóa kịch tính và CTA chuyển đổi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={ztteam_saveTemplate}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-fb-blue to-cyan-500 hover:from-fb-blue-hover hover:to-cyan-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[17px] ${isSaving ? 'animate-spin' : ''}`}>
              {isSaving ? 'sync' : 'save'}
            </span>
            <span>{isSaving ? 'Đang lưu...' : 'Lưu Mẫu Này'}</span>
          </button>
        </div>
      </div>

      {/** 2. Preset Selection Cards (3 Mẫu Chuẩn Theo Hình Ảnh) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ZTTEAM_STORY_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => setSelectedPresetId(preset.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-fb-surface border-cyan-400/80 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-400/20'
                  : 'bg-fb-surface/80 border-fb-surface-hover/60 hover:bg-fb-surface hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                        : 'bg-fb-surface-hover text-fb-text-muted'
                    }`}
                  >
                    {preset.badge}
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-cyan-400 text-xl">
                      check_circle
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-black text-fb-text tracking-wide">{preset.name}</h3>
                <p className="text-[11px] text-fb-text-muted mt-1 leading-relaxed line-clamp-2">
                  {preset.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-fb-surface-hover/40 flex items-center justify-between text-[11px]">
                <span className="text-fb-text-muted font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.hlColor }} />
                  <span>Highlight: {preset.hlColor}</span>
                </span>
                <span className="text-cyan-400 font-bold hover:underline">Xem trước ➔</span>
              </div>
            </div>
          );
        })}
      </div>

      {/** 3. Main Workspace: Live Phone Mockup (Left) + Customizer Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/** CỘT TRÁI: LIVE 9:16 PHONE MOCKUP (45% Width) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-center mb-3">
            <span className="text-xs font-bold text-fb-text-muted uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-cyan-400">smartphone</span>
              Xem Thử Trực Quan 9:16 (Live Preview)
            </span>
          </div>

          {/** Phone Device Bezel */}
          <div className="w-[340px] sm:w-[380px] h-[670px] sm:h-[720px] bg-slate-950 rounded-[44px] p-3.5 shadow-2xl border-4 border-slate-800 relative flex flex-col overflow-hidden">
            {/** Phone Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30" />

            {/** Màn Hình Reel 9:16 Content */}
            <div
              className="w-full h-full rounded-[34px] overflow-hidden relative flex flex-col justify-between p-4.5 transition-all select-none"
              style={{ background: currentPreset.bgGradient }}
            >
              {/** Quầng sáng mờ huyền ảo trong nền */}
              <div className="absolute top-10 right-0 w-44 h-44 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-16 left-0 w-44 h-44 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

              {/** KHUNG TRUYỆN TRUNG TÂM (CARD CHÍNH) */}
              <div
                className="w-full my-auto rounded-2xl p-4 flex flex-col justify-between transition-all relative z-10"
                style={{
                  background: currentPreset.cardBg,
                  border: currentPreset.cardBorder,
                  boxShadow: currentPreset.cardShadow,
                  backdropFilter: currentPreset.cardBackdropBlur,
                  WebkitBackdropFilter: currentPreset.cardBackdropBlur,
                }}
              >
                {/** Header của Card */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/** Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover shadow-md"
                        style={{ border: `2px solid ${currentPreset.avatarBorderColor}` }}
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150';
                        }}
                      />
                      {currentPreset.themeStyle === 'reading_corner' && (
                        <div className="absolute -inset-0.5 rounded-full ring-2 ring-amber-400 ring-offset-1 ring-offset-black pointer-events-none" />
                      )}
                    </div>

                    {/** Tên & Meta */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-black truncate leading-tight ${
                            isCensoredName ? 'blur-[3px] select-none' : ''
                          }`}
                          style={{ color: currentPreset.themeStyle === 'frosted_pastel' ? '#0f172a' : '#ffffff' }}
                        >
                          {authorName}
                        </span>

                        {/** Tích xanh Verified */}
                        {hasVerified && (
                          <svg className="w-3.5 h-3.5 shrink-0 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.6-5.6 1.4 1.4-7 7z" />
                          </svg>
                        )}

                        {/** Follow Button kiểu Facebook */}
                        {hasFollowBtn && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#1877F2] text-white flex items-center gap-0.5 shrink-0 shadow-xs">
                            <span>+</span>
                            <span>Follow</span>
                          </span>
                        )}
                      </div>

                      <div
                        className="text-[10px] font-medium flex items-center gap-1 mt-0.5 truncate"
                        style={{ color: currentPreset.themeStyle === 'frosted_pastel' ? '#64748b' : '#94a3b8' }}
                      >
                        <span>{authorSubtitle}</span>
                        {authorSubmeta2 && (
                          <>
                            <span>•</span>
                            <span className="font-bold">{authorSubmeta2}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/** Nội dung truyện & Typography */}
                <div className="py-3">
                  <p
                    className="font-bold tracking-tight text-left leading-snug whitespace-pre-line"
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: lineHeight,
                      color: currentPreset.textColor,
                      fontFamily: "'Barlow Condensed', 'Montserrat', sans-serif",
                    }}
                  >
                    {ztteam_renderHighlightedText(storyContent)}
                  </p>
                </div>

                {/** Nút Continue Reading ở góc đáy của Card */}
                <div className="pt-2 text-right">
                  <span
                    className="text-xs font-black tracking-wide inline-block"
                    style={{ color: currentPreset.ctaColor }}
                  >
                    {ctaText}
                  </span>
                </div>
              </div>

              {/** BANNER PILL ĐÁY (Ví dụ Mẫu 3: Full Story In Comment) */}
              {hasBottomPill && (
                <div className="w-full mt-2 z-10 animate-pulse">
                  <div className="mx-auto w-fit px-4 py-1.5 rounded-full bg-black/85 border border-emerald-500/40 shadow-lg flex items-center gap-1.5 text-xs font-black text-emerald-400">
                    <span>{bottomPillText}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/** CỘT PHẢI: BẢNG TÙY BIẾN THÔNG SỐ (55% Width) */}
        <div className="lg:col-span-7 bg-fb-surface rounded-2xl p-6 shadow-lg border border-fb-surface-hover/60 space-y-6">
          {/** Tabs điều khiển */}
          <div className="flex items-center gap-2 border-b border-fb-surface-hover/60 pb-3">
            {[
              { id: 'branding', label: 'Thương Hiệu & Header', icon: 'badge' },
              { id: 'text', label: 'Nội Dung & Highlight', icon: 'format_color_text' },
              { id: 'footer', label: 'CTA & Nút Đáy', icon: 'call_to_action' },
              { id: 'apply', label: 'Áp Dụng Fanpage', icon: 'send_to_mobile' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-fb-blue text-white shadow-md shadow-blue-500/20'
                    : 'text-fb-text-muted hover:text-fb-text hover:bg-fb-surface-hover'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/** TAB 1: THƯƠNG HIỆU & HEADER */}
          {activeTab === 'branding' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-fb-text uppercase mb-1.5">Tên Tác Giả / Kênh</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-fb-surface-hover text-fb-text text-xs font-bold p-2.5 rounded-xl border border-white/5 focus:outline-none focus:ring-1 focus:ring-fb-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-fb-text uppercase mb-1.5">Dòng Phụ Đề Thời Gian</label>
                  <input
                    type="text"
                    value={authorSubtitle}
                    onChange={(e) => setAuthorSubtitle(e.target.value)}
                    placeholder="VD: 4hrs ago · A Text Story"
                    className="w-full bg-fb-surface-hover text-fb-text text-xs font-medium p-2.5 rounded-xl border border-white/5 focus:outline-none focus:ring-1 focus:ring-fb-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-fb-text uppercase mb-1.5">Link Avatar Hình Ảnh</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-fb-surface-hover text-fb-text text-xs font-medium p-2.5 rounded-xl border border-white/5 focus:outline-none focus:ring-1 focus:ring-fb-blue"
                />
              </div>

              {/** Toggles */}
              <div className="pt-2 border-t border-fb-surface-hover/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-fb-surface-hover/30 border border-white/5">
                  <span className="text-xs font-bold text-fb-text flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-blue-400">verified</span>
                    Tích Xanh FB
                  </span>
                  <button
                    type="button"
                    onClick={() => setHasVerified(!hasVerified)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                      hasVerified ? 'bg-blue-600' : 'bg-black/40 border border-white/5'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${hasVerified ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-fb-surface-hover/30 border border-white/5">
                  <span className="text-xs font-bold text-fb-text flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-cyan-400">add_circle</span>
                    Nút + Follow
                  </span>
                  <button
                    type="button"
                    onClick={() => setHasFollowBtn(!hasFollowBtn)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                      hasFollowBtn ? 'bg-blue-600' : 'bg-black/40 border border-white/5'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${hasFollowBtn ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-fb-surface-hover/30 border border-white/5">
                  <span className="text-xs font-bold text-fb-text flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-amber-400">blur_on</span>
                    Censor Tên
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCensoredName(!isCensoredName)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                      isCensoredName ? 'bg-amber-600' : 'bg-black/40 border border-white/5'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isCensoredName ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/** TAB 2: NỘI DUNG & HIGHLIGHT */}
          {activeTab === 'text' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-fb-text uppercase">Đoạn Văn Bản Trích Dẫn Story</label>
                  <span className="text-[11px] text-fb-text-muted">Độ dài: {storyContent.length} ký tự</span>
                </div>
                <textarea
                  rows={5}
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  className="w-full bg-fb-surface-hover text-fb-text text-xs font-medium p-3 rounded-xl border border-white/5 focus:outline-none focus:ring-1 focus:ring-fb-blue custom-scrollbar leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-fb-text uppercase mb-1.5">
                  Cụm Từ Khóa Highlight Kịch Tính (Mỗi dòng 1 cụm từ)
                </label>
                <textarea
                  rows={3}
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  placeholder="50% of my salary&#10;The day after discovering how much I earned..."
                  className="w-full bg-fb-surface-hover text-amber-300 text-xs font-mono p-3 rounded-xl border border-white/5 focus:outline-none focus:ring-1 focus:ring-fb-blue custom-scrollbar"
                />
              </div>

              {/** Palette chọn màu Highlight */}
              <div>
                <label className="block text-xs font-bold text-fb-text uppercase mb-2">Màu Highlight Từ Khóa</label>
                <div className="flex items-center gap-3">
                  {[
                    { name: 'Vàng Hổ Phách', color: '#fbbf24' },
                    { name: 'Vàng Chanh', color: '#fde047' },
                    { name: 'Xanh Cyan', color: '#38bdf8' },
                    { name: 'Xanh Lục Bảo', color: '#10b981' },
                    { name: 'Xanh Royal', color: '#2563eb' },
                  ].map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => setHlColor(p.color)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        hlColor === p.color
                          ? 'border-white bg-fb-surface-hover text-white'
                          : 'border-transparent text-fb-text-muted hover:text-white'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: p.color }} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/** Sliders Cỡ Chữ & Giãn Dòng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-fb-surface-hover/40">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-fb-text mb-1">
                    <span>Cỡ Chữ:</span>
                    <span className="text-cyan-400">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={18}
                    step={0.2}
                    value={fontSize}
                    onChange={(e) => setFontSize(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-fb-text mb-1">
                    <span>Khoảng Cách Dòng:</span>
                    <span className="text-cyan-400">{lineHeight}</span>
                  </div>
                  <input
                    type="range"
                    min={1.15}
                    max={1.5}
                    step={0.02}
                    value={lineHeight}
                    onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/** TAB 3: CTA & NÚT ĐÁY */}
          {activeTab === 'footer' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-fb-text uppercase mb-1.5">Chữ Nút Đọc Tiếp (CTA)</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full bg-fb-surface-hover text-fb-text text-xs font-bold p-2.5 rounded-xl border border-white/5 focus:outline-none focus:ring-1 focus:ring-fb-blue"
                />
              </div>

              <div className="p-4 rounded-xl bg-fb-surface-hover/30 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-fb-text">Thanh Banner Nổi Đáy ("Full Story In Comment")</h4>
                    <p className="text-[11px] text-fb-text-muted mt-0.5">Hiển thị viên thuốc phát sáng ở đáy để kêu gọi khán giả vào comment đọc tiếp Part 2</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasBottomPill(!hasBottomPill)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                      hasBottomPill ? 'bg-emerald-500' : 'bg-black/40 border border-white/5'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${hasBottomPill ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>

                {hasBottomPill && (
                  <div>
                    <label className="block text-xs font-bold text-fb-text uppercase mb-1">Nội dung Banner Đáy</label>
                    <input
                      type="text"
                      value={bottomPillText}
                      onChange={(e) => setBottomPillText(e.target.value)}
                      placeholder="Full Story In Comment 👇"
                      className="w-full bg-fb-surface text-emerald-400 text-xs font-bold p-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/** TAB 4: ÁP DỤNG CHO FANPAGE */}
          {activeTab === 'apply' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-fb-text uppercase mb-1.5">
                  Chọn Fanpage Cần Gán Mẫu Này
                </label>
                <CustomDropdown
                  value={selectedPageForApply}
                  onChange={(val) => setSelectedPageForApply(String(val))}
                  options={[
                    { value: '', label: '-- Chọn Fanpage Facebook --' },
                    ...pages.map((p: any) => ({
                      value: p.id,
                      label: `${p.name} (ID: ${p.fb_page_id})`,
                    })),
                  ]}
                  className="w-full"
                />
                <p className="text-[11px] text-fb-text-muted mt-2 leading-relaxed">
                  Khi gán, Fanpage sẽ tự động được chuyển chế độ render sang <strong>Text Story Reel 9:16</strong>, áp dụng bộ theme và phong cách bạn đang tùy chỉnh ở trên.
                </p>
              </div>

              <button
                type="button"
                onClick={ztteam_applyToFanpage}
                disabled={isApplying || !selectedPageForApply}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 via-fb-blue to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[18px] ${isApplying ? 'animate-spin' : ''}`}>
                  {isApplying ? 'sync' : 'verified'}
                </span>
                <span>{isApplying ? 'Đang áp dụng...' : '⚡ Xác Nhận Áp Dụng Cho Fanpage Này'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
