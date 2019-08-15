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

export const UPDATE_CMS_PAGE = 'UPDATE_CMS_PAGE';
export const UPDATE_LOAD_STATUS = 'UPDATE_LOAD_STATUS';

/**
 * Update CMS Page information
 * @param {String} urlKey URL Key of the page that must be returned
 */
export const updateCmsPage = page => ({
    type: UPDATE_CMS_PAGE,
    page
});
