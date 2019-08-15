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

/* eslint-disable no-param-reassign */

export const TYPE_CUSTOM_URL = 0;
export const TYPE_CMS_PAGE = 1;
export const TYPE_CATEGORY = 2;

export class MenuReducer {
    getMenuUrl(url_type, url) {
        switch (url_type) {
        case TYPE_CATEGORY:
            return `/category${url}`;
        case TYPE_CMS_PAGE:
            return `/page${url}`;
        default:
            return url;
        }
    }

    getMenuData({ url, url_type, ...item }) {
        return {
            ...item,
            url: this.getMenuUrl(url_type, url),
            children: {}
        };
    }

    getSortedItems(unsortedItems) {
        return unsortedItems.sort((
            { parent_id: PID, position: P },
            { parent_id: prevPID, position: prevP }
        ) => (PID - prevPID) || (P - prevP));
    }

    setToValue(obj, path, value) {
        let i;
        path = path.split('.');
        for (i = 0; i < path.length - 1; i++) obj = obj[path[i]];
        obj[path[i]] = value;
    }

    createItem(data) {
        const { parent_id, item_id } = data;

        if (parent_id === 0) {
            this.menuPositionReference[item_id] = [];
            this.menu[item_id] = this.getMenuData(data);
        } else {
            this.menuPositionReference[item_id] = [
                ...this.menuPositionReference[parent_id],
                parent_id
            ];

            this.setToValue(
                this.menu,
                `${this.menuPositionReference[item_id].join('.children.')}.children.${item_id}`,
                this.getMenuData(data)
            );
        }
    }

    reduce({ items: unsortedItems }) {
        this.menu = {};
        this.menuPositionReference = {};

        this.getSortedItems(unsortedItems).forEach((realMenuItem) => {
            this.createItem(realMenuItem);
        });

        return this.menu;
    }
}

export default new MenuReducer();
