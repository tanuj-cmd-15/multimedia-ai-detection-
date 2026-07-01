# Rebranding: SwarParikshan → MayaBhedak

## Brand Identity

**Name:** MayaBhedak (माया भेदक)  
**Meaning:** Illusion Breaker  
- **माया (Maya):** Illusion, Deception, False Reality  
- **भेदक (Bhedak):** Breaker, Destroyer, Penetrator  

**Tagline Options:**
1. "Breaking Through Digital Illusions"
2. "Truth Beyond The Illusion"
3. "Shattering Deepfake Deceptions"
4. "Your Shield Against Digital Maya"

**SEO Keywords:**
- MayaBhedak
- Deepfake detector India
- AI illusion breaker
- Fake audio video detector
- Digital deception detector
- Maya bhedak tool
- Illusion breaker AI

---

## Rebranding Steps

### 1. Update Package Names (Backend)

**Current:** `com.swarparikshan.deepfake`  
**New:** `com.mayabhedak.platform`

**Files to Update:**
- All Java package declarations
- pom.xml groupId and artifactId
- application.properties references

### 2. Database Schema

**Current Tables:** Keep as-is initially  
**Service Name:** Update to "MayaBhedak Detection Platform"

### 3. Frontend Rebranding

**Components to Update:**
- Logo and favicon
- App title in index.html
- Navbar brand name
- Footer company name
- All user-facing text
- Meta tags for SEO

### 4. Environment Variables

Replace all instances of:
- `swarparikshan` → `mayabhedak`
- `SwarParikshan` → `MayaBhedak`

### 5. URLs and Endpoints

Keep `/api/` endpoints unchanged for backward compatibility.
Update display names only.

---

## SEO Optimization for MayaBhedak

### Meta Tags (index.html)
```html
<title>MayaBhedak - AI Deepfake Detection Platform | Break Digital Illusions</title>
<meta name="description" content="MayaBhedak (माया भेदक) - India's leading AI-powered deepfake detection platform. Detect fake audio, AI-generated images, and synthetic media with 98.6% accuracy. Break through digital illusions.">
<meta name="keywords" content="MayaBhedak, deepfake detector, AI fake detector, audio deepfake, image deepfake, illusion breaker, fake media detector, synthetic media detection, India">
```

### Open Graph Tags
```html
<meta property="og:title" content="MayaBhedak - Break Digital Illusions">
<meta property="og:description" content="AI-powered deepfake detection for audio and images. 98.6% accuracy. Free trial available.">
<meta property="og:image" content="/mayabhedak-og-image.png">
<meta property="og:url" content="https://mayabhedak.com">
```

### Twitter Card
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="MayaBhedak - Illusion Breaker">
<meta name="twitter:description" content="Detect deepfakes with AI precision. Break through digital deceptions.">
```

---

## Brand Colors (Keep or Update)

**Current Palette:**
- Primary: #1e40af (Blue)
- Accent: #3b82f6 (Light Blue)
- Success: #10b981 (Green)
- Danger: #ef4444 (Red)

**Suggested MayaBhedak Palette:**
- Primary: #8b5cf6 (Purple - represents mysticism/truth)
- Accent: #ec4899 (Pink - breaking through)
- Success: #10b981 (Green - keep)
- Danger: #ef4444 (Red - keep)
- Dark: #1e1b4b (Deep Navy)

---

## Logo Concept

**Visual Elements:**
- Shattered/broken glass effect
- Eye symbol (seeing through illusion)
- Shield with crack (protection + breaking)
- Lotus emerging from water (truth from illusion)

**Typography:**
- Primary: Bold, modern sans-serif
- Devanagari script: माया भेदक
- Latin script: MAYABHEDAK

---

## Implementation Priority

### High Priority (Do First)
1. ✅ Frontend text updates (instant)
2. ✅ Meta tags and SEO (instant)
3. ✅ Environment variable names (quick)
4. ✅ README and documentation (quick)

### Medium Priority (Week 1)
5. ⏳ Logo design and branding assets
6. ⏳ Package name refactoring (backend)
7. ⏳ Database service name updates
8. ⏳ Email templates and notifications

### Low Priority (Week 2+)
9. ⏳ Domain setup (mayabhedak.com)
10. ⏳ SSL certificates
11. ⏳ Social media accounts
12. ⏳ Brand guidelines document

---

## Quick Search & Replace Commands

### Windows PowerShell
```powershell
# Frontend text replacements
Get-ChildItem -Path .\frontend\src -Include *.jsx,*.js,*.html -Recurse | 
  ForEach-Object {
    (Get-Content $_.FullName) | 
    ForEach-Object { $_ -replace 'SwarParikshan', 'MayaBhedak' } |
    Set-Content $_.FullName
  }

# Update स्वर परीक्षा to माया भेदक
Get-ChildItem -Path .\frontend\src -Include *.jsx,*.js,*.html -Recurse | 
  ForEach-Object {
    (Get-Content $_.FullName) | 
    ForEach-Object { $_ -replace 'स्वर परीक्षा', 'माया भेदक' } |
    Set-Content $_.FullName
  }
```

---

## Brand Voice Guidelines

**Tone:** Confident, protective, truth-seeking  
**Style:** Professional yet approachable  
**Message:** "We break through digital illusions to reveal truth"

**Do's:**
✅ Emphasize truth and authenticity
✅ Use metaphors of breaking, shattering, revealing
✅ Highlight protection and security
✅ Reference Indian cultural context (Maya concept)

**Don'ts:**
❌ Don't sound alarmist or fearful
❌ Avoid overly technical jargon in marketing
❌ Don't claim 100% accuracy (be honest: 98.6%)

---

## Marketing Angles

1. **Cultural Resonance:** Maya is a well-known concept in Indian philosophy - use it!
2. **Problem-Solution:** Deepfakes are digital maya, we break through them
3. **Trust:** In a world of deception, we reveal truth
4. **Innovation:** Cutting-edge AI to combat cutting-edge fakes

---

**Status:** Ready for implementation
**Estimated Time:** 2-4 hours for complete rebranding
**Impact:** High - Strong brand identity with better SEO
