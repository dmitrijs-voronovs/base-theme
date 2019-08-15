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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GroupedProductsItem from 'Component/GroupedProductsItem';
import { ProductType } from 'Type/ProductList';

/**
 * Product description
 * @class GroupedProductList
 */
class GroupedProductList extends PureComponent {
    componentWillUnmount() {
        const { clearGroupedProductQuantity } = this.props;
        clearGroupedProductQuantity();
    }

    renderProductList(items) {
        return (
            <ul>
                { items.map(item => (
                    <GroupedProductsItem
                      key={ item.product.id }
                      product={ item.product }
                    />
                )) }
            </ul>
        );
    }

    render() {
        const {
            product: { items }
        } = this.props;

        return (
            <>
                { items && this.renderProductList(items)}
            </>
        );
    }
}

GroupedProductList.propTypes = {
    product: ProductType.isRequired,
    clearGroupedProductQuantity: PropTypes.func.isRequired
};

export default GroupedProductList;
