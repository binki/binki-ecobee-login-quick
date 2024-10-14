// ==UserScript==
// @name binki-ecobee-login-quick
// @version 1.0.0
// @homepageURL https://github.com/binki/binki-ecobee-login-quick
// @match https://www.ecobee.com/*
// @match https://auth.ecobee.com/*
// @require https://raw.githubusercontent.com/binki/binki-userscript-when-element-changed-async/88cf57674ab8fcaa0e86bdf5209342ec7780739a/binki-userscript-when-element-changed-async.js
// @require https://github.com/binki/binki-userscript-when-element-query-selector-async/raw/0a9c204bdc304a9e82f1c31d090fdfdf7b554930/binki-userscript-when-element-query-selector-async.js
// ==/UserScript==

(async () => {
  const hostname = window.location.hostname;
  if (hostname === 'www.ecobee.com') {
    const identifier = 'binki-ecobee-login-quick-button';
    while (true) {
      // We need to support re-adding our element because they use React with SSR and our modifications cause it
      // to rerender the entire site client-side. It would be wrong to wait for some sort of “React ready” event
      // because that adds unnecessary coupling with the implementation (we are tightly coupled as we are relying on
      // element names and IDs, but the less the better).
      if (document.getElementById(identifier)) {
        await whenElementChangedAsync(document.body);
      } else {
        const quickLoginButton = document.createElement('button');
        quickLoginButton.id = identifier;
        quickLoginButton.textContent = 'Quick Login';
        quickLoginButton.addEventListener('click', async e => {
          e.preventDefault();
          (await whenElementQuerySelectorAsync(document.body, '[data-qa-id="main-nav-mobile-menus-toggle"]')).click();
          (await whenElementQuerySelectorAsync(document.body, 'button[aria-controls="main-nav-menu-signIn-items"]')).click();
          (await whenElementQuerySelectorAsync(document.body, '#main-nav-menu-signIn-items > li > a')).click();
        });
        (await whenElementQuerySelectorAsync(document.body, '[data-qa-id="main-nav-mobile-menus-toggle"]')).after(quickLoginButton);
      }
    }
  } else if (hostname === 'auth.ecobee.com') {
    const signInButton = await whenElementQuerySelectorAsync(document.body, '[data-action-button-primary=true]');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    if (usernameInput.value && passwordInput.value) {
      signInButton.click();
    }
  } else {
    throw new Error(`Unsupported hostname ${hostname}`);
  }
})();
