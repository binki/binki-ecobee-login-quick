Fix Ecobee’s website to have a quick login button and auto-login instead of requiring 4 taps/clicks.

[Install](binki-ecobee-login-quick.user.js?raw=1)

## Problem

In order to log into the Ecobee website starting at https://ecobee.com/, 5 clicks are required.

1. Click on the hamburger menu (三).

   ![Ecobee main page](https://i.imgur.com/BnlCcTH.png)
2. Click on “Sign in”.

   ![Ecobee hamburger menu (三) contents](https://i.imgur.com/nxxqoo8.png)
3. Click on “Sign in to your account”.

   ![Ecobee “Sign in” menu contents](https://i.imgur.com/hvO8bN0.png)
4. Click on “Continue”.

   ![Ecobee Email entry form](https://i.imgur.com/bO8RgK1.png)
5. Click on “Sign in”.

   ![Ecobee Password entry form](https://i.imgur.com/Znre5TY.png)

## Solution

After installing this script, all of these steps become just one quick click on the “Quick Login” button which is injected into the site’s header menu:

![Ecobee main page with “Quick Login” button](https://i.imgur.com/BawNxXA.png)
