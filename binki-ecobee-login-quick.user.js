// ==UserScript==
// @name binki-ecobee-login-quick
// @version 1.0.3
// @homepageURL https://github.com/binki/binki-ecobee-login-quick
// @match https://www.ecobee.com/*
// @match https://auth.ecobee.com/*
// @require https://raw.githubusercontent.com/binki/binki-userscript-when-element-changed-async/88cf57674ab8fcaa0e86bdf5209342ec7780739a/binki-userscript-when-element-changed-async.js
// @require https://github.com/binki/binki-userscript-when-element-query-selector-async/raw/0a9c204bdc304a9e82f1c31d090fdfdf7b554930/binki-userscript-when-element-query-selector-async.js
// @require https://github.com/binki/binki-userscript-when-input-completed/raw/d11bfc5021cb99fd80d5a2d008ffd4c7eabaf554/binki-userscript-when-input-completed.js
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
          // Wait for the page to be rehydrated and flash prior to clicking on any of the menus because they won’t work properly
          // until after hydration. Hydration takes so long that the user is likely to interact with the Quick Login button prior
          // to it completing.
          // See #5 (https://github.com/binki/binki-ecobee-login-quick/issues/5) for a video demonstrating the hydration flash
          // and effects.
          while (document.querySelector(`[data-qa-id='global-access-shortcuts-wrapper'] > style`)) {
            await whenElementChangedAsync(document.body);
          }

          (await whenElementQuerySelectorAsync(document.body, '[data-qa-id="main-nav-mobile-menus-toggle"]')).click();
          (await whenElementQuerySelectorAsync(document.body, 'button[aria-controls="main-nav-menu-signIn-items"]')).click();
          (await whenElementQuerySelectorAsync(document.body, '#main-nav-menu-signIn-items > li > a')).click();
        });
        (await whenElementQuerySelectorAsync(document.body, '[data-qa-id="main-nav-mobile-menus-toggle"]')).after(quickLoginButton);
      }
    }
  } else if (hostname === 'auth.ecobee.com') {
    const signInButton = await whenElementQuerySelectorAsync(document.body, '[data-action-button-primary=true]');
    // Originally there was just one page with both fields. Now there are two, likely to support something like
    // SSO or external login providers. So require at least one of the known fields to be present and require
    // all present fields to be filled prior to autoclicking. See #3.
    const possibleInputFields = [
      'username',
      'password',
    ].map(id => document.getElementById(id)).filter(input => input);
    if (possibleInputFields.length) {
      await Promise.all(possibleInputFields.map(input => whenInputCompletedAsync(input)));
      signInButton.click();
    }
  } else {
    throw new Error(`Unsupported hostname ${hostname}`);
  }
})();
