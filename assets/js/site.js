/* Crystal Beauty Center — interactions */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ *
   * Header state
   * ------------------------------------------------------------------ */
  const header = document.querySelector("[data-header]");
  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ------------------------------------------------------------------ *
   * Mobile menu
   * ------------------------------------------------------------------ */
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuToggle && mobileMenu) {
    const openMenu = () => {
      mobileMenu.hidden = false;
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
      const firstLink = mobileMenu.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
    };

    const closeMenu = ({ restoreFocus = false } = {}) => {
      mobileMenu.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      if (restoreFocus) menuToggle.focus({ preventScroll: true });
    };

    menuToggle.addEventListener("click", () => {
      if (menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu({ restoreFocus: true });
      } else {
        openMenu();
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu({ restoreFocus: true });
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1000 && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Service tabs
   * ------------------------------------------------------------------ */
  const tabsRoot = document.querySelector("[data-tabs]");
  const labelForTab = (tab) => tab.textContent.trim().toLowerCase();

  if (tabsRoot) {
    const tabs = Array.from(tabsRoot.querySelectorAll('[role="tab"]'));
    const panels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

    const activateTab = (tab, { focusTab = false, announce = false } = {}) => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      });

      panels.forEach((panel) => {
        panel.hidden = panel.id !== tab.getAttribute("aria-controls");
      });

      if (focusTab) tab.focus({ preventScroll: true });
      if (announce) {
        tab.scrollIntoView({ block: "nearest", inline: "center", behavior: reduceMotion ? "auto" : "smooth" });
      }
    };

    const tabFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      return tabs.find((tab) => tab.id === `tab-${hash}`);
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activateTab(tab));
      tab.addEventListener("keydown", (event) => {
        const index = tabs.indexOf(tab);
        let next = null;
        if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
        if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (event.key === "Home") next = tabs[0];
        if (event.key === "End") next = tabs[tabs.length - 1];

        if (next) {
          event.preventDefault();
          activateTab(next, { focusTab: true });
        }
      });
    });

    document.querySelectorAll("[data-open-tab]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const target = document.getElementById(`tab-${trigger.dataset.openTab}`);
        if (!target) return;
        activateTab(target, { announce: true });

        const services = document.getElementById("services");
        if (services) {
          services.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }
        window.setTimeout(() => target.focus({ preventScroll: true }), reduceMotion ? 0 : 420);
      });
    });

    const initialTab = tabFromHash();
    if (initialTab) activateTab(initialTab);
  }

  /* ------------------------------------------------------------------ *
   * Gallery lightbox
   * ------------------------------------------------------------------ */
  const galleryItems = Array.from(document.querySelectorAll("[data-gallery-item]"));
  const lightbox = document.querySelector("[data-lightbox]");

  if (galleryItems.length && lightbox) {
    const image = lightbox.querySelector("[data-lightbox-image]");
    const caption = lightbox.querySelector("[data-lightbox-caption]");
    const closeButton = lightbox.querySelector("[data-lightbox-close]");
    const prevButton = lightbox.querySelector("[data-lightbox-prev]");
    const nextButton = lightbox.querySelector("[data-lightbox-next]");
    let currentIndex = 0;
    let lastTrigger = null;

    const showSlide = (index) => {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      const trigger = galleryItems[currentIndex];
      const source = trigger.querySelector("img");
      if (!source || !image) return;

      image.src = source.currentSrc || source.src;
      image.alt = source.alt;
      if (caption) caption.textContent = trigger.dataset.caption || "";
    };

    const openLightbox = (index, trigger) => {
      lastTrigger = trigger;
      showSlide(index);
      if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
      } else {
        lightbox.setAttribute("open", "");
      }
      document.body.classList.add("lightbox-open");
      if (closeButton) closeButton.focus({ preventScroll: true });
    };

    const closeLightbox = () => {
      if (typeof lightbox.close === "function" && lightbox.open) {
        lightbox.close();
      } else {
        lightbox.removeAttribute("open");
      }
      document.body.classList.remove("lightbox-open");
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener("click", () => openLightbox(index, item));
    });

    closeButton?.addEventListener("click", closeLightbox);
    prevButton?.addEventListener("click", () => showSlide(currentIndex - 1));
    nextButton?.addEventListener("click", () => showSlide(currentIndex + 1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(currentIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(currentIndex + 1);
      }
    });

    lightbox.addEventListener("close", () => {
      document.body.classList.remove("lightbox-open");
    });
  }

  /* ------------------------------------------------------------------ *
   * Year + branch data
   * ------------------------------------------------------------------ */
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

})();
