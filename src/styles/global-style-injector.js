const injectTailwindCSS = () => {
  function injectTailwindToShadowRoots(element) {
    if (element.shadowRoot) {
      // Inject the Tailwind CSS link into the shadow root
      const tailwindLink = document.getElementById('tailwind-styles').cloneNode();
      const materialSymbolLink = document.getElementById('material-symbols').cloneNode();
      const style = document.createElement('style');
      style.textContent = `
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
    `;

      element.shadowRoot.appendChild(tailwindLink);
      element.shadowRoot.appendChild(materialSymbolLink);
      element.shadowRoot.appendChild(style);

      element.shadowRoot.querySelectorAll('*').forEach((childElement) => {
        injectTailwindToShadowRoots(childElement);
      });
    }
  }
  document.querySelectorAll('*').forEach((element) => {
    injectTailwindToShadowRoots(element);
  });
};

// Run the function after page load
window.addEventListener('DOMContentLoaded', injectTailwindCSS);
