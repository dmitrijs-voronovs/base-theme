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
    UPDATE_CMS_PAGE,
    UPDATE_LOAD_STATUS
} from './CmsPage.action';

export const initialState = {
    page: {},
    isLoading: true
};

const CmsPageReducer = (state = initialState, action) => {
    switch (action.type) {
    case UPDATE_CMS_PAGE:
        const { page } = action;

        return {
            ...state,
            page
        };

    case UPDATE_LOAD_STATUS:
        const { isLoading } = action;

        return {
            ...state,
            isLoading
        };

    default:
        return state;
    }
};

export default CmsPageReducer;
