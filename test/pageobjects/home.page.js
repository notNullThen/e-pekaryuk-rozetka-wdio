import Page from './page.js';

class HomePage extends Page {
    get searchField() {
        return $('[search-input]')
    }
    get searchBtn() {
        return $('button.search-form__submit')
    }
    get searchSuggestions() {
        return $$('header form a > span')
    }
    get sbElems() {
        return $$('aside rz-sidebar-fat-menu a')
    }
    get headerTxt() {
        return $('section h1')
    }
    get itemNames() {
        // return $$('app-goods-tile-default a > span')
        return $$('app-goods-tile-default div > a > span')
    }
    get subCategories() {
        return $$('rz-list-tile a')
    }

    // Filters
    get filterCheckboxes() {
        return $$('aside a')
    }
    get priceMinFilter() {
        return $('[formcontrolname="min"]')
    }
    get priceMaxFilter() {
        return $('[formcontrolname="max"]')
    }
    get applyPriceFilterBtn() {
        return $('button=Ok')
    }

    // Sotring
    get sortingSelector() {
        return $('rz-sort select')
    }


    // Confirm 18+ years dialog
    get confirmBtn() {
        return $('div.rz-btn_blue')
    }
    get declineBtn() {
        return $('div.rz-btn_gray')
    }

    // Price
    get itemPrices() {
        return $$('rz-catalog-tile div > p > span')
    }

    // Localization
    get uaLangBtn() {
        return $('[alt="ua"]');
    }

    // Basket
    get basketBtn() {
        return $('[rzopencart]')
    }
    get itemBasketBtn() {
        return $$('app-buy-button')
    }
    get basketPriceValues() {
        return $$('[data-testid="cost"]')
    }
    get basketItemNames() {
        return $$('[data-testid="title"]')
    }
    get basketSum() {
        return $('[data-testid="cart-receipt-sum"]')
    }
    get itemsThreeDotsBtns() {
        return $$('rz-popup-menu button')
    }
    get itemDelBtn() {
        return $('rz-trash-icon button')
    }




    open() {
        return super.open('');
    }

}

export default new HomePage();
