import type { Translator } from "@/i18n/LanguageProvider";

export type Slide = { title: string; subtitle?: string; body?: string; note?: string; bullets?: string[]; image?: string; hero?: boolean; final?: boolean; maps?: boolean; gallery?: "current" | "vision" | "case"; links?: {label: string; href: string}[] };

export function createFundingSlides(t: Translator): Slide[] { return [
{
"title": t("projectTitle"),
"subtitle": t("projectSubtitle"),
"image": "/images/project/street-panorama.jpg",
"hero": true
},
{
"title": t("historyTitle"),
"body": t("historyBody"),
"note": t("historyNote"),
"image": "/images/project/heritage-houses.jpg"
},
{
"title": t("scopeTitle"),
"body": t("scopeBody"),
"maps": true,
"links": [
{
"label": t("openMap"),
"href": "https://maps.app.goo.gl/j4iYpC28rDVmQSAo6"
}
]
},
{
"title": t("conditionsTitle"),
"body": t("conditionsBody"),
"gallery": "current"
},
{
"title": t("riskTitle"),
"bullets": [
t("riskDetails"),
t("riskNeglect"),
t("riskMoisture"),
t("riskLoss")
],
"note": t("riskNote"),
"image": "/images/project/street-wires.jpg"
},
{
"title": t("visionTitle"),
"body": t("visionBody"),
"note": t("visionNote"),
"gallery": "vision"
},
{
"title": t("caseTitle"),
"body": t("caseShortBody"),
"gallery": "case"
},
{
"title": t("phaseTitle"),
"body": t("phaseBody"),
"bullets": [
t("phaseAssess"),
t("phaseApprove"),
t("phaseWork")
],
"note": t("phaseNote"),
"image": "/images/heritage-street/heritage-street-current-03.jpg"
},
{
"title": t("digitalTitle"),
"bullets": [
t("digital3d"),
t("digitalVisual"),
t("digitalArchive")
],
"body": t("digitalBody"),
"image": "/images/heritage-street/heritage-details-01.jpg"
},
{
"title": t("legalTitle"),
"bullets": [
t("legalHeritage"),
t("legalProperty"),
t("legalWorks"),
t("legalData")
],
"note": t("legalNote"),
"image": "/images/heritage-street/heritage-details-02.jpg"
},
{
"title": t("proponentTitle"),
"subtitle": t("foundationPurpose"),
"body": t("proponentBody"),
"note": t("proponentNote"),
"links": [
{
"label": "www.mismar.ngo",
"href": "https://www.mismar.ngo/"
}
],
"image": "/images/project/abouthouse.jpg"
},
{
"title": t("aliphTitle"),
"body": t("aliphBody"),
"note": t("aliphNote"),
"links": [
{
"label": t("aliphHome"),
"href": "https://www.aliph-foundation.org/"
},
{
"label": t("aliphGrants"),
"href": "https://www.aliph-foundation.org/en/our-grants"
},
{
"label": t("aliphIraq"),
"href": "https://www.aliph-foundation.org/en/actions-country/IQ"
},
{
"label": t("aliphPortal"),
"href": "https://aliph.smartsimple.ie/"
}
]
},
{
"title": t("frameworkTitle"),
"bullets": [
t("fundAssessment"),
t("fundStructure"),
t("fundPlans"),
t("fundRecords")
],
"note": t("frameworkNote")
},
{
"title": t("requestTitle"),
"body": t("requestBody"),
"final": true,
"image": "/images/project/house-of-antiques.jpg"
}
]; }
