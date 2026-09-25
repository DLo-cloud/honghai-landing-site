const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      mobileMenu.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll("[data-image-id]").forEach((slot) => {
  const imageId = slot.dataset.imageId;
  if (slot.dataset.imageSrc) return;
  const imageFile = slot.dataset.imageFile;
  const extensions = ["webp", "jpg", "jpeg", "png"];

  const loadImage = (extensionIndex) => {
    if (!imageId || !imageFile || extensionIndex >= extensions.length) {
      return;
    }

    const image = new Image();
    image.alt = imageId;
    image.addEventListener("load", () => {
      if (slot.dataset.editorPreview) return;
      slot.replaceChildren(image);
      slot.classList.add("has-image");
    });
    image.addEventListener("error", () => loadImage(extensionIndex + 1));
    image.src = `assets/images/${imageFile}.${extensions[extensionIndex]}`;
  };

  loadImage(0);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileMenu?.classList.contains('is-open')) {
    mobileMenu.classList.remove('is-open'); menuButton.setAttribute('aria-expanded','false'); menuButton.focus();
  }
});
