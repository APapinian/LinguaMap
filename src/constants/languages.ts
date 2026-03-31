// src/constants/languages.ts — v3 with expanded conjugations + new types
import type { Lang, Category, Badge, GramStage, CognateTreeData, AppSettings, LangCode } from '@/types'

export const LANGS: Lang[] = [
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

export const LANG_MAP = Object.fromEntries(LANGS.map(l => [l.code, l])) as Record<LangCode, Lang>

export const TTS_LANG_MAP: Record<LangCode, string> = {
  it: 'it-IT', es: 'es-ES', fr: 'fr-FR', la: 'it-IT',
  de: 'de-DE', en: 'en-GB', ru: 'ru-RU', ja: 'ja-JP',
  ko: 'ko-KR', zh: 'zh-CN', el: 'el-GR', hy: 'hy-AM', kbd: 'tr-TR',
}

export const FAMILY_COLORS = {
  roman:  { main: '#1565C0', bg: '#E3F2FD', label: 'Roman'  },
  germen: { main: '#2E7D32', bg: '#E8F5E9', label: 'Cermen' },
  slav:   { main: '#E65100', bg: '#FFF3E0', label: 'Slav'   },
  other:  { main: '#6A1B9A', bg: '#F3E5F5', label: 'Diğer'  },
}

export const CATEGORY_META: Record<Category, { label: string; containerColor: string; onColor: string }> = {
  verb:    { label: 'Fiil',   containerColor: '#DEE0FF', onColor: '#00006E' },
  noun:    { label: 'İsim',   containerColor: '#E1E0F9', onColor: '#191A2C' },
  adj:     { label: 'Sıfat',  containerColor: '#FFD8EE', onColor: '#2E1126' },
  phrase:  { label: 'İfade',  containerColor: '#C8E6C9', onColor: '#1B5E20' },
  grammar: { label: 'Gramer', containerColor: '#FFF3E0', onColor: '#E65100' },
}

export const COGNATE_TREES: Record<string, CognateTreeData> = {
  'amor-group': { root: 'Lat. amare',  children: ['it: amare', 'es: amar', 'fr: aimer', 'en: amour (ödünç)', 'el: αμόρε'] },
  'aqua-group': { root: 'Lat. aqua',   children: ['it: acqua', 'es: agua', 'fr: eau', 'en: aquatic (ödünç)'] },
  'beau-group': { root: 'Lat. bellus', children: ['it: bello', 'es: bello', 'fr: beau', 'en: belle (ödünç)'] },
}

// ── Expanded conjugation types ──────────────────────────────────────────
export type TenseName = 'Geniş Zaman' | 'Geçmiş Zaman' | 'Gelecek Zaman' | 'Dilek/Şart' | 'Emir' | 'Mastar'

export interface TenseData { tense: TenseName; rows: [string, string][] }
export interface VerbLangData { infinitive: string; tenses: TenseData[] }
export type VerbConjugations = Record<string, Partial<Record<LangCode, VerbLangData>>>

// Helper to build tense rows compactly
const t = (tense: TenseName, rows: [string,string][]): TenseData => ({ tense, rows })

export const VERB_CONJUGATIONS: VerbConjugations = {
  'to love': {
    it: { infinitive:'amare', tenses:[
      t('Geniş Zaman',[['io','amo'],['tu','ami'],['lui/lei','ama'],['noi','amiamo'],['voi','amate'],['loro','amano']]),
      t('Geçmiş Zaman',[['io','ho amato'],['tu','hai amato'],['lui/lei','ha amato'],['noi','abbiamo amato']]),
      t('Gelecek Zaman',[['io','amerò'],['tu','amerai'],['lui/lei','amerà'],['noi','ameremo'],['loro','ameranno']]),
      t('Dilek/Şart',[['io','amerei'],['tu','ameresti'],['lui/lei','amerebbe'],['noi','ameremmo']]),
      t('Emir',[['tu','ama!'],['Lei','ami!'],['noi','amiamo!'],['voi','amate!']]),
    ]},
    es: { infinitive:'amar', tenses:[
      t('Geniş Zaman',[['yo','amo'],['tú','amas'],['él/ella','ama'],['nosotros','amamos'],['vosotros','amáis'],['ellos','aman']]),
      t('Geçmiş Zaman',[['yo','amé'],['tú','amaste'],['él','amó'],['nosotros','amamos'],['ellos','amaron']]),
      t('Gelecek Zaman',[['yo','amaré'],['tú','amarás'],['él','amará'],['nosotros','amaremos']]),
      t('Dilek/Şart',[['yo','amaría'],['tú','amarías'],['nosotros','amaríamos']]),
      t('Emir',[['tú','¡ama!'],['usted','¡ame!'],['vosotros','¡amad!']]),
    ]},
    fr: { infinitive:'aimer', tenses:[
      t('Geniş Zaman',[["j'",'aime'],['tu','aimes'],['il/elle','aime'],['nous','aimons'],['vous','aimez'],['ils','aiment']]),
      t('Geçmiş Zaman',[["j'",'ai aimé'],['tu','as aimé'],['il','a aimé'],['nous','avons aimé']]),
      t('Gelecek Zaman',[["j'",'aimerai'],['tu','aimeras'],['il','aimera'],['nous','aimerons']]),
      t('Dilek/Şart',[["j'",'aimerais'],['tu','aimerais'],['il','aimerait']]),
      t('Emir',[['tu','aime!'],['nous','aimons!'],['vous','aimez!']]),
    ]},
    la: { infinitive:'amare', tenses:[
      t('Geniş Zaman',[['ego','amo'],['tu','amas'],['is/ea','amat'],['nos','amamus'],['vos','amatis'],['ei','amant']]),
      t('Geçmiş Zaman',[['ego','amavi'],['tu','amavisti'],['is','amavit'],['nos','amavimus'],['ei','amaverunt']]),
      t('Gelecek Zaman',[['ego','amabo'],['tu','amabis'],['is','amabit'],['nos','amabimus']]),
      t('Dilek/Şart',[['ego','amarem'],['tu','amares'],['is','amaret']]),
      t('Emir',[['sg.','ama!'],['pl.','amate!']]),
    ]},
    de: { infinitive:'lieben', tenses:[
      t('Geniş Zaman',[['ich','liebe'],['du','liebst'],['er/sie/es','liebt'],['wir','lieben'],['ihr','liebt'],['sie/Sie','lieben']]),
      t('Geçmiş Zaman',[['ich','liebte'],['du','liebtest'],['er','liebte'],['wir','liebten'],['sie','liebten']]),
      t('Gelecek Zaman',[['ich','werde lieben'],['du','wirst lieben'],['er','wird lieben'],['wir','werden lieben']]),
      t('Dilek/Şart',[['ich','würde lieben'],['du','würdest lieben'],['er','würde lieben']]),
      t('Emir',[['du','liebe!'],['ihr','liebt!'],['Sie','lieben Sie!']]),
    ]},
    en: { infinitive:'to love', tenses:[
      t('Geniş Zaman',[['I','love'],['you','love'],['he/she/it','loves'],['we','love'],['they','love']]),
      t('Geçmiş Zaman',[['I','loved'],['you','loved'],['he/she/it','loved'],['we','loved']]),
      t('Gelecek Zaman',[['I','will love'],['you','will love'],['he/she/it','will love'],['we','will love']]),
      t('Dilek/Şart',[['I','would love'],['you','would love'],['he/she','would love']]),
      t('Emir',[['—','Love!']]),
    ]},
    ru: { infinitive:'любить', tenses:[
      t('Geniş Zaman',[['я','люблю'],['ты','любишь'],['он/она','любит'],['мы','любим'],['вы','любите'],['они','любят']]),
      t('Geçmiş Zaman',[['м.р.','любил'],['ж.р.','любила'],['ср.р.','любило'],['мн.ч.','любили']]),
      t('Gelecek Zaman',[['я','буду любить'],['ты','будешь любить'],['он','будет любить']]),
      t('Dilek/Şart',[['м.р.','любил бы'],['ж.р.','любила бы']]),
      t('Emir',[['ты','люби!'],['вы','любите!']]),
    ]},
    ja: { infinitive:'愛する', tenses:[
      t('Geniş Zaman',[['丁寧','愛します'],['普通','愛する'],['否定','愛しない'],['丁寧否定','愛しません']]),
      t('Geçmiş Zaman',[['丁寧','愛しました'],['普通','愛した'],['否定過去','愛しなかった']]),
      t('Gelecek Zaman',[['意志','愛するつもりです'],['推量','愛するでしょう']]),
      t('Dilek/Şart',[['たら形','愛したら'],['ば形','愛すれば']]),
      t('Emir',[['命令','愛せ！'],['依頼','愛して']]),
    ]},
    ko: { infinitive:'사랑하다', tenses:[
      t('Geniş Zaman',[['존댓말','사랑합니다'],['반말','사랑해'],['부정','사랑 안 해']]),
      t('Geçmiş Zaman',[['존댓말','사랑했습니다'],['반말','사랑했어']]),
      t('Gelecek Zaman',[['존댓말','사랑할 것입니다'],['반말','사랑할 거야']]),
      t('Emir',[['존댓말','사랑하세요'],['반말','사랑해!']]),
    ]},
    zh: { infinitive:'爱 (ài)', tenses:[
      t('Geniş Zaman',[['肯定','我爱你'],['否定','我不爱'],['疑问','你爱吗？']]),
      t('Geçmiş Zaman',[['完成','我爱过'],['曾经','我曾经爱过']]),
      t('Gelecek Zaman',[['将来','我会爱'],['打算','我要爱']]),
      t('Emir',[['命令','去爱！'],['请求','请爱我']]),
    ]},
    el: { infinitive:'αγαπώ', tenses:[
      t('Geniş Zaman',[['εγώ','αγαπώ'],['εσύ','αγαπάς'],['αυτός/ή','αγαπά'],['εμείς','αγαπάμε'],['εσείς','αγαπάτε'],['αυτοί','αγαπούν']]),
      t('Geçmiş Zaman',[['εγώ','αγάπησα'],['εσύ','αγάπησες'],['αυτός','αγάπησε'],['εμείς','αγαπήσαμε']]),
      t('Gelecek Zaman',[['εγώ','θα αγαπώ'],['εσύ','θα αγαπάς']]),
      t('Emir',[['sg.','αγάπα!'],['pl.','αγαπάτε!']]),
    ]},
    hy: { infinitive:'սիրել', tenses:[
      t('Geniş Zaman',[['ես','սիրում եմ'],['դու','սիրում ես'],['նա','սիրում է'],['մենք','սիրում ենք']]),
      t('Geçmiş Zaman',[['ես','սիրեցի'],['դու','սիրեցիր'],['նա','սիրեց']]),
      t('Gelecek Zaman',[['ես','կսիրեմ'],['դու','կսիրես'],['նա','կսիրի']]),
    ]},
    kbd: { infinitive:'фIэлIыкIын', tenses:[
      t('Geniş Zaman',[['сэ','сэфIэлIыкI'],['уэ','уфIэлIыкI'],['абы','фIэлIыкI'],['дэ','дэфIэлIыкI']]),
      t('Geçmiş Zaman',[['сэ','сэфIэлIыкIащ'],['уэ','уфIэлIыкIащ']]),
    ]},
  },
  'to be': {
    it: { infinitive:'essere', tenses:[
      t('Geniş Zaman',[['io','sono'],['tu','sei'],['lui/lei','è'],['noi','siamo'],['voi','siete'],['loro','sono']]),
      t('Geçmiş Zaman',[['io','sono stato/a'],['tu','sei stato/a'],['lui','è stato'],['noi','siamo stati']]),
      t('Gelecek Zaman',[['io','sarò'],['tu','sarai'],['lui','sarà'],['noi','saremo'],['loro','saranno']]),
      t('Dilek/Şart',[['io','sarei'],['tu','saresti'],['lui','sarebbe'],['noi','saremmo']]),
      t('Emir',[['tu','sii!'],['Lei','sia!'],['noi','siamo!'],['voi','siate!']]),
    ]},
    es: { infinitive:'ser / estar', tenses:[
      t('Geniş Zaman',[['yo','soy / estoy'],['tú','eres / estás'],['él','es / está'],['nosotros','somos / estamos']]),
      t('Geçmiş Zaman',[['yo','fui / estuve'],['tú','fuiste / estuviste'],['él','fue / estuvo']]),
      t('Gelecek Zaman',[['yo','seré / estaré'],['tú','serás / estarás'],['él','será / estará']]),
      t('Dilek/Şart',[['yo','sería / estaría'],['tú','serías / estarías']]),
    ]},
    fr: { infinitive:'être', tenses:[
      t('Geniş Zaman',[['je','suis'],['tu','es'],['il/elle','est'],['nous','sommes'],['vous','êtes'],['ils','sont']]),
      t('Geçmiş Zaman',[["j'",'ai été'],['tu','as été'],['il','a été'],['nous','avons été']]),
      t('Gelecek Zaman',[['je','serai'],['tu','seras'],['il','sera'],['nous','serons']]),
      t('Dilek/Şart',[['je','serais'],['tu','serais'],['il','serait']]),
    ]},
    de: { infinitive:'sein', tenses:[
      t('Geniş Zaman',[['ich','bin'],['du','bist'],['er/sie/es','ist'],['wir','sind'],['ihr','seid'],['sie/Sie','sind']]),
      t('Geçmiş Zaman',[['ich','war'],['du','warst'],['er','war'],['wir','waren'],['sie','waren']]),
      t('Gelecek Zaman',[['ich','werde sein'],['du','wirst sein'],['er','wird sein'],['wir','werden sein']]),
      t('Dilek/Şart',[['ich','wäre'],['du','wärst'],['er','wäre'],['wir','wären']]),
    ]},
    en: { infinitive:'to be', tenses:[
      t('Geniş Zaman',[['I','am'],['you','are'],['he/she/it','is'],['we','are'],['they','are']]),
      t('Geçmiş Zaman',[['I','was'],['you','were'],['he/she/it','was'],['we','were'],['they','were']]),
      t('Gelecek Zaman',[['I','will be'],['you','will be'],['he/she/it','will be'],['we','will be']]),
      t('Dilek/Şart',[['I','would be'],['you','would be'],['he/she','would be']]),
    ]},
    ru: { infinitive:'быть', tenses:[
      t('Geniş Zaman',[['(опускается)','—'],['он','есть (редко)']]),
      t('Geçmiş Zaman',[['м.р.','был'],['ж.р.','была'],['ср.р.','было'],['мн.ч.','были']]),
      t('Gelecek Zaman',[['я','буду'],['ты','будешь'],['он','будет'],['мы','будем'],['они','будут']]),
      t('Dilek/Şart',[['м.р.','был бы'],['ж.р.','была бы']]),
    ]},
    ja: { infinitive:'だ / です', tenses:[
      t('Geniş Zaman',[['丁寧','です'],['普通','だ'],['否定丁寧','ではありません'],['否定普通','じゃない']]),
      t('Geçmiş Zaman',[['丁寧','でした'],['普通','だった'],['否定丁寧','ではありませんでした']]),
      t('Dilek/Şart',[['たら','だったら'],['なら','なら']]),
    ]},
    ko: { infinitive:'이다 / 있다', tenses:[
      t('Geniş Zaman',[['존댓말','입니다 / 있습니다'],['반말','이야 / 있어'],['부정','아닙니다 / 없습니다']]),
      t('Geçmiş Zaman',[['존댓말','이었습니다 / 있었습니다'],['반말','이었어 / 있었어']]),
      t('Gelecek Zaman',[['존댓말','일 것입니다'],['반말','일 거야']]),
    ]},
    zh: { infinitive:'是 / 有', tenses:[
      t('Geniş Zaman',[['肯定','是 / 有'],['否定','不是 / 没有'],['疑问','是吗？']]),
      t('Geçmiş Zaman',[['过去','曾是 / 曾有'],['完成','已经是 / 已经有']]),
      t('Gelecek Zaman',[['将来','将是 / 将有']]),
    ]},
    el: { infinitive:'είμαι', tenses:[
      t('Geniş Zaman',[['εγώ','είμαι'],['εσύ','είσαι'],['αυτός/ή','είναι'],['εμείς','είμαστε'],['εσείς','είστε'],['αυτοί','είναι']]),
      t('Geçmiş Zaman',[['εγώ','ήμουν'],['εσύ','ήσουν'],['αυτός','ήταν'],['εμείς','ήμαστε']]),
      t('Gelecek Zaman',[['εγώ','θα είμαι'],['εσύ','θα είσαι'],['αυτός','θα είναι']]),
    ]},
    hy: { infinitive:'լինել', tenses:[
      t('Geniş Zaman',[['ես','եմ'],['դու','ես'],['նա','է'],['մենք','ենք'],['դուք','եք'],['նրանք','են']]),
      t('Geçmiş Zaman',[['ես','էի'],['դու','էիր'],['նա','էր'],['մենք','էինք']]),
      t('Gelecek Zaman',[['ես','կլինեմ'],['դու','կլինես'],['նա','կլինի']]),
    ]},
    kbd: { infinitive:'щIын', tenses:[
      t('Geniş Zaman',[['сэ','сэщI'],['уэ','ущI'],['абы','щI'],['дэ','дэщI']]),
      t('Geçmiş Zaman',[['сэ','сэщIащ'],['уэ','ущIащ'],['абы','щIащ']]),
    ]},
  },
  'to go': {
    it: { infinitive:'andare', tenses:[
      t('Geniş Zaman',[['io','vado'],['tu','vai'],['lui/lei','va'],['noi','andiamo'],['voi','andate'],['loro','vanno']]),
      t('Geçmiş Zaman',[['io','sono andato/a'],['tu','sei andato/a'],['lui','è andato'],['noi','siamo andati']]),
      t('Gelecek Zaman',[['io','andrò'],['tu','andrai'],['lui','andrà'],['noi','andremo'],['loro','andranno']]),
      t('Dilek/Şart',[['io','andrei'],['tu','andresti'],['lui','andrebbe']]),
      t('Emir',[["tu","va'!"],['Lei','vada!'],['noi','andiamo!'],['voi','andate!']]),
    ]},
    es: { infinitive:'ir', tenses:[
      t('Geniş Zaman',[['yo','voy'],['tú','vas'],['él','va'],['nosotros','vamos'],['vosotros','vais'],['ellos','van']]),
      t('Geçmiş Zaman',[['yo','fui'],['tú','fuiste'],['él','fue'],['nosotros','fuimos'],['ellos','fueron']]),
      t('Gelecek Zaman',[['yo','iré'],['tú','irás'],['él','irá'],['nosotros','iremos']]),
      t('Dilek/Şart',[['yo','iría'],['tú','irías'],['él','iría']]),
      t('Emir',[['tú','¡ve!'],['usted','¡vaya!'],['nosotros','¡vamos!'],['vosotros','¡id!']]),
    ]},
    fr: { infinitive:'aller', tenses:[
      t('Geniş Zaman',[['je','vais'],['tu','vas'],['il/elle','va'],['nous','allons'],['vous','allez'],['ils','vont']]),
      t('Geçmiş Zaman',[['je','suis allé(e)'],['tu','es allé(e)'],['il','est allé'],['nous','sommes allés']]),
      t('Gelecek Zaman',[['je','irai'],['tu','iras'],['il','ira'],['nous','irons'],['ils','iront']]),
      t('Dilek/Şart',[['je','irais'],['tu','irais'],['il','irait']]),
      t('Emir',[['tu','va!'],['nous','allons!'],['vous','allez!']]),
    ]},
    de: { infinitive:'gehen', tenses:[
      t('Geniş Zaman',[['ich','gehe'],['du','gehst'],['er/sie/es','geht'],['wir','gehen'],['ihr','geht'],['sie/Sie','gehen']]),
      t('Geçmiş Zaman',[['ich','ging'],['du','gingst'],['er','ging'],['wir','gingen'],['sie','gingen']]),
      t('Gelecek Zaman',[['ich','werde gehen'],['du','wirst gehen'],['er','wird gehen'],['wir','werden gehen']]),
      t('Dilek/Şart',[['ich','würde gehen'],['du','würdest gehen'],['er','würde gehen']]),
      t('Emir',[['du','geh!'],['ihr','geht!'],['Sie','gehen Sie!']]),
    ]},
    en: { infinitive:'to go', tenses:[
      t('Geniş Zaman',[['I','go'],['you','go'],['he/she/it','goes'],['we','go'],['they','go']]),
      t('Geçmiş Zaman',[['I','went'],['you','went'],['he/she/it','went'],['we','went'],['they','went']]),
      t('Gelecek Zaman',[['I','will go'],['you','will go'],['he/she/it','will go'],['we','will go']]),
      t('Dilek/Şart',[['I','would go'],['you','would go'],['he/she','would go']]),
      t('Emir',[['—','Go!']]),
    ]},
    ru: { infinitive:'идти / ходить', tenses:[
      t('Geniş Zaman',[['я','иду / хожу'],['ты','идёшь / ходишь'],['он/она','идёт / ходит'],['мы','идём / ходим'],['они','идут / ходят']]),
      t('Geçmiş Zaman',[['м.р.','шёл / ходил'],['ж.р.','шла / ходила'],['мн.ч.','шли / ходили']]),
      t('Gelecek Zaman',[['я','пойду / буду ходить'],['ты','пойдёшь'],['он','пойдёт']]),
      t('Emir',[['ты','иди! / ходи!'],['вы','идите! / ходите!']]),
    ]},
    ja: { infinitive:'行く (いく)', tenses:[
      t('Geniş Zaman',[['丁寧','行きます'],['普通','行く'],['否定丁寧','行きません'],['否定普通','行かない']]),
      t('Geçmiş Zaman',[['丁寧','行きました'],['普通','行った'],['否定丁寧','行きませんでした']]),
      t('Gelecek Zaman',[['意志','行くつもりです'],['推量','行くでしょう']]),
      t('Emir',[['命令','行け！'],['依頼','行ってください']]),
    ]},
    ko: { infinitive:'가다', tenses:[
      t('Geniş Zaman',[['존댓말','갑니다'],['반말','가'],['부정','안 가']]),
      t('Geçmiş Zaman',[['존댓말','갔습니다'],['반말','갔어'],['부정','안 갔어']]),
      t('Gelecek Zaman',[['존댓말','갈 것입니다'],['반말','갈 거야']]),
      t('Emir',[['존댓말','가세요'],['반말','가!']]),
    ]},
    zh: { infinitive:'去 (qù)', tenses:[
      t('Geniş Zaman',[['肯定','去'],['否定','不去'],['进行','在去']]),
      t('Geçmiş Zaman',[['完成','去过'],['结果','去了'],['否定','没去']]),
      t('Gelecek Zaman',[['打算','要去'],['将来','会去']]),
      t('Emir',[['命令','去！'],['请求','请去']]),
    ]},
    el: { infinitive:'πηγαίνω', tenses:[
      t('Geniş Zaman',[['εγώ','πηγαίνω'],['εσύ','πηγαίνεις'],['αυτός/ή','πηγαίνει'],['εμείς','πηγαίνουμε'],['εσείς','πηγαίνετε'],['αυτοί','πηγαίνουν']]),
      t('Geçmiş Zaman',[['εγώ','πήγα'],['εσύ','πήγες'],['αυτός','πήγε'],['εμείς','πήγαμε']]),
      t('Gelecek Zaman',[['εγώ','θα πάω'],['εσύ','θα πας'],['αυτός','θα πάει']]),
      t('Emir',[['sg.','πήγαινε!'],['pl.','πηγαίνετε!']]),
    ]},
    hy: { infinitive:'գնալ', tenses:[
      t('Geniş Zaman',[['ես','գնում եմ'],['դու','գնում ես'],['նա','գնում է'],['մենք','գնում ենք']]),
      t('Geçmiş Zaman',[['ես','գնացի'],['դու','գնացիր'],['նա','գնաց'],['մենք','գնացինք']]),
      t('Gelecek Zaman',[['ես','կգնամ'],['դու','կգնաս'],['նա','կգնա']]),
      t('Emir',[['sg.','գնա!'],["pl.","գնացե'ք!"]]),
    ]},
    kbd: { infinitive:'кIуэн', tenses:[
      t('Geniş Zaman',[['сэ','сокIуэ'],['уэ','укIуэ'],['абы','кIуэ'],['дэ','докIуэ']]),
      t('Geçmiş Zaman',[['сэ','сыкIуащ'],['уэ','укIуащ'],['абы','кIуащ']]),
    ]},
  },
}

export const GRAMMAR_STAGES: GramStage[] = [
  { title:'Temel cümle yapısı', subtitle:'SVO / SOV düzeni', langs:[
    { code:'it', flag:'🇮🇹', name:'İtalyanca',  family:'roman',  steps:['Özne (S)','Fiil (V)','Nesne (O)'], example:'La ragazza mangia il pane.' },
    { code:'es', flag:'🇪🇸', name:'İspanyolca', family:'roman',  steps:['Özne (S)','Fiil (V)','Nesne (O)'], example:'La chica come el pan.' },
    { code:'de', flag:'🇩🇪', name:'Almanca',    family:'germen', steps:['Özne (S)','Fiil (V2)','Nesne (O)','→ yan cümlede SOV'], example:'Das Mädchen isst das Brot.' },
    { code:'ja', flag:'🇯🇵', name:'Japonca',    family:'other',  steps:['Özne (S)','Nesne (O)','Fiil (V) — sonda'], example:'女の子がパンを食べます。' },
    { code:'ru', flag:'🇷🇺', name:'Rusça',      family:'slav',   steps:['SVO temel','Esnek sıra (vurguya göre)','Hal ekleri belirler'], example:'Девочка ест хлеб.' },
    { code:'zh', flag:'🇨🇳', name:'Çince',      family:'other',  steps:['SVO (katı sıra)','Hal eki yok','Zaman zarfı başa gelir'], example:'女孩吃面包。' },
  ]},
  { title:'Hal sistemi', subtitle:'İsim çekimi', langs:[
    { code:'de', flag:'🇩🇪', name:'Almanca', family:'germen', steps:['Nominatif (özne)','Akkusatif (nesne)','Dativ (dolaylı)','Genitif (iyelik)'], example:'des Mannes — dem Mann — den Mann' },
    { code:'ru', flag:'🇷🇺', name:'Rusça',   family:'slav',   steps:['6 hal: nom, gen, dat, akk, enstr, prep','Cinsiyet × hal matrisi'], example:'книга → книги → книге → книгу → книгой → книге' },
    { code:'la', flag:'🏛️',  name:'Latince', family:'roman',  steps:['6 hal + vokativ','5 isim deklinasyonu','Cinsiyet: m/f/n'], example:'aqua — aquae — aquae — aquam — aquā — aqua' },
    { code:'el', flag:'🇬🇷', name:'Yunanca', family:'other',  steps:['4 hal: nom, gen, dat, akk','3 cinsiyet'], example:'νερό — νερού — νερώ — νερό' },
  ]},
  { title:'Fiil çekim sistemi', subtitle:'Kişi, zaman, görünüş', langs:[
    { code:'it', flag:'🇮🇹', name:'İtalyanca', family:'roman',  steps:['-are / -ere / -ire grupları','Passato prossimo','Imperfetto','Congiuntivo'], example:'amo → amavo → ho amato → ami' },
    { code:'ru', flag:'🇷🇺', name:'Rusça',     family:'slav',   steps:['Aspect çifti (perf/imperf)','6 kişi çekimi','Cinsiyete göre geçmiş'], example:'читать (imperf) ↔ прочитать (perf)' },
    { code:'ja', flag:'🇯🇵', name:'Japonca',   family:'other',  steps:['u-fiil / ru-fiil / düzensiz','Kibarca form (-masu)','te-formu','Potansiyel / pasif'], example:'食べる → 食べます → 食べた → 食べられる' },
    { code:'de', flag:'🇩🇪', name:'Almanca',   family:'germen', steps:['Güçlü/zayıf fiiller','Yardımcı: haben/sein','Partizip II','Konjunktiv II'], example:'lieben → liebte → hat geliebt → würde lieben' },
  ]},
]

export const BADGES: Badge[] = [
  { id:'first',   icon:'🌱', label:'İlk kavram',          earned:true,  desc:'İlk kavramını ekledin',           xp:50  },
  { id:'poly5',   icon:'🗣️', label:'Polyglot başlangıcı', earned:true,  desc:'5 dilde kelime öğrendin',          xp:100 },
  { id:'streak7', icon:'🔥', label:'7 günlük seri',        earned:true,  desc:'7 gün üst üste çalıştın',          xp:200 },
  { id:'cognate', icon:'🔗', label:'Cognate avcısı',       earned:true,  desc:'İlk cognate grubunu oluşturdun',  xp:150 },
  { id:'roman',   icon:'🏛️', label:'Roman uzmanı',         earned:false, desc:'Tüm Roman dillerini tamamla',      xp:300 },
  { id:'fc50',    icon:'🃏', label:'Flashcard ustası',      earned:false, desc:'50 flashcard tamamla',             xp:250 },
  { id:'grammar', icon:'📖', label:'Gramer kaşifi',         earned:false, desc:'Tüm gramer aşamalarını geç',       xp:400 },
  { id:'all13',   icon:'🌍', label:'13 Dil',               earned:false, desc:'Tüm dillerde en az 1 kelime ekle', xp:500 },
]

export const DEFAULT_SETTINGS: AppSettings = {
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'qwen2.5:7b',
  visibleLangs: LANGS.map(l => l.code),
  darkMode: false,
}
