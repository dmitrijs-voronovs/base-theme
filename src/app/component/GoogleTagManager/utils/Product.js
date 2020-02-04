/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { roundPrice } from 'Util/Price';
import { convertKeyValuesToQueryString } from 'Util/Url';
import GoogleTagManager, { EVENT_GENERAL } from 'Component/GoogleTagManager/GoogleTagManager.component';

/**
 * Product helper, contain all related to product data prepare methods
 */
class Product {
    /**
     * Get product variant product
     *
     * @param type_id
     * @param variants
     * @param configurableVariantIndex
     * @return {{}}
     */
    static getVariantObject({ type_id, variants, configurableVariantIndex } = {}) {
        if (type_id === 'configurable' && variants) {
            return variants && variants[configurableVariantIndex]
            && typeof variants[configurableVariantIndex].product !== 'undefined'
                ? variants[configurableVariantIndex].product
                : variants[configurableVariantIndex];
        }

        return null;
    }

    /**
     * Get product listing category string
     *
     * @param product
     * @return {string|null}
     */
    // eslint-disable-next-line no-unused-vars
    static getList(product) {
        const meta = GoogleTagManager.getEvent(EVENT_GENERAL).currentMeta.metaObject || {};

        return meta.name
            || meta.title
            || document.title.split('|').pop();
    }

    /**
     * Get Product category from product object
     *
     * @param categories
     * @return {string|null}
     */
    static getCategory({ categories } = {}) {
        if (!categories) return '';

        const lastCategory = categories.slice(-1).pop();
        const { url_path = '' } = lastCategory;

        return url_path;
    }

    /**
     * Get product Quantity from product object
     *
     * @param product
     * @return {number|null}
     */
    static getQuantity({ qty }) {
        return parseInt(qty, 10) || null;
    }

    /**
     * Get product brand from product object
     *
     * @param product
     * @return {string|null}
     */
    static getBrand(selectedVariant) {
        const { attributes = {} } = selectedVariant;
        const { brand: { attribute_value = '' } = {} } = attributes;
        return attribute_value;
    }

    /**
     * Get product name from product object
     *
     * @param product
     * @return {string|null}
     */
    static getName({ name }) {
        return name || '';
    }

    /**
     * Get Product Availability from product object
     *
     * @param product
     * @return {boolean|string}
     */
    static getAvailability({ stock_status } = {}) {
        return stock_status === 'IN_STOCK';
    }

    /**
     * Get product url
     *
     * @param item
     * @return {string|null}
     */
    static getUrl(product, selectedVariant) {
        const { url_key = '', configurable_options = {} } = product;
        const { attributes = {} } = selectedVariant;

        const keyValueAttributes = Object.keys(configurable_options).reduce((acc, key) => {
            if (attributes && key in attributes) {
                const { attribute_value = '' } = attributes[key];
                return { ...acc, [key]: attribute_value };
            }

            return acc;
        }, {});

        const queryString = `?${convertKeyValuesToQueryString(keyValueAttributes)}`;

        return `/${ url_key }${queryString.length === 1 ? '' : queryString }`;
    }

    static getSelectedVariant(product) {
        const { sku, variants } = product;
        return variants.find(({ sku: variantSku }) => sku === variantSku);
    }

    static getSelectedVariantIndex(product, sku) {
        const { variants = [] } = product;
        return variants.findIndex(({ sku: variantSku = '' }) => sku === variantSku);
    }

    /**
     * Get product data as object
     *
     * @param product
     *
     * @return {{quantity: number, price: number, name: string, variant: string, id: string, availability: boolean, list: string, category: string, brand: string}}
     */
    static getItemData(item) {
        if (item && Object.values(item).length) {
            const { product = {}, sku = '' } = item;
            const configurableVariantIndex = this.getSelectedVariantIndex(product, sku);

            return this.getProductData({ ...product, configurableVariantIndex });
        }

        return {};
    }

    /**
     * Get product data as object
     *
     * @param product
     *
     * @return {{quantity: number, price: number, name: string, variant: string, id: string, availability: boolean, list: string, category: string, brand: string}}
     */
    static getProductData(product) {
        const { sku, variants = [], configurableVariantIndex = this.getSelectedVariantIndex(product, sku) } = product;
        const selectedVariant = variants[configurableVariantIndex] || product;
        const {
            name,
            sku: variantSku,
            price: {
                regularPrice: {
                    amount: {
                        value,
                        currency
                    }
                }
            }
        } = selectedVariant;

        return {
            id: sku,
            url: this.getUrl(product, selectedVariant),
            name,
            price: roundPrice(value),
            brand: this.getBrand(selectedVariant),
            variant: variantSku,
            currency,
            availability: this.getAvailability(product)
        };
    }
}

export default Product;
