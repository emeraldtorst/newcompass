export type Language = 'en' | 'de' | 'ru' | 'tr';

export interface WasteItem {
  emoji: string;
  icon: string;
  color: 'blue' | 'yellow' | 'green' | 'gray' | 'purple' | 'red' | 'brown';
  bin: string;
  category: 'glass' | 'plastic' | 'paper' | 'residual' | 'bio' | 'hazardous' | 'bulky';
  instructions: string;
}

export interface WasteDatabase {
  [key: string]: WasteItem;
}

export interface Mistplatz {
  district: string;
  name: string;
  address: string;
}

export interface TranslationSetProps {
  navProblem: string;
  navGuide: string;
  navMap: string;
  navJoin: string;
  navQuizzes: string;
  quizSectionTitle: string;
  quizSectionSub: string;
  quizSectionDesc: string;
  quiz1Title: string;
  quiz1Desc: string;
  quiz2Title: string;
  quiz2Desc: string;
  quiz3Title: string;
  quiz3Desc: string;
  quizStartBtn: string;
  heroTitle: string;
  heroSubTitle: string;
  heroStartBtn: string;
  heroWhyBtn: string;
  whyTitle: string;
  whySubTitle: string;
  whyDesc: string;
  probComplexTitle: string;
  probComplexDesc: string;
  probLanguageTitle: string;
  probLanguageDesc: string;
  probMapTitle: string;
  probMapDesc: string;
  superTitle: string;
  superSubTitle: string;
  superDesc: string;
  superEnTitle: string;
  superEnDesc: string;
  superRuTitle: string;
  superRuDesc: string;
  superTrTitle: string;
  superTrDesc: string;
  visualTitle: string;
  visualDesc: string;
  guideTitle: string;
  guideSubTitle: string;
  guideDesc: string;
  searchPlaceholder: string;
  searchDisclaimer: string;
  searchBtn: string;
  catGlass: string;
  catGlassSub: string;
  catPlastic: string;
  catPlasticSub: string;
  catPaper: string;
  catPaperSub: string;
  catResidual: string;
  catResidualSub: string;
  catBio: string;
  catBioSub: string;
  catHazardous: string;
  catHazardousSub: string;
  catBulky: string;
  catBulkySub: string;
  downloadTitle: string;
  downloadSub: string;
  downloadBtnEn: string;
  downloadBtnRu: string;
  downloadBtnTr: string;
  downloadBtnDe: string;
  faqTitle: string;
  faqSub: string;
  faqDesc: string;
  mapTitle: string;
  mapSub: string;
  mapDesc: string;
  tblDistrict: string;
  tblName: string;
  tblAddress: string;
  socialTitle: string;
  socialSub: string;
  socialDesc: string;
  socialInstDesc: string;
  socialFbDesc: string;
  socialProjDesc: string;
  communityTitle: string;
  communitySub: string;
  communityDesc: string;
  emailPlaceholder: string;
  subscribeBtn: string;
  pvtSubscribeSuccess: string;
  projAboutTitle: string;
  projAboutSub: string;
  projAboutDesc: string;
  projAboutBadge: string;
  projAboutBtn: string;
  footerAbout: string;
  footerSlogan: string;
  footerAboutDesc: string;
  footerStayUpdated: string;
  footerLinks: string;
  footerResources: string;
  footerCookie: string;
  footerPrivacy: string;
  footerTerms: string;
}

export interface Translations {
  [lang: string]: TranslationSetProps;
}
