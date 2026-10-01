"use strict";
const figureViewer = document.querySelector(".figure-viewer");
const enlargedFigure = figureViewer.querySelector(".figure-enlarged");
const originalFigure = figureViewer.querySelector(".figure-original");
figureViewer.querySelector(".figure-close").addEventListener("click", () => figureViewer.close());
figureViewer.addEventListener("click", (event) => {
  if (event.target === figureViewer) figureViewer.close();
});
document.querySelectorAll(".work-figure a").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const figure = link.querySelector("svg").cloneNode(true);
    figure.querySelectorAll("clipPath[id]").forEach((mask) => {
      const originalId = mask.id;
      mask.id = originalId + "-viewer";
      figure.querySelectorAll("[clip-path]").forEach((layer) => {
        if (layer.getAttribute("clip-path") === `url(#${originalId})`) {
          layer.setAttribute("clip-path", `url(#${mask.id})`);
        }
      });
    });
    enlargedFigure.replaceChildren(figure);
    originalFigure.href = link.href;
    figureViewer.showModal();
  });
});
