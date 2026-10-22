const teaserHtml = `
<!--
  Template: teaser ("Tin nóng 5s")
-->
{{{fontFace}}}
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;600;700;800;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1080px; height: 1920px; background: transparent; }
  body {
    font-family: 'Montserrat', 'Plus Jakarta Sans', 'Inter', 'DejaVu Sans', 'Liberation Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  :root { --acc: {{#if colors.danger}}{{colors.danger}}{{else}}{{colors.primary}}{{/if}}; }

  .stage { position: relative; width: 1080px; height: 1920px; overflow: hidden; }
  .bg-img { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; object-fit: cover; z-index: -1; }

  .subtitles-preview { display: none;
    position: absolute; left: {{layout.subtitles.x}}px; top: {{layout.subtitles.y}}px; width: 1000px;
    background: rgba(0,0,0,0.6); color: white; padding: 20px; font-size: 40px; font-weight: bold; border-radius: 12px;
    text-align: center; border: 2px dashed #fff;
  }

  .video-frame {
    position: absolute;
    left: {{video_area.x}}px; top: {{video_area.y}}px;
    width: {{video_area.w}}px; height: {{video_area.h}}px;
    border-radius: {{video_area.radius}}px;
    pointer-events: none;
  }

  .header {
    position: absolute; left: {{layout.header.x}}px; top: {{layout.header.y}}px;
    display: flex; align-items: center; gap: 18px;
  }
  .header .logo { width: 58px; height: 58px; border-radius: 50%; overflow: hidden; flex: 0 0 auto; }
  .header .logo img, .header .logo svg { width: 100%; height: 100%; object-fit: cover; display: block; }
  .header .pname {
    font-size: 36px; font-weight: 800; letter-spacing: -0.3px; color: #ffffff;
  }
  .header .pname .dot { color: var(--acc); }

  .hook { position: absolute; left: {{layout.hook.x}}px; top: {{layout.hook.y}}px; width: 848px; }
  .hook .line {
    display: block; font-size: 52px; font-weight: 800; line-height: 1.25; letter-spacing: -0.4px;
    color: var(--acc); word-break: break-word; white-space: normal;
  }
</style>

<div class="stage">
  <img class="bg-img" src="{{layout.bg_image_url}}" style="{{#unless layout.bg_image_url}}display:none;{{/unless}}" />
  <div class="video-frame"></div>

  <div class="header" data-drag-id="header">
    <span class="logo">{{{logoSvg}}}</span>
    <span class="pname">{{fanpageName}}<span class="dot">.</span></span>
  </div>

  <div class="hook" data-drag-id="hook">
    <span class="line accent">{{title}}</span>
  </div>
  
  <div class="subtitles-preview" data-drag-id="subtitles">
    Khu vực phụ đề (Subtitles)
  </div>
</div>
`;

export const seedTemplates = () => {
  const templates: any[] = [];
  
  templates.push({
    name: 'Breaking News Modern',
    format: 'video',
    content_type: 'teaser',
    voice_id: null,
    video_y: 184,
    video_radius: 0,
    html_content: teaserHtml,
    layout: {
      breaking: { x: 40, y: 26 },
      header: { x: 84, y: 1362 },
      hook: { x: 90, y: 1450 },
      subtitles: { x: 40, y: 1000 }
    },
    is_default: true
  });


  templates.push({
    name: 'Ghép 2 Ảnh (Nửa trái / Nửa phải)',
    format: 'image',
    content_type: 'split_2',
    voice_id: null,
    video_y: 0,
    video_radius: 0,
    html_content: `
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1080px; display: flex; background: #fff; position: relative; }
  .left { width: 50%; height: 100%; padding-right: 5px; position: relative; }
  .right { width: 50%; height: 100%; padding-left: 5px; position: relative; }
  .img-wrap { width: 100%; height: 100%; overflow: hidden; position: relative; }
  img { width: 100%; height: 100%; object-fit: cover; }
  
  /* ẢNH NHỎ HÌNH TRÒN GIỮA TÂM */
  .inset { position: absolute; top: 50%; left: 50%; width: 400px; height: 400px; border: 12px solid white; box-shadow: 0 15px 40px rgba(0,0,0,0.6); border-radius: 50%; overflow: hidden; z-index: 5; transform: translate(-50%, -50%); }
  
  /* MŨI TÊN CONG ĐẸP MẮT */
  .arrow { position: absolute; top: 32%; left: 20%; width: 200px; height: 200px; z-index: 10; filter: drop-shadow(0px 8px 15px rgba(0,0,0,0.7)) drop-shadow(0px 0px 4px white); transform: rotate(15deg); }
</style>
<div class="left"><div class="img-wrap"><img src="{{image_1}}" /></div></div>
<div class="right"><div class="img-wrap"><img src="{{image_2}}" /></div></div>
<!-- TRUNG TÂM -->
<div class="inset"><img src="{{image_3}}" /></div>
<svg class="arrow" viewBox="0 0 512 512" fill="#ff0033">
  <path d="M500.3 227.3L372.3 99.3c-15.6-15.6-40.9-15.6-56.6 0-15.6 15.6-15.6 40.9 0 56.6l60.1 60.1H192c-88.4 0-160 71.6-160 160v32c0 22.1 17.9 40 40 40s40-17.9 40-40v-32c0-44.2 35.8-80 80-80h183.8l-60.1 60.1c-15.6 15.6-15.6 40.9 0 56.6 15.6 15.6 40.9 15.6 56.6 0l128-128c15.6-15.6 15.6-40.9 0-56.6z"/>
</svg>`,
    layout: {},
    is_default: true
  });

  templates.push({
    name: 'Ghép 3 Ảnh (1 Trên, 2 Dưới)',
    format: 'image',
    content_type: 'split_3',
    voice_id: null,
    video_y: 0,
    video_radius: 0,
    html_content: `
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1080px; display: flex; flex-direction: column; background: #fff; position: relative; }
  .top { width: 100%; height: 50%; padding-bottom: 5px; position: relative; }
  .bottom { width: 100%; height: 50%; display: flex; padding-top: 5px; }
  .bot-half { width: 50%; height: 100%; }
  .bot-half:first-child { padding-right: 5px; }
  .bot-half:last-child { padding-left: 5px; }
  .img-wrap { width: 100%; height: 100%; overflow: hidden; position: relative; }
  img { width: 100%; height: 100%; object-fit: cover; }
  
  /* ẢNH NHỎ HÌNH TRÒN */
  .inset { position: absolute; top: 50%; left: 50%; width: 400px; height: 400px; border: 12px solid white; box-shadow: 0 15px 40px rgba(0,0,0,0.6); border-radius: 50%; overflow: hidden; z-index: 5; transform: translate(-50%, -50%); }
  
  /* MŨI TÊN CONG ĐẸP MẮT */
  .arrow { position: absolute; top: 32%; left: 20%; width: 200px; height: 200px; z-index: 10; filter: drop-shadow(0px 8px 15px rgba(0,0,0,0.7)) drop-shadow(0px 0px 4px white); transform: rotate(15deg); }
</style>
<div class="top">
  <div class="img-wrap"><img src="{{image_1}}" /></div>
</div>
<div class="bottom">
  <div class="bot-half"><div class="img-wrap"><img src="{{image_2}}" /></div></div>
  <div class="bot-half"><div class="img-wrap"><img src="{{image_3}}" /></div></div>
</div>
<!-- TRUNG TÂM -->
<div class="inset"><img src="{{image_4}}" /></div>
<svg class="arrow" viewBox="0 0 512 512" fill="#ff0033">
  <path d="M500.3 227.3L372.3 99.3c-15.6-15.6-40.9-15.6-56.6 0-15.6 15.6-15.6 40.9 0 56.6l60.1 60.1H192c-88.4 0-160 71.6-160 160v32c0 22.1 17.9 40 40 40s40-17.9 40-40v-32c0-44.2 35.8-80 80-80h183.8l-60.1 60.1c-15.6 15.6-15.6 40.9 0 56.6 15.6 15.6 40.9 15.6 56.6 0l128-128c15.6-15.6 15.6-40.9 0-56.6z"/>
</svg>`,
    layout: {},
    is_default: true
  });

  templates.push({
    name: 'Ghép 4 Ảnh (Lưới 2x2)',
    format: 'image',
    content_type: 'split_4',
    voice_id: null,
    video_y: 0,
    video_radius: 0,
    html_content: `
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1080px; display: flex; flex-wrap: wrap; background: #fff; position: relative; }
  .cell { width: 50%; height: 50%; position: relative; }
  .cell:nth-child(1) { padding: 0 5px 5px 0; }
  .cell:nth-child(2) { padding: 0 0 5px 5px; }
  .cell:nth-child(3) { padding: 5px 5px 0 0; }
  .cell:nth-child(4) { padding: 5px 0 0 5px; }
  .img-wrap { width: 100%; height: 100%; overflow: hidden; position: relative; }
  img { width: 100%; height: 100%; object-fit: cover; }
  
  /* ẢNH NHỎ HÌNH TRÒN */
  .inset { position: absolute; top: 50%; left: 50%; width: 400px; height: 400px; border: 12px solid white; box-shadow: 0 15px 40px rgba(0,0,0,0.6); border-radius: 50%; overflow: hidden; z-index: 5; transform: translate(-50%, -50%); }
  
  /* MŨI TÊN CONG ĐẸP MẮT */
  .arrow { position: absolute; top: 30%; left: 25%; width: 220px; height: 220px; z-index: 10; filter: drop-shadow(0px 8px 15px rgba(0,0,0,0.7)) drop-shadow(0px 0px 4px white); transform: rotate(15deg); }
</style>
<div class="cell"><div class="img-wrap"><img src="{{image_1}}" /></div></div>
<div class="cell"><div class="img-wrap"><img src="{{image_2}}" /></div></div>
<div class="cell"><div class="img-wrap"><img src="{{image_3}}" /></div></div>
<div class="cell"><div class="img-wrap"><img src="{{image_4}}" /></div></div>
<!-- TRUNG TÂM -->
<div class="inset"><img src="{{image_5}}" /></div>
<svg class="arrow" viewBox="0 0 512 512" fill="#ff0033">
  <path d="M500.3 227.3L372.3 99.3c-15.6-15.6-40.9-15.6-56.6 0-15.6 15.6-15.6 40.9 0 56.6l60.1 60.1H192c-88.4 0-160 71.6-160 160v32c0 22.1 17.9 40 40 40s40-17.9 40-40v-32c0-44.2 35.8-80 80-80h183.8l-60.1 60.1c-15.6 15.6-15.6 40.9 0 56.6 15.6 15.6 40.9 15.6 56.6 0l128-128c15.6-15.6 15.6-40.9 0-56.6z"/>
</svg>`,
    layout: {},
    is_default: true
  });



  templates.push({
    name: 'Text Story - Midnight Sapphire (Xanh Thẳm Huyền Bí)',
    format: 'video',
    content_type: 'text_story',
    voice_id: null,
    video_y: 0,
    video_radius: 0,
    html_content: '',
    layout: {
      presetId: 'preset_midnight_sapphire',
      themeStyle: 'midnight_dark',
      authorName: 'Derek West',
      authorSubtitle: '4hrs ago · A Text Story',
      hasVerified: true,
      hasFollowBtn: false,
      isCensoredName: false,
      bgGradient: 'radial-gradient(ellipse at 85% 15%, #05264a 0%, #031226 40%, #01060f 100%)',
      aura1: 'rgba(6, 182, 212, 0.55)',
      aura2: 'rgba(13, 148, 136, 0.60)',
      aura3: 'rgba(217, 119, 6, 0.40)',
      cardBg: 'rgba(5, 19, 41, 0.72)',
      cardBorder: '1.5px solid rgba(56, 189, 248, 0.35)',
      cardShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.22)',
      textColor: '#e2e8f0',
      hookColor: '#fbbf24',
      hlColor: '#fbbf24',
      ctaText: 'Continue Reading...',
      ctaColor: '#38bdf8',
      hasBottomPill: false,
      bottomPillText: '',
    },
    is_default: true
  });

  templates.push({
    name: 'Text Story - Emerald Shadow (Lục Bảo Quyền Quý)',
    format: 'video',
    content_type: 'text_story',
    voice_id: null,
    video_y: 0,
    video_radius: 0,
    html_content: '',
    layout: {
      presetId: 'preset_emerald_shadow',
      themeStyle: 'emerald_shadow',
      authorName: 'Forest Tales',
      authorSubtitle: '5hrs ago · 🌲 Nature Story',
      hasVerified: true,
      hasFollowBtn: true,
      isCensoredName: false,
      bgGradient: 'radial-gradient(ellipse at 80% 20%, #062b1e 0%, #021a11 45%, #010a06 100%)',
      aura1: 'rgba(16, 185, 129, 0.50)',
      aura2: 'rgba(5, 150, 105, 0.55)',
      aura3: 'rgba(20, 83, 45, 0.60)',
      cardBg: 'rgba(4, 28, 19, 0.75)',
      cardBorder: '1.5px solid rgba(52, 211, 153, 0.35)',
      cardShadow: '0 25px 60px rgba(0, 0, 0, 0.92), 0 0 35px rgba(16, 185, 129, 0.25)',
      textColor: '#f1f5f9',
      hookColor: '#a7f3d0',
      hlColor: '#34d399',
      ctaText: 'Continue Reading...',
      ctaColor: '#6ee7b7',
      hasBottomPill: false,
      bottomPillText: '',
    },
    is_default: false
  });

  templates.push({
    name: 'Text Story - Obsidian Gold (Vàng Kim Hoàng Gia)',
    format: 'video',
    content_type: 'text_story',
    voice_id: null,
    video_y: 0,
    video_radius: 0,
    html_content: '',
    layout: {
      presetId: 'preset_obsidian_gold',
      themeStyle: 'reading_corner',
      authorName: 'READING CORNER',
      authorSubtitle: '2hrs ago • 🌐',
      authorSubmeta2: 'Real Story 🔍',
      hasVerified: false,
      hasFollowBtn: true,
      isCensoredName: false,
      bgGradient: 'radial-gradient(ellipse at 75% 20%, #2a1a08 0%, #0f0a04 45%, #030201 100%)',
      aura1: 'rgba(245, 158, 11, 0.52)',
      aura2: 'rgba(180, 83, 9, 0.60)',
      aura3: 'rgba(30, 41, 59, 0.65)',
      cardBg: 'rgba(18, 12, 6, 0.80)',
      cardBorder: '1.8px solid rgba(234, 179, 8, 0.45)',
      cardShadow: '0 25px 65px rgba(0, 0, 0, 0.95), 0 0 35px rgba(234, 179, 8, 0.25)',
      textColor: '#f8fafc',
      hookColor: '#fde047',
      hlColor: '#fde047',
      ctaText: 'Continue Reading...',
      ctaColor: '#fbbf24',
      hasBottomPill: true,
      bottomPillText: 'Full Story In Comment 👇',
    },
    is_default: false
  });

  templates.push({
    name: 'Text Story - Charcoal Slate (Xám Đen & Censor Tên)',
    format: 'video',
    content_type: 'text_story',
    voice_id: null,
    video_y: 0,
    video_radius: 0,
    html_content: '',
    layout: {
      presetId: 'preset_charcoal_slate',
      themeStyle: 'charcoal_slate',
      authorName: 'Confidential Daily',
      authorSubtitle: '1hr ago · Anonymous Post',
      hasVerified: true,
      hasFollowBtn: false,
      isCensoredName: true,
      bgGradient: 'radial-gradient(ellipse at 70% 30%, #18181b 0%, #09090b 50%, #000000 100%)',
      aura1: 'rgba(148, 163, 184, 0.35)',
      aura2: 'rgba(71, 85, 105, 0.45)',
      aura3: 'rgba(30, 41, 59, 0.55)',
      cardBg: 'rgba(24, 24, 27, 0.82)',
      cardBorder: '1.5px solid rgba(148, 163, 184, 0.25)',
      cardShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 255, 255, 0.08)',
      textColor: '#f1f5f9',
      hookColor: '#ffffff',
      hlColor: '#facc15',
      ctaText: '... Continue Reading',
      ctaColor: '#38bdf8',
      hasBottomPill: false,
      bottomPillText: '',
    },
    is_default: false
  });

  templates.push({
    name: 'Text Story - Royal Ocean (Xanh Lam Biển Sâu)',
    format: 'video',
    content_type: 'text_story',
    voice_id: null,
    video_y: 0,
    video_radius: 0,
    html_content: '',
    layout: {
      presetId: 'preset_royal_ocean',
      themeStyle: 'royal_ocean',
      authorName: 'Oceanic Chronicle',
      authorSubtitle: '3hrs ago · 🌊 Deep Waves',
      hasVerified: true,
      hasFollowBtn: true,
      isCensoredName: false,
      bgGradient: 'radial-gradient(ellipse at 80% 25%, #0c204c 0%, #040c1e 45%, #01040c 100%)',
      aura1: 'rgba(37, 99, 235, 0.52)',
      aura2: 'rgba(14, 165, 233, 0.55)',
      aura3: 'rgba(30, 58, 138, 0.62)',
      cardBg: 'rgba(8, 18, 42, 0.78)',
      cardBorder: '1.8px solid rgba(96, 165, 250, 0.38)',
      cardShadow: '0 32px 85px rgba(0, 0, 0, 0.88), 0 0 45px rgba(37, 99, 235, 0.25)',
      textColor: '#e6edf5',
      hookColor: '#93c5fd',
      hlColor: '#38bdf8',
      ctaText: 'Continue Reading...',
      ctaColor: '#60a5fa',
      hasBottomPill: false,
      bottomPillText: '',
    },
    is_default: false
  });

  templates.push({
    name: 'Text Story - Frosted Glass Clean (Kính Mờ Tinh Tế)',
    format: 'video',
    content_type: 'text_story',
    voice_id: null,
    video_y: 0,
    video_radius: 0,
    html_content: '',
    layout: {
      presetId: 'preset_frosted_clean',
      themeStyle: 'frosted_clean',
      authorName: 'Ruthie Bannsor',
      authorSubtitle: '14 hours ago · 👥 Tales.com',
      hasVerified: false,
      hasFollowBtn: false,
      isCensoredName: true,
      bgGradient: 'linear-gradient(135deg, #091e2f 0%, #0f172a 50%, #020617 100%)',
      aura1: 'rgba(56, 189, 248, 0.40)',
      aura2: 'rgba(20, 184, 166, 0.40)',
      aura3: 'rgba(15, 23, 42, 0.60)',
      cardBg: 'rgba(30, 41, 59, 0.70)',
      cardBorder: '1.5px solid rgba(255, 255, 255, 0.20)',
      cardShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 255, 255, 0.1)',
      textColor: '#f8fafc',
      hookColor: '#38bdf8',
      hlColor: '#38bdf8',
      ctaText: '... Continue Reading',
      ctaColor: '#38bdf8',
      hasBottomPill: false,
      bottomPillText: '',
    },
    is_default: false
  });

  return templates;
};
