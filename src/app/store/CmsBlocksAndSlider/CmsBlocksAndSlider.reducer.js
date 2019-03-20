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
    UPDATE_CMS_BLOCKS,
    UPDATE_SLIDER
} from './CmsBlocksAndSlider.action';

const initialState = {
    blocks: {},
    slider: {}
};

const CmsBlocksAndSliderReducer = (state = initialState, action) => {
    switch (action.type) {
    case UPDATE_CMS_BLOCKS:
        const { blocks: { items: blockItems } } = action;
        const items = blockItems.reduce((o, item) => ({ ...o, [item.identifier]: item }), {});

        if (state.blocks.items) {
            return {
                ...state,
                blocks: { items: { ...state.blocks.items, ...items } }
            };
        }

        return {
            ...state,
            blocks: {
                items
            }
        };

    case UPDATE_SLIDER:
        const { slider } = action;

        return {
            ...state,
            slider
        };

    default:
        return state;
    }
};

export default CmsBlocksAndSliderReducer;