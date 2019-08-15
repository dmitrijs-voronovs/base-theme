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

import {
    UPDATE_PRODUCT_LIST_INFO,
    UPDATE_INFO_LOAD_STATUS
} from 'Store/ProductListInfo';

export const initialState = {
    totalItems: 0,
    minPrice: 0,
    maxPrice: 300,
    sortFields: {},
    filters: [],
    isLoading: true
};

const ProductListReducer = (state = initialState, action) => {
    const {
        type,
        isLoading,
        products: {
            filters,
            min_price: minPrice,
            max_price: maxPrice,
            total_count: totalItems,
            sort_fields: sortFields
        } = {}
    } = action;

    const {
        minPrice: stateMinPrice,
        maxPrice: stateMaxPrice
    } = state;

    switch (type) {
    case UPDATE_PRODUCT_LIST_INFO:
        return {
            ...state,
            filters,
            totalItems,
            sortFields,
            minPrice: Math.min(stateMinPrice, minPrice),
            maxPrice: Math.max(stateMaxPrice, maxPrice),
            isLoading: false
        };

    case UPDATE_INFO_LOAD_STATUS:
        return {
            ...state,
            isLoading
        };

    default:
        return state;
    }
};

export default ProductListReducer;
