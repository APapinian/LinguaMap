// src/constants/languages.js

export const LANGS = [
  { code: 'it',  name: 'İtalyanca',  flag: '🇮🇹', family: 'roman'  },
  { code: 'es',  name: 'İspanyolca', flag: '🇪🇸', family: 'roman'  },
  { code: 'fr',  name: 'Fransızca',  flag: '🇫🇷', family: 'roman'  },
  { code: 'la',  name: 'Latince',    flag: '🏛️',  family: 'roman'  },
  { code: 'de',  name: 'Almanca',    flag: '🇩🇪', family: 'germen' },
  { code: 'en',  name: 'İngilizce',  flag: '🇬🇧', family: 'germen' },
  { code: 'ru',  name: 'Rusça',      flag: '🇷🇺', family: 'slav'   },
  { code: 'ja',  name: 'Japonca',    flag: '🇯🇵', family: 'other'  },
  { code: 'ko',  name: 'Korece',     flag: '🇰🇷', family: 'other'  },
  { code: 'zh',  name: 'Çince',      flag: '🇨🇳', family: 'other'  },
  { code: 'el',  name: 'Yunanca',    flag: '🇬🇷', family: 'other'  },
  { code: 'hy',  name: 'Ermenice',   flag: '🇦🇲', family: 'other'  },
  { code: 'kbd', name: 'Çerkesce',   flag: '🏔️',  family: 'other'  },
]

export const FAMILIES = {
  roman:  { label: 'Roman',  color: 'familyRoman',  bg: 'familyRomanBg'  },
  germen: { label: 'Cermen', color: 'familyGermen', bg: 'familyGermenBg' },
  slav:   { label: 'Slav',   color: 'familySlav',   bg: 'familySlavBg'   },
  other:  { label: 'Diğer',  color: 'familyOther',  bg: 'familyOtherBg'  },
}

export const CATEGORY_META = {
  verb:   { label: 'Fiil',   color: 'primary'   },
  noun:   { label: 'İsim',   color: 'secondary' },
  adj:    { label: 'Sıfat',  color: 'tertiary'  },
  phrase: { label: 'İfade',  color: 'success'   },
  grammar:{ label: 'Gramer', color: 'warning'   },
}

export const COGNATE_TREES = {
  'amor-group': {
    root: 'Lat. amare',
    children: [
      'it: amare', 'es: amar', 'fr: aimer',
      'en: amour (ödünç)', 'el: αμόρε (halk)',
    ],
  },
  'aqua-group': {
    root: 'Lat. aqua',
    children: [
      'it: acqua', 'es: agua', 'fr: eau (< *auga)',
      'en: aquatic (ödünç)', 'el: —',
    ],
  },
  'beau-group': {
    root: 'Lat. bellus',
    children: ['it: bello', 'es: bello', 'fr: beau', 'en: belle (ödünç)'],
  },
}

export const MOCK_ENTRIES = [
  {
    id: '1', concept: 'to love', category: 'verb',
    tags: ['duygu', 'temel'], cognateGroup: 'amor-group',
    translations: {
      it:  { value: 'amare',       romanization: '',                notes: '< Lat. amare'   },
      es:  { value: 'amar',        romanization: '',                notes: '< Lat. amare'   },
      fr:  { value: 'aimer',       romanization: '',                notes: '< Lat. amare'   },
      la:  { value: 'amare',       romanization: '',                notes: 'kök'             },
      de:  { value: 'lieben',      romanization: '',                notes: ''               },
      en:  { value: 'to love',     romanization: '',                notes: ''               },
      ru:  { value: 'любить',      romanization: "lyubit'",         notes: ''               },
      ja:  { value: '愛する',       romanization: 'ai suru',         notes: ''               },
      ko:  { value: '사랑하다',     romanization: 'saranghada',      notes: ''               },
      zh:  { value: '爱',           romanization: 'ài',             notes: ''               },
      el:  { value: 'αγαπώ',       romanization: 'agapó',           notes: ''               },
      hy:  { value: 'սիրել',       romanization: 'sirel',           notes: ''               },
      kbd: { value: 'фIэлIыкIын',  romanization: "f'aliqin",        notes: ''               },
    },
  },
  {
    id: '2', concept: 'water', category: 'noun',
    tags: ['doğa', 'temel'], cognateGroup: 'aqua-group',
    translations: {
      it:  { value: 'acqua',  romanization: '',        notes: '< Lat. aqua' },
      es:  { value: 'agua',   romanization: '',        notes: '< Lat. aqua' },
      fr:  { value: 'eau',    romanization: '',        notes: '< Lat. aqua' },
      la:  { value: 'aqua',   romanization: '',        notes: 'kök'         },
      de:  { value: 'Wasser', romanization: '',        notes: ''           },
      en:  { value: 'water',  romanization: '',        notes: ''           },
      ru:  { value: 'вода',   romanization: 'voda',   notes: ''           },
      ja:  { value: '水',      romanization: 'mizu',   notes: ''           },
      ko:  { value: '물',      romanization: 'mul',    notes: ''           },
      zh:  { value: '水',      romanization: 'shuǐ',  notes: ''           },
      el:  { value: 'νερό',   romanization: 'neró',   notes: ''           },
      hy:  { value: 'ջուր',   romanization: 'jur',    notes: ''           },
      kbd: { value: 'псы',    romanization: 'psy',    notes: ''           },
    },
  },
  {
    id: '3', concept: 'beautiful', category: 'adj',
    tags: ['tanımlama'], cognateGroup: 'beau-group',
    translations: {
      it:  { value: 'bello',     romanization: '',           notes: '< Lat. bellus' },
      es:  { value: 'bello',     romanization: '',           notes: '< Lat. bellus' },
      fr:  { value: 'beau',      romanization: '',           notes: '< Lat. bellus' },
      la:  { value: 'bellus',    romanization: '',           notes: 'kök'           },
      de:  { value: 'schön',     romanization: '',           notes: ''             },
      en:  { value: 'beautiful', romanization: '',           notes: ''             },
      ru:  { value: 'красивый',  romanization: 'krasiviy',  notes: ''             },
      ja:  { value: '美しい',     romanization: 'utsukushii',notes: ''             },
      ko:  { value: '아름다운',   romanization: 'areumdaun', notes: ''             },
      zh:  { value: '美丽',       romanization: 'měilì',     notes: ''             },
      el:  { value: 'όμορφος',   romanization: 'ómorfos',   notes: ''             },
      hy:  { value: 'գեղեցիկ',  romanization: 'gegetsik',  notes: ''             },
      kbd: { value: 'дахэ',      romanization: 'dahe',      notes: ''             },
    },
  },
  {
    id: '4', concept: 'I speak', category: 'phrase',
    tags: ['dil', 'iletişim'], cognateGroup: '',
    translations: {
      it:  { value: 'io parlo',        romanization: '',                    notes: '' },
      es:  { value: 'yo hablo',        romanization: '',                    notes: '' },
      fr:  { value: 'je parle',        romanization: '',                    notes: '' },
      la:  { value: 'loquor',          romanization: '',                    notes: '' },
      de:  { value: 'ich spreche',     romanization: '',                    notes: '' },
      en:  { value: 'I speak',         romanization: '',                    notes: '' },
      ru:  { value: 'я говорю',        romanization: 'ya govoryu',          notes: '' },
      ja:  { value: '私は話します',      romanization: 'watashi wa hanashimasu', notes: '' },
      ko:  { value: '나는 말합니다',     romanization: 'naneun malhabnida',  notes: '' },
      zh:  { value: '我说话',           romanization: 'wǒ shuōhuà',         notes: '' },
      el:  { value: 'μιλάω',           romanization: 'miláo',               notes: '' },
      hy:  { value: 'ես խոսում եմ',    romanization: 'yes khoshum yem',    notes: '' },
      kbd: { value: 'сэгущIэ',         romanization: "sag'usch'e",          notes: '' },
    },
  },
]

export const VERB_CONJUGATIONS = {
  'to love': {
    it:  { rows: [['1sg','amo'],['2sg','ami'],['3sg','ama'],['1pl','amiamo'],['2pl','amate'],['3pl','amano']] },
    es:  { rows: [['1sg','amo'],['2sg','amas'],['3sg','ama'],['1pl','amamos']] },
    fr:  { rows: [["1sg","j'aime"],['2sg','tu aimes'],['3sg','il aime'],['1pl','nous aimons']] },
    la:  { rows: [['1sg','amo'],['2sg','amas'],['3sg','amat'],['1pl','amamus']] },
    de:  { rows: [['1sg','ich liebe'],['2sg','du liebst'],['3sg','er liebt'],['1pl','wir lieben']] },
    en:  { rows: [['1sg','I love'],['2sg','you love'],['3sg','he loves'],['1pl','we love']] },
    ru:  { rows: [['1sg','люблю'],['2sg','любишь'],['3sg','любит'],['1pl','любим']] },
    ja:  { rows: [['現在','愛する'],['過去','愛した'],['否定','愛さない']] },
    ko:  { rows: [['현재','사랑해'],['과거','사랑했어']] },
    zh:  { rows: [['现在','我爱'],['过去','我爱过']] },
    el:  { rows: [['1sg','αγαπώ'],['2sg','αγαπάς'],['3sg','αγαπά']] },
    hy:  { rows: [['1sg','սիրում եմ']] },
    kbd: { rows: [['1sg','сэфIэлIыкI']] },
  },
}

export const GRAMMAR_STAGES = [
  {
    title: 'Temel cümle yapısı',
    subtitle: 'SVO / SOV düzeni',
    langs: [
      { code: 'it', flag: '🇮🇹', name: 'İtalyanca', family: 'roman',
        steps: ['Özne (S)', 'Fiil (V)', 'Nesne (O)'],
        example: 'La ragazza mangia il pane.' },
      { code: 'es', flag: '🇪🇸', name: 'İspanyolca', family: 'roman',
        steps: ['Özne (S)', 'Fiil (V)', 'Nesne (O)'],
        example: 'La chica come el pan.' },
      { code: 'de', flag: '🇩🇪', name: 'Almanca', family: 'germen',
        steps: ['Özne (S)', 'Fiil (V2)', 'Nesne (O)', '→ yan cümlede SOV'],
        example: 'Das Mädchen isst das Brot.' },
      { code: 'ja', flag: '🇯🇵', name: 'Japonca', family: 'other',
        steps: ['Özne (S)', 'Nesne (O)', 'Fiil (V) — sonda'],
        example: '女の子がパンを食べます。' },
    ],
  },
  {
    title: 'Hal sistemi',
    subtitle: 'İsim çekimi',
    langs: [
      { code: 'de', flag: '🇩🇪', name: 'Almanca', family: 'germen',
        steps: ['Nominatif (özne)', 'Akkusatif (nesne)', 'Dativ (dolaylı)', 'Genitif (iyelik)'],
        example: 'des Mannes — dem Mann — den Mann' },
      { code: 'ru', flag: '🇷🇺', name: 'Rusça', family: 'slav',
        steps: ['6 hal: nom, gen, dat, akk, enstr, prep'],
        example: 'книга → книги → книге → книгу' },
      { code: 'la', flag: '🏛️', name: 'Latince', family: 'roman',
        steps: ['6 hal + vokativ', '5 isim deklinasyonu'],
        example: 'aqua → aquae → aquam → aquā' },
    ],
  },
  {
    title: 'Fiil çekim sistemi',
    subtitle: 'Kişi, zaman, görünüş',
    langs: [
      { code: 'it', flag: '🇮🇹', name: 'İtalyanca', family: 'roman',
        steps: ['-are / -ere / -ire grupları', 'Passato prossimo', 'Imperfetto'],
        example: 'amo → amavo → ho amato' },
      { code: 'ru', flag: '🇷🇺', name: 'Rusça', family: 'slav',
        steps: ['Aspect çifti (perf/imperf)', '6 kişi çekimi', 'Cinsiyete göre geçmiş'],
        example: 'читать → читаю, читаешь...' },
      { code: 'ja', flag: '🇯🇵', name: 'Japonca', family: 'other',
        steps: ['u-fiil / ru-fiil', 'Kibarca form (-masu)', 'te-formu kombinasyonları'],
        example: '食べる → 食べます → 食べた' },
    ],
  },
]

export const BADGES = [
  { id: 'first',   icon: '🌱', label: 'İlk kavram',         earned: true,  desc: 'İlk kavramını ekledin', xp: 50   },
  { id: 'poly5',   icon: '🗣️', label: 'Polyglot başlangıcı',earned: true,  desc: '5 dilde kelime öğrendin', xp: 100 },
  { id: 'streak7', icon: '🔥', label: '7 günlük seri',       earned: true,  desc: '7 gün üst üste çalıştın', xp: 200 },
  { id: 'cognate', icon: '🔗', label: 'Cognate avcısı',      earned: true,  desc: 'İlk cognate grubunu oluşturdun', xp: 150 },
  { id: 'roman',   icon: '🏛️', label: 'Roman uzmanı',        earned: false, desc: 'Tüm Roman dillerini tamamla', xp: 300 },
  { id: 'fc50',    icon: '🃏', label: 'Flashcard ustası',     earned: false, desc: '50 flashcard tamamla', xp: 250  },
  { id: 'grammar', icon: '📖', label: 'Gramer kaşifi',        earned: false, desc: 'Tüm gramer aşamalarını geç', xp: 400 },
  { id: 'all13',   icon: '🌍', label: '13 Dil',              earned: false, desc: 'Tüm dillerde kelime ekle', xp: 500 },
]
