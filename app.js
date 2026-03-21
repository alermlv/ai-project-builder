import { renderRoute } from "./router.js";
import { updateState } from "./state.js";

function init() {
  renderRoute();
  setupGlobalEvents();
}

function setupGlobalEvents() {
  document.addEventListener("click", (e) => {
    if (e.target.dataset.nav) {
      const route = e.target.dataset.nav;

      updateState((state) => ({
        ...state,
        route,
      }));

      renderRoute();
    }
  });
}

init();
