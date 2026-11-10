(function () {
  const buttons = Array.from(document.querySelectorAll('[data-app-view]'));
  const panels = Array.from(document.querySelectorAll('[data-app-view-panel]'));
  const availableViews = new Set(panels.map(panel => panel.dataset.appViewPanel));

  function show(viewName) {
    const activeView = availableViews.has(viewName) ? viewName : 'creator';

    panels.forEach(panel => {
      panel.classList.toggle('hidden', panel.dataset.appViewPanel !== activeView);
    });

    buttons.forEach(button => {
      const isActive = button.dataset.appView === activeView;
      button.classList.toggle('active', isActive);
      if (isActive) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });

    window.scrollTo(0, 0);
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => show(button.dataset.appView));
  });

  window.DesignGuideNavigation = { show };
})();
