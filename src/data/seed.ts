/**
 * Dikey dilim icin guvenli, klinik incelemeye uygun ornek icerik.
 *
 * Bu icerik yapay zeka uretiminin YERINE GECMEK icin degil, model henuz bagli
 * degilken calisan bir yedek deneyim saglamak icindir (README bolum 14 - guvenli
 * yedek deneyim). Lisansli kitap metinleri KOPYALANMAZ (README bolum 10).
 */

import type {
  GoalArea,
  GoalTemplate,
  GoalTier,
  MotivationHint,
  ProbableFuture,
} from '../types';

export interface GoalAreaMeta {
  area: GoalArea;
  label: string;
  emoji: string;
  possibleFuture: string; // ornek gelecek ihtimali
  northStarPrompt: string;
}

/** Hedef alanlari (README bolum 3 tablosu). */
export const GOAL_AREAS: GoalAreaMeta[] = [
  {
    area: 'exam',
    label: 'Sinav ve ogrenme',
    emoji: '📚',
    possibleFuture: 'Istedigi bolume hazirlanmis, calisma duzeni kurmus ben',
    northStarPrompt: 'Alti ay sonra hangi calisma davranislarini daha dogal yapan biri olmak istersin?',
  },
  {
    area: 'career',
    label: 'Kariyer ve uretim',
    emoji: '💼',
    possibleFuture: 'Portfoyu ve gorunurlugu artmis profesyonel ben',
    northStarPrompt: 'Alti ay sonra ne uretiyor olmak seni sana yakinlastirir?',
  },
  {
    area: 'movement',
    label: 'Hareket ve iyi olus',
    emoji: '🌿',
    possibleFuture: 'Daha hareketli ve bedenine ozen gosteren ben',
    northStarPrompt: 'Alti ay sonra bedeninle iliskinde neyi daha kolay yapiyor olmak istersin?',
  },
  {
    area: 'home',
    label: 'Ev ve duzen',
    emoji: '🏡',
    possibleFuture: 'Yasam alanini yonetebilen sakin ben',
    northStarPrompt: 'Alti ay sonra evinde hangi duzeni daha dogal surduruyor olmak istersin?',
  },
  {
    area: 'parenting',
    label: 'Ebeveynlik ve iliskiler',
    emoji: '🤝',
    possibleFuture: 'Daha mevcut, sabirli ve tutarli ben',
    northStarPrompt: 'Alti ay sonra iliskilerinde hangi ani daha sik yasiyor olmak istersin?',
  },
  {
    area: 'selfcare',
    label: 'Oz bakim ve yasam duzeni',
    emoji: '✨',
    possibleFuture: 'Kendine verdigi sozleri daha sik tutan ben',
    northStarPrompt: 'Alti ay sonra kendine verdigin hangi sozu daha sik tutuyor olmak istersin?',
  },
];

export function goalAreaMeta(area: GoalArea): GoalAreaMeta {
  return GOAL_AREAS.find((a) => a.area === area) ?? GOAL_AREAS[0];
}

/** Her alan icin uc kademeden hedef sablonlari (README bolum 3 gunluk kanit ornekleri). */
export const GOAL_TEMPLATES: GoalTemplate[] = [
  // Sinav ve ogrenme
  {
    area: 'exam',
    tier: 'mainBridge',
    title: '25 dakika odaklanmis calisma',
    why: 'Duzenli calisma, hazir bene giden ana kopru',
    completionCriteria: '25 dakika kesintisiz odak (tek konu)',
    durationMinutes: 25,
    difficulty: 'standard',
    minimumVersion: 'Kitabi ac ve 5 dakika oku',
    suggestedTime: '19:00',
    trigger: 'Aksam yemeginden sonra masaya otur',
  },
  {
    area: 'exam',
    tier: 'supportStep',
    title: '20 soru coz',
    why: 'Uygulama, ogrenmeyi pekistirir',
    completionCriteria: '20 soru ve kisa yanlis analizi',
    durationMinutes: 20,
    difficulty: 'standard',
    minimumVersion: '5 soru coz',
  },
  {
    area: 'exam',
    tier: 'minimumEvidence',
    title: 'Yarinki konuyu sec',
    why: 'Kucuk hazirlik, yarini kolaylastirir',
    completionCriteria: 'Yarin calisilacak tek konuyu yaz',
    difficulty: 'gentle',
    minimumVersion: 'Tek satir not',
  },
  // Kariyer ve uretim
  {
    area: 'career',
    tier: 'mainBridge',
    title: 'Bir icerik taslagi yaz',
    why: 'Gorunurluk, profesyonel bene giden kopru',
    completionCriteria: 'Kisa bir taslak (giris + 3 madde)',
    durationMinutes: 25,
    difficulty: 'standard',
    minimumVersion: 'Tek paragraf fikir notu',
    suggestedTime: '10:00',
    trigger: 'Sabah kahvesiyle birlikte',
  },
  {
    area: 'career',
    tier: 'supportStep',
    title: '20 dakika beceri calismasi',
    why: 'Kucuk ama duzenli ustalik',
    completionCriteria: '20 dakika odakli pratik',
    durationMinutes: 20,
    difficulty: 'standard',
    minimumVersion: '5 dakika izle/oku',
  },
  {
    area: 'career',
    tier: 'minimumEvidence',
    title: 'Bir baglantiya ulas',
    why: 'Ag, firsatlari acar',
    completionCriteria: 'Bir kisiye kisa ve samimi mesaj',
    difficulty: 'gentle',
    minimumVersion: 'Bir kisinin adini not et',
  },
  // Hareket ve iyi olus (beden-notr dil; kilo/olcu hedefi yok - README bolum 3 ve 17)
  {
    area: 'movement',
    tier: 'mainBridge',
    title: '30 dakika tempolu yuruyus',
    why: 'Hareket, bedenine ozen gosteren bene yaklastirir',
    completionCriteria: '30 dakika yuruyus',
    durationMinutes: 30,
    difficulty: 'standard',
    minimumVersion: 'Ayakkabiyi giy ve 7 dakika yuru',
    suggestedTime: '18:00',
    trigger: 'Saat 18.00 oldugunda ayakkabiyi giy',
  },
  {
    area: 'movement',
    tier: 'supportStep',
    title: 'Gun icinde su molasi',
    why: 'Kucuk oz bakim davranisi',
    completionCriteria: 'Gun boyu 3 su molasi',
    difficulty: 'gentle',
    minimumVersion: '1 bardak su ic',
  },
  {
    area: 'movement',
    tier: 'minimumEvidence',
    title: 'Uyku saatini isaretle',
    why: 'Duzenli uyku, enerjiyi toparlar',
    completionCriteria: 'Yatma saatini not et',
    difficulty: 'gentle',
    minimumVersion: 'Tek satir not',
  },
  // Ev ve duzen
  {
    area: 'home',
    tier: 'mainBridge',
    title: 'Tek bir yuzeyi topla',
    why: 'Yonetilebilir duzen, sakin bene giden kopru',
    completionCriteria: 'Bir masa/tezgah yuzeyini bosalt',
    durationMinutes: 15,
    difficulty: 'standard',
    minimumVersion: 'Bes dakikalik yuzey toplama',
    suggestedTime: '20:00',
  },
  {
    area: 'home',
    tier: 'supportStep',
    title: 'Camasir baslat',
    why: 'Kucuk sistem, birikimi onler',
    completionCriteria: 'Bir makine camasir baslat',
    difficulty: 'gentle',
    minimumVersion: 'Camasirlari sepete topla',
  },
  {
    area: 'home',
    tier: 'minimumEvidence',
    title: 'Tek cekmece duzeni',
    why: 'Kucuk kazanim, motivasyon dogurur',
    completionCriteria: 'Bir cekmeceyi duzenle',
    difficulty: 'gentle',
    minimumVersion: 'Bir esyayi yerine koy',
  },
  // Ebeveynlik ve iliskiler
  {
    area: 'parenting',
    tier: 'mainBridge',
    title: '10 dakika bolunmemis ilgi',
    why: 'Mevcut olmak, iliskinin ana koprusu',
    completionCriteria: '10 dakika telefonsuz birlikte zaman',
    durationMinutes: 10,
    difficulty: 'standard',
    minimumVersion: '2 dakika goz temasiyla dinle',
    suggestedTime: '19:30',
  },
  {
    area: 'parenting',
    tier: 'supportStep',
    title: 'Kucuk bir onarim konusmasi',
    why: 'Kucuk onarim, bagi guclendirir',
    completionCriteria: 'Bir yakininla kisa, sicak bir konusma',
    difficulty: 'gentle',
    minimumVersion: 'Tek bir tesekkur mesaji',
  },
  {
    area: 'parenting',
    tier: 'minimumEvidence',
    title: 'Bir takdir cumlesi',
    why: 'Fark etmek, iliskiyi besler',
    completionCriteria: 'Bir yakinina somut bir takdir soyle',
    difficulty: 'gentle',
    minimumVersion: 'Icinden bir takdir dusun ve not et',
  },
  // Oz bakim ve yasam duzeni
  {
    area: 'selfcare',
    tier: 'mainBridge',
    title: 'Sabah rutinini tamamla',
    why: 'Kendine verdigin soz, gunu kurar',
    completionCriteria: 'Sectigin 3 adimlik sabah rutini',
    durationMinutes: 15,
    difficulty: 'standard',
    minimumVersion: 'Rutinin tek adimini yap',
    suggestedTime: '08:00',
  },
  {
    area: 'selfcare',
    tier: 'supportStep',
    title: 'Ekran sinirini uygula',
    why: 'Sinir, enerjiyi korur',
    completionCriteria: 'Belirledigin saatte ekrani birak',
    difficulty: 'gentle',
    minimumVersion: '10 dakika ekransiz mola',
  },
  {
    area: 'selfcare',
    tier: 'minimumEvidence',
    title: 'Kisa gunluk',
    why: 'Kucuk yansima, farkindalik verir',
    completionCriteria: 'Uc cumlelik gunluk',
    difficulty: 'gentle',
    minimumVersion: 'Tek cumle yaz',
  },
];

/** Gelecekteki benlik sesi (README bolum 8 - Konusma sozlesmesi). */
export const FUTURE_SELF = {
  /** Sabah karsilamasi (README bolum 5 ornek mesaji). */
  morning: (name?: string): string =>
    `${name ? name + ', g' : 'G'}unaydin. Ben, bugun attigin kucuk adimlar devam ederse ` +
    'yaklasabilecegin benligim. Bugun kusursuz olman gerekmiyor. Bana uc kanit gonder: ' +
    'bir ana adim, bir destek adimi ve zor bir gun icin en kucuk adim.',

  /** Kademeye gore tamamlama yansimasi - kimlik diliyle, ovguyu davranisa baglar. */
  onComplete: (tier: GoalTier): string => {
    switch (tier) {
      case 'minimumEvidence':
        return 'Kucuk bir kanit gonderdin ve bu sifirdan cok daha buyuk. Zor gunde bile ' +
          'geri donebilen biri oluyorsun.';
      case 'supportStep':
        return 'Destek adimini tamamladin. Bu tur adimlar, ana koprulari daha kolay hale getirir.';
      case 'mainBridge':
        return 'Bugunun ana koprusunu gectin. Bu davranisi surdurursen, konustugumuz ihtimale ' +
          'biraz daha yaklasiyorsun.';
    }
  },

  /** Gun sonu kapanisi (yargisiz). */
  evening: 'Bugun ne olduysa oldu. Birlikte kaniti ve engeli gorelim; yarini bir tık kolaylastiralim.',

  /** Bos gunun ardindan donus (bag yeniden kurma). */
  comeback: 'Yol silinmedi. Bugun tek bir kucuk basamakla yeniden baslayabilirsin.',
} as const;

/** Olasilik Odasi rotalari (README bolum 8). Sablon; alan adiyla kisisellestirilir. */
export function possibleFuturesFor(area: GoalArea): ProbableFuture[] {
  const meta = goalAreaMeta(area);
  return [
    {
      id: `${area}:direct`,
      kind: 'direct',
      title: 'Dogrudan rota',
      description: `${meta.possibleFuture}. Kosullar plandaki gibi giderse bu yola en yakin oldugun rota.`,
      controllables: ['Gunluk uc kucuk adim', 'Haftalik yeniden ayar', 'Engel cikinca kucultme'],
      uncertainties: ['Dis kosullarin degismesi', 'Zamanlamanin herkes icin ayni olmamasi'],
    },
    {
      id: `${area}:adapted`,
      kind: 'adapted',
      title: 'Uyarlanmis rota',
      description: 'Zaman, enerji veya kaynak daha kisitliysa da ayni yone giden daha yumusak rota.',
      controllables: ['Minimum surumleri secme', 'Mola modunu kullanma', 'Kucuk deneyler'],
      uncertainties: ['Yogun donemler', 'Bakim ve sorumluluk yuku'],
    },
    {
      id: `${area}:surprise`,
      kind: 'surprise',
      title: 'Surpriz rota',
      description: 'Gelistirdigin becerinin beklenmedik ama degerlerinle uyumlu bir firsata acilmasi.',
      controllables: ['Merakli kalma', 'Kucuk gorunurluk adimlari'],
      uncertainties: ['Firsatin ne zaman gelecegi', 'Kontrol disi tesaduefler'],
    },
  ];
}

/** Motivasyon ipuclari havuzu (README bolum 4.2 - olasilik olarak sunulur). */
export const MOTIVATION_HINTS: MotivationHint[] = [
  {
    patternId: 'achievement',
    label: 'Basari ve gorunur ilerleme',
    confidence: 0.62,
    approach: 'Net kilometre taslari, ustalik rozeti, somut kanit',
    avoid: 'Sadece siralama ve dis onay',
    confirmedByUser: null,
  },
  {
    patternId: 'security',
    label: 'Guvenlik ve belirsizligi azaltma',
    confidence: 0.55,
    approach: 'Plan B, kucuk deney, hazirlik cumlesi',
    avoid: 'Kesin gelecek iddiasi',
    confirmedByUser: null,
  },
  {
    patternId: 'depth',
    label: 'Derinlik ve anlam',
    confidence: 0.48,
    approach: 'Gunluk, duygu dili, kisisel semboller',
    avoid: 'Yapay pozitiflik',
    confirmedByUser: null,
  },
];

/** BDT bilissel carpitma etiketleri (README bolum 9 - ozgun, kitaptan kopya degil). */
export const COGNITIVE_DISTORTIONS: string[] = [
  'Ya hep ya hic dusuncesi',
  'Felaketlestirme',
  'Zihin okuma',
  'Etiketleme',
  'Meli/malicilik',
  'Olumluyu gecersiz kilma',
  'Duygusal cikarim',
];

/** Dusunce Laboratuvari baslangic ornegi (README bolum 9 tablosu). */
export const THOUGHT_LAB_EXAMPLE = {
  situation: 'Aksam oldu, bir saatlik yuruyus hala yapilmadi',
  automaticThought: 'Bir saat yapamayacaksam hic anlami yok',
  distortion: 'Ya hep ya hic dusuncesi',
  emotion: 'Sucluluk, kacinma',
  behavior: 'Telefona yonelme',
  balancedThought: 'Bugun sureyi degil, geri donme davranisini calisabilirim',
  experiment: 'Ayakkabiyi giy ve 7 dakika yuru',
  learning: 'Baslamak dusundugumden daha kolaydi; kucuk adim gunu kurtardi',
} as const;
