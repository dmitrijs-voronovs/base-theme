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

import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { ProductType, FilterType } from 'Type/ProductList';
import { CartDispatcher } from 'Store/Cart';
import { getVariantsIndexes } from 'Util/Product';
import { convertKeyValueObjectToQueryString } from 'Util/Url';
import ProductCard from './ProductCard.component';

export const mapDispatchToProps = dispatch => ({
    addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

export class ProductCardContainer extends PureComponent {
    constructor(props) {
        super(props);

        this.containerFunctions = {
            getAttribute: this.getAttribute.bind(this)
        };

        this.containerProps = () => ({
            availableVisualOptions: this._getAvailableVisualOptions(),
            currentVariantIndex: this._getCurrentVariantIndex(),
            productOrVariant: this._getProductOrVariant(),
            thumbnail: this._getThumbnail(),
            linkTo: this._getLinkTo()
        });
    }

    getAttribute(code) {
        const { product: { attributes = [] } } = this.props;
        return attributes[code];
    }

    _getLinkTo() {
        const { product: { url_key }, product } = this.props;

        if (!url_key) return undefined;
        const { parameters } = this._getConfigurableParameters();
        return {
            pathname: `/product/${ url_key }`,
            state: { product },
            search: convertKeyValueObjectToQueryString(parameters)
        };
    }

    _getCurrentVariantIndex() {
        const { index } = this._getConfigurableParameters();
        return index >= 0 ? index : 0;
    }

    _getConfigurableParameters() {
        const { product: { variants = [] }, selectedFilters = {} } = this.props;
        const filterKeys = Object.keys(selectedFilters);

        if (filterKeys.length < 0) return { indexes: [], parameters: {} };

        const indexes = getVariantsIndexes(variants, selectedFilters);
        const [index] = indexes;

        if (!variants[index]) return { indexes: [], parameters: {} };
        const { attributes } = variants[index];

        const parameters = Object.entries(attributes)
            .reduce((parameters, [key, { attribute_value }]) => {
                if (filterKeys.includes(key)) return { ...parameters, [key]: attribute_value };
                return parameters;
            }, {});

        return { indexes, index, parameters };
    }

    _getThumbnail() {
        const { thumbnail: { path = '' } = {} } = this._getProductOrVariant();
        return path;
    }

    _getProductOrVariant() {
        const { product: { type_id, variants }, product } = this.props;
        return (type_id === 'configurable' && variants !== undefined
            ? variants[this._getCurrentVariantIndex()]
            : product
        ) || {};
    }

    _getAvailableVisualOptions() {
        const { product: { configurable_options = [] } } = this.props;

        return Object.values(configurable_options).reduce((acc, { attribute_options = {}, attribute_values }) => {
            const visualOptions = Object.values(attribute_options).reduce(
                (acc, { swatch_data: { type, value }, label, value: attrValue }) => {
                    if (type === '1' && attribute_values.includes(attrValue)) acc.push({ value, label });
                    return acc;
                }, []
            );

            if (visualOptions.length > 0) return [...acc, ...visualOptions];
            return acc;
        }, []);
    }

    render() {
        return (
            <ProductCard
              { ...this.props }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

ProductCardContainer.propTypes = {
    product: ProductType.isRequired,
    selectedFilters: FilterType
};

ProductCardContainer.defaultProps = {
    selectedFilters: {}
};

export default connect(null, mapDispatchToProps)(ProductCardContainer);
