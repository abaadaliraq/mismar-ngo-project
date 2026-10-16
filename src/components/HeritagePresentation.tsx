"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Globe, Maximize2, Minimize2, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageProvider";
import { createFundingSlides } from "@/data/fundingPresentation";
import { CurrentConditionsGallery, RestorationVision, HouseOfAntiquesStudy } from "./VisualSections";
type MapSlide = { title: string; mapImage?: { src: string; width: number; height: number; alt: string } };
function isSlideNavigationBlocked(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(".media-lightbox, .map-lightbox, .matterport-panel, iframe, input, textarea, select, a, button, [data-prevent-slide-navigation]"));
}
function MapImageSlide({ slide }: { slide: MapSlide }) {
  const { t } = useLanguage();
  const image = slide.mapImage;
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    resetZoom();
    pointers.current.clear();
    pinchStart.current = null;
    dragStart.current = null;
  }, [resetZoom]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
    };
    document.documentElement.classList.add("lightbox-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeLightbox, isOpen]);

  if (!image) return null;


  const zoomBy = (amount: number) => {
    setScale((current) => Math.min(4, Math.max(1, Number((current + amount).toFixed(2)))));
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? 0.18 : -0.18);
  };

  const pointerDistance = () => {
    const values = Array.from(pointers.current.values());
    if (values.length < 2) return 0;
    return Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2) {
      pinchStart.current = { distance: pointerDistance(), scale };
      dragStart.current = null;
      return;
    }

    if (scale > 1) {
      dragStart.current = {
        x: event.clientX,
        y: event.clientY,
        px: position.x,
        py: position.y,
      };
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size >= 2 && pinchStart.current) {
      const next = pinchStart.current.scale * (pointerDistance() / pinchStart.current.distance);
      setScale(Math.min(4, Math.max(1, Number(next.toFixed(2)))));
      return;
    }

    if (dragStart.current && scale > 1) {
      setPosition({
        x: dragStart.current.px + event.clientX - dragStart.current.x,
        y: dragStart.current.py + event.clientY - dragStart.current.y,
      });
    }
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) dragStart.current = null;
    if (scale <= 1) setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="map-image-slide">
      <div className="map-image-layout">
      <button
        aria-label={t("m382", {v0: image.alt})}
        className="map-image-button"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Image
          alt={image.alt}
          className="map-slide-image"
          height={image.height}
          priority={image.src.includes("location-on-map")}
          src={image.src}
          width={image.width}
        />
      </button>
      </div>

      {isOpen ? (
        <div className="map-lightbox" data-prevent-slide-navigation="true" role="dialog" aria-modal="true">
          <div className="map-lightbox-toolbar" aria-label={t("m390")}>
            <button aria-label={t("m391")} onClick={() => zoomBy(0.25)} type="button">
              <ZoomIn size={18} />
            </button>
            <button aria-label={t("m392")} onClick={() => zoomBy(-0.25)} type="button">
              <ZoomOut size={18} />
            </button>
            <button aria-label={t("m393")} onClick={resetZoom} type="button">
              <RotateCcw size={18} />
            </button>
            <button aria-label={t("m394")} onClick={closeLightbox} type="button">
              <X size={20} />
            </button>
          </div>
          <div
            className={`map-lightbox-stage ${scale > 1 ? "is-zoomed" : ""}`}
            onPointerCancel={onPointerEnd}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onWheel={onWheel}
          >
            <Image
              alt={image.alt}
              className="map-lightbox-image"
              draggable={false}
              height={image.height}
              src={image.src}
              style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
              width={image.width}
            />
          </div>
          <div className="map-lightbox-caption">
            <strong>{slide.title}</strong>
            <span>{Math.round(scale * 100)}%</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}


function PresentationContent() {
  const { t, language, toggleLanguage } = useLanguage();
  const slides = createFundingSlides(t);
  const slideCount = slides.length;
  const [active, setActive] = useState(0);
  const [fullscreenError, setFullscreenError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wheelLock = useRef(false);
  const wheelDelta = useRef(0);
  const wheelDirection = useRef<1 | -1 | 0>(0);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);

  const progress = ((active + 1) / slides.length) * 100;

  const goTo = useCallback((index: number) => {
    const next = Math.min(Math.max(index, 0), slideCount - 1);
    setActive(next);
    const scrollContainer = slideRefs.current[next]?.querySelector(
      "[data-slide-scroll]",
    );
    if (scrollContainer instanceof HTMLElement) scrollContainer.scrollTop = 0;
    slideRefs.current[next]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [slideCount]);

  const toggleFullscreen = useCallback(async () => {
    try {
      setFullscreenError(false);
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch { setFullscreenError(true); }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.defaultPrevented ||
        target?.closest("input, button, [role='slider'], [role='dialog']")
      ) {
        return;
      }
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goTo(active + 1);
      }
      if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goTo(active - 1);
      }
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(slideCount - 1);
      if (event.key.toLowerCase() === "f") void toggleFullscreen();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, goTo, toggleFullscreen, slideCount]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (isSlideNavigationBlocked(event.target) || wheelLock.current) return;

      const eventTarget = event.target as Element | null;
      const currentSlide = slideRefs.current[active];
      const scrollContainer =
        eventTarget?.closest("[data-slide-scroll]") ??
        currentSlide?.querySelector("[data-slide-scroll]");

      if (!(scrollContainer instanceof HTMLElement)) return;

      const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const atTop = scrollContainer.scrollTop <= 2;
      const atBottom = scrollContainer.scrollTop >= maxScroll - 2;
      const direction = event.deltaY > 0 ? 1 : -1;

      if (maxScroll > 2) {
        if (direction > 0 && !atBottom) {
          wheelDelta.current = 0;
          wheelDirection.current = 0;
          return;
        }

        if (direction < 0 && !atTop) {
          wheelDelta.current = 0;
          wheelDirection.current = 0;
          return;
        }
      }

      if (wheelDirection.current !== direction) {
        wheelDelta.current = 0;
        wheelDirection.current = direction;
      }

      wheelDelta.current += event.deltaY;
      if (Math.abs(wheelDelta.current) < 120) return;

      wheelDelta.current = 0;
      wheelLock.current = true;
      goTo(active + direction);
      window.setTimeout(() => {
        wheelLock.current = false;
      }, 860);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [active, goTo]);


  useEffect(() => {
    const root = document.querySelector(".presentation-shell");
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        const index = slideRefs.current.indexOf(entry.target as HTMLElement);
        if (index >= 0) setActive(index);
      }
    }, { root, threshold: .6 });
    slideRefs.current.forEach(slide => { if (slide) observer.observe(slide); });
    return () => observer.disconnect();
  }, [slideCount]);
  return <main className="presentation-shell" data-active-slide={active} aria-label={t("presentationLabel")}>
    <header className="presentation-topbar" data-prevent-slide-navigation="true">
      <a className="header-brand" href="https://www.mismar.ngo/" target="_blank" rel="noopener noreferrer">{t("brandName")}<small>{t("proposalLabel")}</small></a>
      <button className="language-switch" type="button" onClick={toggleLanguage} aria-label={t("switchLanguage")} title={t("switchLanguage")} lang={language === "en" ? "ar" : "en"}><Globe size={15} aria-hidden="true" />{language === "en" ? "AR" : "EN"}</button>
    </header>
    <div className="progress-track" aria-hidden="true"><span style={{width: progress + "%"}} /></div>
    <div className="deck-controls" aria-label={t("m408")}>
      <button type="button" onClick={() => goTo(active - 1)} aria-label={t("m409")} disabled={active === 0}><ArrowUp size={18}/></button>
      <strong>{String(active + 1).padStart(2,"0")} / {String(slideCount).padStart(2,"0")}</strong>
      <button type="button" onClick={() => goTo(active + 1)} aria-label={t("m410")} disabled={active === slideCount - 1}><ArrowDown size={18}/></button>
      <button type="button" onClick={toggleFullscreen} aria-label={t("m411")}>{isFullscreen ? <Minimize2 size={18}/> : <Maximize2 size={18}/>}</button>
    </div>
    {fullscreenError ? <p className="fullscreen-error" role="status">{t("fullscreenError")}</p> : null}
    <nav className="slide-dots" aria-label={t("m412")}>
      {slides.map((slide,index) => <button type="button" key={index} aria-label={t("m413",{v0:slide.title})} aria-current={active===index ? "step" : undefined} className={active===index?"is-active":""} onClick={() => goTo(index)}/>)}
    </nav>
    {slides.map((slide,index) => <section className={"presentation-slide slide" + (slide.hero ? " slide-hero" : "") + (slide.gallery ? " visual-slide visual-" + slide.gallery : "")} id={"slide-" + (index+1)} key={index} ref={element=>{slideRefs.current[index]=element;}}>
      {slide.image ? <Image alt="" className="slide-image" fill priority={index===0} sizes="100vw" src={slide.image}/> : null}
      <div className="slide-shade"/><div className="baghdad-pattern" aria-hidden="true"/>
      <div className="slide-scroll" data-slide-scroll><div className="slide-content">
        {slide.hero ? <div className="proposal-proponent"><strong>{t("brandName")}</strong><span>{t("foundationPurpose")}</span><small>{t("proposalLabel")}</small></div> : null}
        <p className="eyebrow">{String(index+1).padStart(2,"0")} / {String(slideCount).padStart(2,"0")}</p>
        <h1>{slide.title}</h1>
        {slide.subtitle ? <p className="subtitle">{slide.subtitle}</p> : null}
        {slide.hero ? <p className="proposal-edition">{t("place")}<span>{t("editionDate")} · {t("version")}</span></p> : null}
        {slide.body ? <p className="body">{slide.body}</p> : null}
        {slide.bullets ? <ul className="bullet-list">{slide.bullets.map((item,itemIndex)=><li key={itemIndex}>{item}</li>)}</ul> : null}
        {slide.note && !slide.gallery ? <p className="proposal-note">{slide.note}</p> : null}
        {slide.maps ? <div className="scope-maps">
          <MapImageSlide slide={{title:t("propertyMap"),mapImage:{src:"/images/sold-house-map.jpg",width:1920,height:1080,alt:t("propertyMap")}}}/>
          <MapImageSlide slide={{title:t("accessMap"),mapImage:{src:"/images/location-on-map.jpg",width:1920,height:1080,alt:t("accessMap")}}}/>
        </div> : null}
        {slide.gallery === "current" ? <CurrentConditionsGallery/> : null}
        {slide.gallery === "vision" ? <RestorationVision/> : null}
        {slide.gallery === "case" ? <HouseOfAntiquesStudy/> : null}
        {slide.note && slide.gallery ? <p className="visual-note">{slide.note}</p> : null}
        {slide.links ? <nav className="funding-links" aria-label={t("sourcesLabel")}>{slide.links.map(link=><a className="map-open-link" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</nav> : null}
        {slide.final ? <div className="final-proponent"><span>{t("proposalBy")}</span><strong>{t("brandName")}</strong><span>{t("foundationPurpose")}</span><a href="https://www.mismar.ngo/" target="_blank" rel="noopener noreferrer">www.mismar.ngo</a><small>{t("editionDate")} · {t("version")}</small><p>{t("credit")}</p><small>{t("assetRights")}</small></div> : null}
      </div></div>
      <footer className="slide-brand"><a href="https://www.mismar.ngo/" target="_blank" rel="noopener noreferrer">{t("brandName")}</a><span dir="ltr">{t("copyright")}</span></footer>
      {slide.hero ? <button className="next-cue" type="button" onClick={()=>goTo(1)} aria-label={t("m414")}><ArrowDown size={20}/></button> : null}
    </section>)}
  </main>;
}
export function HeritagePresentation() { return <LanguageProvider><PresentationContent/></LanguageProvider>; }

