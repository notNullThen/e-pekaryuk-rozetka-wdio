import HomePage from '../pageobjects/home.page.js'
import dotenv from 'dotenv'
dotenv.config()

beforeEach(async () => {
    // Open marketplace url. Verify it
    await browser.maximizeWindow();
    await HomePage.open();
    await HomePage.uaLangBtn.click();
    await expect(browser).toHaveUrl('https://rozetka.com.ua/ua/');
});

describe('Home Page test', () => {
    it('Compare the sidebar categories names with opened pages names', async () => {
        let sbElemsCount = await HomePage.sbElems.length;

        for (let i = 0; i < sbElemsCount; i++) {
            if (i == 0 || i == 7 || i == 9 || i == 11 || i == sbElemsCount - 1) {
                continue;
            }
            let sbElemName = await HomePage.sbElems[i].getText();
            sbElemName = sbElemName.replace(/’/g, "'");
            await HomePage.sbElems[i].click();
            await expect(HomePage.headerTxt).toHaveText(sbElemName, { ignoreCase: true });
            // console.log(`***** "${sbElemName}" category is good`)
            await browser.back();
        }

    })

    it('should check the items names to contain the filtered brand name', async () => {
        let priceMin = process.env.PRICE_MIN;
        let priceMax = process.env.PRICE_MAX;
        
        // Open the category
        await HomePage.sbElems[4].click();
        await browser.pause(1000);
        await HomePage.subCategories[94].click();
        await browser.pause(1000);

        // Filters check
        let categoryID = process.env.BRAND_NAME;
        await $('[data-filter-name="producer"]').scrollIntoView();

        // Apply price filter (optional)
        await HomePage.priceMinFilter.setValue(priceMin.toString());
        await HomePage.priceMaxFilter.setValue(priceMax.toString());
        await HomePage.applyPriceFilterBtn.click();
        await $(`[data-id=${categoryID}]`).click();
        await browser.pause(2000);

        // Check items names to contain the brand name
        let filterItemsLength = await HomePage.itemNames.length;
        for (let i = 0; i < filterItemsLength; i++) {
            await expect(HomePage.itemNames[i]).toHaveTextContaining(categoryID, { ignoreCase: true });
        }
    })

    it('should check the price filter', async () => {
        // Open the category
        await HomePage.sbElems[4].click();
        await browser.pause(1000);
        await HomePage.subCategories[94].click();
        await browser.pause(1000);

        // Price check
        let pricesLength = 0;
        let pricesIntArr = [];
        let priceMin = parseInt(process.env.PRICE_MIN);
        let priceMax = parseInt(process.env.PRICE_MAX); //for some reason this int value should be parsed to int. in other case we have "Expected has type:  string" error

        // Filters apply and prices summ
        pricesIntArr = [];
        await $('[data-filter-name="producer"]').scrollIntoView();
        await HomePage.priceMinFilter.setValue(priceMin.toString());
        await HomePage.priceMaxFilter.setValue(priceMax.toString());
        await HomePage.applyPriceFilterBtn.click();
        await $('[data-id="ATEN"]').click();
        await $('[data-id="ATIS"]').click();
        await $('[data-id="AVC"]').click();
        await browser.pause(2000);

        pricesLength = await HomePage.itemPrices.length;
        for (let i = 0; i < pricesLength; i++) {
            let temp = await HomePage.itemPrices[i].getText();
            pricesIntArr.push(parseInt(temp.replace(/ /g, '')));
        }
        for (let i = 0; i < pricesLength; i++) {
            await expect(pricesIntArr[i]).toBeGreaterThan(priceMin - 1);
            await expect(pricesIntArr[i]).toBeLessThan(priceMax + 1);
        }

        await $('[data-filter-name="producer"]').scrollIntoView();
        await $('[data-id="ATEN"]').click();
        await $('[data-id="ATIS"]').click();
        await $('[data-id="AVC"]').click();
        await browser.pause(2000);

        pricesLength = await HomePage.itemPrices.length;
        for (let i = 0; i < pricesLength; i++) {
            let temp = await HomePage.itemPrices[i].getText();
            pricesIntArr.push(parseInt(temp.replace(/ /g, '')));
        }
        for (let i = 0; i < pricesLength; i++) {
            await expect(pricesIntArr[i]).toBeGreaterThan(priceMin - 1);
            await expect(pricesIntArr[i]).toBeLessThan(priceMax + 1);
        }
    })

    
    it('should test the price sorting options', async () => {
        let sortedItemsNamesPrices = [];
        let sortedItemsLength = 0;
        let priceSortingIsGood = true;
        
        // cheap first sorting option
        await HomePage.open();
        await HomePage.sbElems[8].click();
        await browser.pause(1000);
        await HomePage.subCategories[133].click();
        await HomePage.sortingSelector.selectByAttribute('value', '1: cheap');
        await browser.pause(3000);
        sortedItemsNamesPrices = [];
        sortedItemsLength = await HomePage.itemNames.length;
        priceSortingIsGood = true;
        for (let i = 0; i < sortedItemsLength; i++) {
            let temp = await HomePage.itemPrices[i].getText();
            sortedItemsNamesPrices.push(parseInt(temp.replace(/ /g, '')));
        }
        for (let i = 1; i < sortedItemsNamesPrices.length; i++) {
            let firstItemPrice = sortedItemsNamesPrices[i - 1];
            let secondItemPrice = sortedItemsNamesPrices[i];
            if (firstItemPrice > secondItemPrice) {
                priceSortingIsGood = false;
            }
        }
        await expect(priceSortingIsGood).toEqual(true);
        
        // expensive first sorting option
        await HomePage.open();
        await HomePage.sbElems[8].click();
        await browser.pause(1000);
        await HomePage.subCategories[133].click();
        await HomePage.sortingSelector.selectByAttribute('value', '2: expensive');
        await browser.pause(3000);
        sortedItemsNamesPrices = [];
        sortedItemsLength = await HomePage.itemNames.length;
        priceSortingIsGood = true;
        for (let i = 0; i < sortedItemsLength; i++) {
            let temp = await HomePage.itemPrices[i].getText();
            sortedItemsNamesPrices.push(parseInt(temp.replace(/ /g, '')));
        }
        for (let i = 1; i < sortedItemsNamesPrices.length; i++) {
            let firstItemPrice = sortedItemsNamesPrices[i - 1];
            let secondItemPrice = sortedItemsNamesPrices[i];
            if (firstItemPrice < secondItemPrice) {
                priceSortingIsGood = false;
            }
        }
        await expect(priceSortingIsGood).toEqual(true);
    })

    it('should test the basket', async () => {
        // Get items names and add it to the basket and calculate - 1st category
        await HomePage.sbElems[8].click();
        await browser.pause(1000);
        await HomePage.subCategories[5].click();
        await browser.pause(3000);
        await browser.scroll(0, 400);
        await browser.pause(1000);

        let itemsStoreNamesArr = [];
        let priceStoreArr = [];
        let priceStoreSum = 0;

        for (let i = 0; i < 3; i++) {
            await browser.pause(1000);
            // Items name
            itemsStoreNamesArr.push(await HomePage.itemNames[i].getText());
            // Price summing
            let temp = await HomePage.itemPrices[i].getText();
            priceStoreArr.push(parseInt(temp.replace(/ /g, '')));
            priceStoreSum += parseInt(temp.replace(/ /g, ''));
            await HomePage.itemBasketBtn[i].click();
        }

        // Get items names and add it to the basket and calculate - 2nd category
        await HomePage.open();
        await HomePage.sbElems[8].click();
        await browser.pause(1000);
        await HomePage.subCategories[133].click();
        await browser.pause(3000);
        await browser.scroll(0, 400);
        await browser.pause(1000);

        for (let i = 0; i < 3; i++) {
            await browser.pause(1000);
            // Items name
            itemsStoreNamesArr.push(await HomePage.itemNames[i].getText());
            // Price summing
            let temp = await HomePage.itemPrices[i].getText();
            priceStoreArr.push(parseInt(temp.replace(/ /g, '')));
            priceStoreSum += parseInt(temp.replace(/ /g, ''));
            await HomePage.itemBasketBtn[i].click();
        }

        // Check busket items
        await browser.pause(500);
        await HomePage.basketBtn.click();
        await browser.pause(500);

        let itemsBasketNamesArr = [];
        let priceBasketArr = [];
        let priceBasketSum = 0;
        let basketItemsCount = await HomePage.basketPriceValues.length;

        // Get names and sum prices
        for (let i = 0; i < basketItemsCount; i++) {
            itemsBasketNamesArr.push(await HomePage.basketItemNames[i].getText());
            let temp = await HomePage.basketPriceValues[i].getText();
            priceBasketArr.push(parseInt(temp.replace(/ /g, '')));
            priceBasketSum += parseInt(temp.replace(/ /g, ''));
        }

        let basketSumStr = await HomePage.basketSum.getText();
        let basketSumInt = parseInt(basketSumStr.replace(/ /g, ''));

        // Compare summed price with basket summed price
        await expect(priceStoreSum).toEqual(priceBasketSum);
        await expect(basketSumInt).toEqual(priceBasketSum);

        // Compare added items names with basket names
        let namesEqual = true;
        for (let i = 0; i < basketItemsCount; i++) {
            if (itemsStoreNamesArr[i] != itemsBasketNamesArr[basketItemsCount - i - 1]) {
                namesEqual = false;
            }
        }

        // Compare items store price with items basket price
        let pricesEqual = true;
        for (let i = 0; i < basketItemsCount; i++) {
            if (priceStoreArr[i] != priceBasketArr[basketItemsCount - i - 1]) {
                pricesEqual = false;
            }
        }

        await expect(namesEqual).toEqual(true);
        await expect(pricesEqual).toEqual(true);

        // Check the delete and the basket price summing function
        for (let i = 0; i < basketItemsCount; i++) {
            await browser.pause(1000);
            await HomePage.itemsThreeDotsBtns[0].click();
            await HomePage.itemDelBtn.click();
            priceBasketSum -= priceBasketArr.shift();
            let priceBasketArrSum = 0;
            for (let j = 0; j < priceBasketArr.length; j++) {
                priceBasketArrSum += priceBasketArr[j];
            }
            expect(priceBasketSum).toEqual(priceBasketArrSum);
        }

    })

    it('should test the search function', async () => {
        let searchQuery = ''
        let searchSuggestionsLength = 0
        let searchItemsLength = 0;

        // 'Google Pixel' search query
        searchQuery = 'Google Pixel'
        await HomePage.searchField.setValue(searchQuery);
        await browser.pause(1000);
        searchSuggestionsLength = await HomePage.searchSuggestions.length;
        for (let i = 0; i < searchSuggestionsLength; i++) {
            await expect(HomePage.searchSuggestions).toHaveTextContaining(searchQuery, { ignoreCase: true })
        }
        await HomePage.searchBtn.click();
        await browser.pause(1500);
        await browser.scroll(0, 400);
        await browser.pause(500);
        await expect(HomePage.itemNames[0]).toExist();
        searchItemsLength = await HomePage.itemNames.length;
        for (let i = 0; i < searchItemsLength; i++) {
            await expect(HomePage.itemNames[i]).toHaveTextContaining(searchQuery, { ignoreCase: true });
        }

        // 'iPhone' search query
        searchQuery = 'iPhone'
        await HomePage.searchField.setValue(searchQuery);
        await browser.pause(2000)
        searchSuggestionsLength = await HomePage.searchSuggestions.length;
        for (let i = 0; i < searchSuggestionsLength; i++) {
            await expect(HomePage.searchSuggestions).toHaveTextContaining(searchQuery, { ignoreCase: true })
        }
        await HomePage.searchBtn.click();
        await browser.pause(2000)
        await browser.scroll(0, 400);
        await browser.pause(500)
        await expect(HomePage.itemNames[0]).toExist();
        searchItemsLength = await HomePage.itemNames.length;
        for (let i = 0; i < searchItemsLength; i++) {
            await expect(HomePage.itemNames[i]).toHaveTextContaining(searchQuery, { ignoreCase: true });
        }
    })

    it('should test the Age 18+ confirmation pop-up', async () => {
        // Navigate to the 18+ page and fix the URL
        let sbElemsCount = await HomePage.sbElems.length;
        await HomePage.sbElems[sbElemsCount - 2].click();
        await browser.pause(1000);
        await HomePage.subCategories[1].click();
        let fullAgeURL = await browser.getUrl();

        // Check the Age 18+ confirmation pop-up Decline and Accept buttons
        await expect(HomePage.declineBtn).toExist();
        await expect(HomePage.confirmBtn).toExist();
        await HomePage.declineBtn.click();
        await expect(HomePage.headerTxt).toHaveText('Товари для дітей');

        await browser.url(fullAgeURL);
        await expect(HomePage.declineBtn).toExist();
        await expect(HomePage.confirmBtn).toExist();
        await HomePage.confirmBtn.click();
        await browser.scroll(0, 1000);
        await browser.pause(3000);
        await browser.refresh();
        await browser.scroll(0, 1000);
        await browser.pause(10000);
        await expect(HomePage.declineBtn).not.toExist();
        await expect(HomePage.confirmBtn).not.toExist();
    })
})