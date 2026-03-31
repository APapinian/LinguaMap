# LinguaMap — Material Design 3

13 dili paralel takip eden kişisel dil öğrenimi uygulaması.
React + MUI v5 (M3 teması) + Supabase + Ollama stack.

## Kurulum

```bash
npm install
cp .env.local.example .env.local
# .env.local içine Supabase URL/key + Ollama URL gir
npm run dev
```

## Gereksinimler

- Node 18+
- Supabase projesi (veya mock data ile çalışır)
- Ollama çalışıyor olmalı: `ollama run qwen2.5:7b`

## Mimari

```
src/
├── theme/
│   └── m3Theme.js          # Tam M3 color tokens, typography scale, component overrides
├── constants/
│   └── languages.js        # LANGS, FAMILIES, mock data, conjugations, grammar stages
├── hooks/
│   ├── useEntries.js       # Supabase CRUD + mock fallback
│   └── useOllama.js        # Ollama /api/generate entegrasyonu
├── components/
│   ├── views/
│   │   ├── TableView.jsx   # Smart search, family filters, cognate tree, audio
│   │   ├── VerbView.jsx    # M3 conjugation cards with audio
│   │   ├── GrammarView.jsx # Staged grammar stepper cards
│   │   ├── FlashcardView.jsx # 3D flip animation, streak, XP
│   │   └── BadgesView.jsx  # Achievement grid
│   └── modals/
│       └── AddEntryModal.jsx # M3 dialog + Ollama trigger
└── App.jsx                 # Navigation rail (compact ↔ expanded), app shell
```

## M3 Tasarım Prensipleri Uygulandı

- **Color scheme**: Primary (indigo-teal), Secondary, Tertiary (gamification)
- **Aile renkleri**: Roman=mavi, Cermen=yeşil, Slav=turuncu, Diğer=mor
- **Typography scale**: M3'ün tam type scale — displayLarge'dan labelSmall'a
- **Shape**: Extrasmall (4px) → Full (pill/20px) arası M3 shape tokenleri
- **Elevation**: M3 tonal elevation (shadow tints yerine renkli yüzeyler)
- **Components**: Button, FAB, Chip, Card, Dialog, NavigationRail hepsi M3 spec'e göre override edildi
- **Motion**: FAB ripple, 3D kart flip (500ms cubic-bezier), collapse animasyonu
- **Dark mode**: Tam destek — tüm M3 dark color tokenleri tanımlı
