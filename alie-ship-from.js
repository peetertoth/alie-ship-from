// ==UserScript==
// @name         AliExpress / set ship from country
// @namespace    peetftp.ddns.net
// @version      0.1
// @description  Creates a 'Ship from' selector to the AliExpress product search page (below the 'Sort by' row)
// @author       Peter Toth
// @match        https://www.aliexpress.com/wholesale*
// @icon         https://www.google.com/s2/favicons?domain=aliexpress.com
// @grant        none
// @updateURL    https://raw.githubusercontent.com/peetertoth/alie-ship-from/main/alie-ship-from.js
// @downloadURL  https://raw.githubusercontent.com/peetertoth/alie-ship-from/main/alie-ship-from.js
// ==/UserScript==

(function() {
    'use strict';
    const supportedCountryCodes = ['CZ', 'ES', 'PL', 'BE', 'IT'];

    const queryParamName = 'shipFromCountry';

    const generateURLWithCountryCode = function (countryCode) {
        const { location: { href } } = window;
        const indexOfQueryParam = href.indexOf(queryParamName);
        if (indexOfQueryParam > -1) {
            const regex = new RegExp(`${queryParamName}=[A-Z]{2}`);
            return href.replace(regex, `${queryParamName}=${countryCode}`);
        } else {
            if (href.indexOf('?') > -1 ) {
                return href + `&${queryParamName}=${countryCode}`;
            } else {
                return href + `?${queryParamName}=${countryCode}`;
            }
        }
    };

    const setupUIElements = function () {
        const parentDiv = document.getElementsByClassName('top-refine')[0];
        if (!parentDiv) {
            return null;
        }

        const refineItem = document.createElement('div');
        refineItem.className = 'refine-item';

        const refineTitle = document.createElement('span');
        refineTitle.innerText = 'Ship from:';
        refineTitle.className = 'sort-title';
        refineItem.appendChild(refineTitle);

        const refineWrapper = document.createElement('div');
        refineWrapper.className = 'sort-by-wrapper';
        refineItem.appendChild(refineWrapper);

        const lineAfterSort = document.createElement('div');
        lineAfterSort.className = 'sort';
        lineAfterSort.appendChild(refineItem);
        parentDiv.appendChild(lineAfterSort);

        return refineWrapper;
    };

    const addShipFromOption = function (elementWrapper, countryCode) {
        const shipFromSpan = document.createElement('span');
        shipFromSpan.onclick = function () { console.log('click'); window.location.href = generateURLWithCountryCode(countryCode); };
        shipFromSpan.innerText = `Ship from ${countryCode}`;

        const isActive = window.location.href.indexOf(`${queryParamName}=${countryCode}`) > -1;
        shipFromSpan.className = 'sort-item' + (isActive ? ' active' : '');
        elementWrapper.appendChild(shipFromSpan);
    };

    const selectWrapper = setupUIElements();
    if (selectWrapper) {
        supportedCountryCodes.forEach(function (countryCode) {addShipFromOption(selectWrapper, countryCode);});
    }

})();