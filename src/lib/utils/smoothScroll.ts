import Lenis from "@studio-freight/lenis";

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  lenis = new Lenis({
    duration: 0.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

export function scrollTo(target: string | HTMLElement) {
  lenis?.scrollTo(target);
}

export function destroy() {
  lenis?.destroy();
  lenis = null;
}

export function stop() {
  lenis?.stop();
}

export function start() {
  lenis?.start();
}
