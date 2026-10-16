import type { Translator } from "@/i18n/LanguageProvider";
export type GalleryImageItem = {id:string;src:string;width:number;height:number;title:string};
/** Original files only. Views in these collections are independent references, not verified building-by-building pairs. */
export function createGalleries(t:Translator):Record<"current"|"vision"|"case",GalleryImageItem[]> {return {current:[{id:"currentPhoto1",src:"/images/street/before/before-01.jpg",width:1414,height:952,title:t("currentPhoto1")},
{id:"currentPhoto2",src:"/images/street/before/before-02.jpg",width:1200,height:1600,title:t("currentPhoto2")},
{id:"currentPhoto3",src:"/images/street/before/before-03.jpg",width:1414,height:1048,title:t("currentPhoto3")},
{id:"currentPhoto4",src:"/images/street/before/before-04.jpg",width:1200,height:1600,title:t("currentPhoto4")},
{id:"currentPhoto5",src:"/images/street/before/before-05.jpg",width:1200,height:1600,title:t("currentPhoto5")},
{id:"currentPhoto6",src:"/images/street/before/before-06.jpg",width:1600,height:1200,title:t("currentPhoto6")},
{id:"currentPhoto7",src:"/images/street/before/before-07.jpg",width:1200,height:1600,title:t("currentPhoto7")},
{id:"currentPhoto8",src:"/images/street/before/before-08.jpg",width:1600,height:1200,title:t("currentPhoto8")},
{id:"currentPhoto9",src:"/images/street/before/WhatsApp Image 2026-08-19 at 8.58.13 AM (1).jpeg",width:1200,height:1600,title:t("currentPhoto9")},
{id:"currentPhoto10",src:"/images/street/before/WhatsApp Image 2026-08-19 at 8.58.13 AM (2).jpeg",width:1200,height:1600,title:t("currentPhoto10")},
{id:"currentPhoto11",src:"/images/street/before/WhatsApp Image 2026-08-19 at 8.58.13 AM (3).jpeg",width:1200,height:1600,title:t("currentPhoto11")},
{id:"currentPhoto12",src:"/images/street/before/WhatsApp Image 2026-08-19 at 8.58.13 AM.jpeg",width:1200,height:1600,title:t("currentPhoto12")},
{id:"currentPhoto13",src:"/images/heritage-street/heritage-details-01.jpg",width:1200,height:1600,title:t("currentPhoto13")},
{id:"currentPhoto14",src:"/images/heritage-street/heritage-street-current-03.jpg",width:3000,height:4000,title:t("currentPhoto14")},
{id:"currentPhoto15",src:"/images/heritage-street/heritage-street-current-04.jpg",width:1414,height:2000,title:t("currentPhoto15")},
{id:"currentPhoto16",src:"/images/heritage-street/heritage-vision-01.jpg",width:1200,height:1600,title:t("currentPhoto16")}],vision:[{id:"visionPhoto1",src:"/images/street/vision/vision-01.jpg",width:1065,height:741,title:t("visionPhoto1")},
{id:"visionPhoto2",src:"/images/street/vision/vision-02.jpg",width:1086,height:1448,title:t("visionPhoto2")},
{id:"visionPhoto3",src:"/images/street/vision/vision-03.jpg",width:1536,height:1024,title:t("visionPhoto3")},
{id:"visionPhoto4",src:"/images/street/vision/vision-04.jpg",width:1086,height:1448,title:t("visionPhoto4")},
{id:"visionPhoto5",src:"/images/street/vision/vision-05.jpg",width:1086,height:1448,title:t("visionPhoto5")},
{id:"visionPhoto6",src:"/images/street/vision/vision-06.jpg",width:1448,height:1086,title:t("visionPhoto6")},
{id:"visionPhoto7",src:"/images/street/vision/vision-07.jpg",width:1086,height:1448,title:t("visionPhoto7")},
{id:"visionPhoto8",src:"/images/street/vision/vision-08.jpg",width:1448,height:1086,title:t("visionPhoto8")},
{id:"visionPhoto9",src:"/images/street/vision/b63d1fd5-e097-4617-939e-e37066414632.png",width:1086,height:1448,title:t("visionPhoto9")}],case:[{id:"house",src:"/images/project/house-of-antiques.jpg",width:1536,height:1024,title:t("casePhoto1")},{id:"house-day",src:"/images/heritage-street/heritage-street-current-03.jpg",width:3000,height:4000,title:t("casePhoto2")}]};}
export const HOUSE_TOUR_URL = "https://my.matterport.com/show/?m=rUWyUPkBTgF";

/** Unaltered archive photographs supplied for slide 07. */
export function createHouseBeforeGallery(t:Translator):GalleryImageItem[] { return [{"id":"house-before-1","src":"https://res.cloudinary.com/dyqdfbaln/image/upload/v1790681928/06212025_182020_kuile3.jpg","width":5918,"height":4439,"title":t("caseBeforePhoto", { index: 1 })},{"id":"house-before-2","src":"https://res.cloudinary.com/dyqdfbaln/image/upload/v1790681926/06212025_182149_fiydfc.jpg","width":5918,"height":4439,"title":t("caseBeforePhoto", { index: 2 })},{"id":"house-before-3","src":"https://res.cloudinary.com/dyqdfbaln/image/upload/v1790681925/house-before_k7pcso.jpg","width":5918,"height":4439,"title":t("caseBeforePhoto", { index: 3 })},{"id":"house-before-4","src":"https://res.cloudinary.com/dyqdfbaln/image/upload/v1790681916/09292026_142115_grzc5v.jpg","width":5516,"height":3103,"title":t("caseBeforePhoto", { index: 4 })},{"id":"house-before-5","src":"https://res.cloudinary.com/dyqdfbaln/image/upload/v1790681910/09292026_142851_pxdoum.jpg","width":7585,"height":4267,"title":t("caseBeforePhoto", { index: 5 })},{"id":"house-before-6","src":"https://res.cloudinary.com/dyqdfbaln/image/upload/v1790681906/09292026_142543_gbvci5.jpg","width":7585,"height":4267,"title":t("caseBeforePhoto", { index: 6 })},{"id":"house-before-7","src":"https://res.cloudinary.com/dyqdfbaln/image/upload/v1790681897/06212025_183304_zb0uj0.jpg","width":6502,"height":4877,"title":t("caseBeforePhoto", { index: 7 })},{"id":"house-before-8","src":"https://res.cloudinary.com/dyqdfbaln/image/upload/v1790681885/before-after-04-before_oregpq.jpg","width":6502,"height":4877,"title":t("caseBeforePhoto", { index: 8 })}]; }
