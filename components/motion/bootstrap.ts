/**
 * Inline script for <head>. Runs before first paint so sections that reveal on
 * scroll start hidden instead of flashing visible → hidden → visible.
 *
 * Motion is enabled only when the visitor has not asked for reduced motion,
 * and it backs out if MotionController never mounts, so content can never
 * stay hidden behind a script failure.
 */
export const motionBootstrapScript = `(function(){try{var d=document.documentElement;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion-reduced');return}d.classList.add('motion-ready');setTimeout(function(){if(!window.__redoraMotion)d.classList.remove('motion-ready')},4000)}catch(e){}})();`;
