"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Maximize2, Minimize2, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { createGalleries, createHouseBeforeGallery, HOUSE_TOUR_URL, type GalleryImageItem } from "@/data/projectConstants";

const desktopQuery = "(min-width: 900px)";
function subscribeViewport(notify: () => void) {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
function useDesktop() {
  return useSyncExternalStore(subscribeViewport, () => window.matchMedia(desktopQuery).matches, () => true);
}

function ImagePreview({ items, index, onChange, onClose, padded = false }: { items: GalleryImageItem[]; index: number; onChange: (index: number) => void; onClose: () => void; padded?: boolean }) {
  const { t, language } = useLanguage();
  const panel = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const step = useCallback((delta: number) => onChange((index + delta + items.length) % items.length), [index, items.length, onChange]);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButton.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key === "ArrowRight") { event.preventDefault(); step(language === "en" ? 1 : -1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); step(language === "en" ? -1 : 1); }
      if (event.key === "Tab") {
        const buttons = panel.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!buttons?.length) return;
        if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[buttons.length - 1].focus(); }
        if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) { event.preventDefault(); buttons[0].focus(); }
      }
    };
    document.documentElement.classList.add("lightbox-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [language, onClose, step]);
  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === panel.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  const toggleFullscreen = async () => {
    try {
      setFullscreenError(false);
      if (document.fullscreenElement === panel.current) await document.exitFullscreen();
      else await panel.current?.requestFullscreen();
    } catch { setFullscreenError(true); }
  };
  const close = async () => {
    if (document.fullscreenElement === panel.current) await document.exitFullscreen();
    onClose();
  };
  const item = items[index];
  return createPortal(<div className="media-lightbox" ref={panel} role="dialog" aria-modal="true" aria-label={item.title} data-prevent-slide-navigation="true">
    <div className="media-lightbox-toolbar">
      <span dir="ltr">{t("imageCount", { index: padded ? String(index + 1).padStart(2, "0") : index + 1, total: padded ? String(items.length).padStart(2, "0") : items.length })}</span>
      <button type="button" onClick={toggleFullscreen} aria-label={t("fullscreenPreview")}>{fullscreen ? <Minimize2 size={20}/> : <Maximize2 size={20}/>}</button>
      <button ref={closeButton} type="button" onClick={close} aria-label={t("closePreview")}><X size={22}/></button>
    </div>
    <div className="media-lightbox-stage"><Image unoptimized src={item.src} alt={item.title} width={item.width} height={item.height} className="media-lightbox-image"/></div>
    <div className="media-lightbox-bottom">
      <button type="button" onClick={() => step(-1)} aria-label={t("previousImage")}>{language === "en" ? <ArrowLeft size={20}/> : <ArrowRight size={20}/>}</button>
      <p>{item.title}</p>
      <button type="button" onClick={() => step(1)} aria-label={t("nextImage")}>{language === "en" ? <ArrowRight size={20}/> : <ArrowLeft size={20}/>}</button>
    </div>
    {fullscreenError ? <p role="status">{t("fullscreenError")}</p> : null}
  </div>, document.body);
}

function PhotoCarousel({ items, columns = 1, label, padded = false }: { items: GalleryImageItem[]; columns?: number; label: string; padded?: boolean }) {
  const { t, language } = useLanguage();
  const desktop = useDesktop();
  const count = desktop ? columns : 1;
  const [start, setStart] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const closePreview = useCallback(() => setPreview(null), []);
  const current = Math.min(start, items.length - 1);
  const visible = items.slice(current, current + count);
  const previous = () => setStart(current === 0 ? Math.max(0, items.length - count) : Math.max(0, current - count));
  const next = () => setStart(current + count >= items.length ? 0 : current + count);
  return <div className="photo-carousel" role="region" aria-roledescription={t("carouselDescription")} aria-label={label} data-total={items.length} data-prevent-slide-navigation="true">
    <div className="photo-carousel-stage" style={{ gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))` }}>
      {visible.map((item, offset) => <figure className="photo-frame" key={item.id}>
        <button className="photo-open" type="button" onClick={() => setPreview(current + offset)} aria-label={t("openImage", { title: item.title })}>
          <Image unoptimized={item.src.startsWith("https://res.cloudinary.com/")} src={item.src} alt={item.title} width={item.width} height={item.height} sizes={columns > 1 ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 45vw, 100vw"}/>
          <span className="photo-expand" aria-hidden="true"><Maximize2 size={17}/></span>
        </button>
        <figcaption>{item.title}</figcaption>
      </figure>)}
    </div>
    <div className="photo-carousel-controls">
      <button type="button" onClick={previous} aria-label={t("previousImage")}>{language === "en" ? <ArrowLeft size={18}/> : <ArrowRight size={18}/>}<span>{t("previousImage")}</span></button>
      <span className="photo-counter" aria-live="polite" aria-atomic="true" dir="ltr">{padded ? `${String(current + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}` : t("imageRange", { start: current + 1, end: current + visible.length, total: items.length })}</span>
      <button type="button" onClick={next} aria-label={t("nextImage")}><span>{t("nextImage")}</span>{language === "en" ? <ArrowRight size={18}/> : <ArrowLeft size={18}/>}</button>
    </div>
    <div className="print-photo-collection">{items.map(item => <figure key={item.id}><Image unoptimized={item.src.startsWith("https://res.cloudinary.com/")} src={item.src} alt={item.title} width={item.width} height={item.height}/><figcaption>{item.title}</figcaption></figure>)}</div>
    {preview !== null ? <ImagePreview padded={padded} items={items} index={preview} onChange={setPreview} onClose={closePreview}/> : null}
  </div>;
}

export function CurrentConditionsGallery() {
  const { t } = useLanguage();
  return <div className="visual-stage current-photo-stage"><PhotoCarousel items={createGalleries(t).current} columns={2} label={t("conditionsTitle")}/></div>;
}

export function RestorationVision() {
  const { t } = useLanguage();
  const galleries = createGalleries(t);
  const [tab, setTab] = useState<"current" | "vision">("vision");
  return <div className="visual-stage restoration-stage">
    <div className="vision-mobile-tabs" role="tablist" aria-label={t("visionTitle")}>
      <button type="button" role="tab" aria-selected={tab === "current"} aria-controls="existing-collection" id="existing-tab" onClick={() => setTab("current")}>{t("beforeLabel")}</button>
      <button type="button" role="tab" aria-selected={tab === "vision"} aria-controls="proposed-collection" id="proposed-tab" onClick={() => setTab("vision")}>{t("proposedLabel")}</button>
    </div>
    <div className="vision-columns" data-active-tab={tab}>
      <section className="vision-collection existing-collection" id="existing-collection" aria-labelledby="existing-label"><h2 id="existing-label">{t("beforeLabel")}</h2><PhotoCarousel items={galleries.current} label={t("beforeLabel")}/></section>
      <section className="vision-collection proposed-collection" id="proposed-collection" aria-labelledby="proposed-label"><h2 id="proposed-label">{t("proposedLabel")}</h2><PhotoCarousel items={galleries.vision} label={t("proposedLabel")}/></section>
    </div>
    <p className="vision-reference-note">{t("independentViews")}</p>
  </div>;
}

export function HouseOfAntiquesStudy() {
  const { t } = useLanguage();
  const items = createHouseBeforeGallery(t);
  const strip = useRef<HTMLDivElement>(null);
  const firstPhoto = useRef<HTMLButtonElement>(null);
  const [repetitions, setRepetitions] = useState(3);
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState(75);
  const [preview, setPreview] = useState<number | null>(null);
  const closePreview = useCallback(() => setPreview(null), []);
  useEffect(() => {
    const measure = () => {
      if (!strip.current || !firstPhoto.current) return;
      const photos = Array.from(strip.current.querySelectorAll<HTMLButtonElement>(".house-marquee-group:first-child button")).slice(0, items.length);
      const groupWidth = photos.reduce((width, photo) => width + photo.getBoundingClientRect().width + 12, 0);
      const copies = Math.max(1, Math.ceil(strip.current.clientWidth / groupWidth));
      setRepetitions(copies);
      setDuration(Math.max(45, groupWidth * copies / 40));
      setReady(true);
    };
    const observer = new ResizeObserver(measure);
    if (strip.current) observer.observe(strip.current);
    if (firstPhoto.current) observer.observe(firstPhoto.current);
    measure();
    return () => observer.disconnect();
  }, [items.length]);
  return <div className="visual-stage house-showcase" data-prevent-slide-navigation="true">
    <section className="house-tour" aria-label={t("tourFrameTitle")} onPointerDown={event=>event.stopPropagation()} onTouchStart={event=>event.stopPropagation()} onWheel={event=>event.stopPropagation()}>
      <iframe src={HOUSE_TOUR_URL} title={t("tourFrameTitle")} loading="lazy" allow="fullscreen; xr-spatial-tracking" allowFullScreen/>
      <a className="house-tour-link" href={HOUSE_TOUR_URL} target="_blank" rel="noopener noreferrer">{t("openTour")}</a>
    </section>
    <header className="house-archive-heading"><h2 id="house-archive-title">{t("caseArchiveTitle")}</h2><p>{t("caseArchiveBody")}</p></header>
    <div ref={strip} className="house-marquee" role="region" aria-labelledby="house-archive-title" data-ready={ready} data-preview={preview!==null}>
      <div className="house-marquee-track" style={{ animationDuration: `${duration}s` }}>
        {[0,1].map(group => <div className="house-marquee-group" key={group} aria-hidden={group===1?true:undefined}>
          {Array.from({length:repetitions},(_,repeat) => items.map((item,index) => <button type="button" className="house-marquee-photo" style={{ aspectRatio: `${item.width} / ${item.height}` }} key={repeat+"-"+item.id} ref={group===0&&repeat===0&&index===0?firstPhoto:undefined} tabIndex={group===0&&repeat===0?0:-1} aria-label={t("openImage",{title:item.title})} onClick={()=>setPreview(index)}>
            <Image unoptimized loading="eager" src={item.src} alt={group===0&&repeat===0?item.title:""} width={item.width} height={item.height} sizes="(min-width:900px) 340px, 220px"/>
          </button>))}
        </div>)}
      </div>
    </div>
    {preview!==null?<ImagePreview padded items={items} index={preview} onChange={setPreview} onClose={closePreview}/>:null}
  </div>;
}


