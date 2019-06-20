import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Meta from 'Component/Meta';
import ContentWrapper from 'Component/ContentWrapper';
import './ProductCompare.style';

class ProductCompare extends Component {
    componentDidMount() {
        this.updateBreadcrumbs();
    }

    updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const breadcrumbs = [
            {
                url: '/product-compare',
                name: __('Product Compare')
            },
            {
                url: '/',
                name: __('Home')
            }
        ];

        updateBreadcrumbs(breadcrumbs);
    }

    render() {
        return (
            <main block="ProductCompare">
                <Meta metaObject={ { title: __('Product Compare') } } />
                <ContentWrapper
                  mix={ { block: 'ProductCompare' } }
                  wrapperMix={ { block: 'ProductCompare', elem: 'Wrapper' } }
                  label={ __('Product Compare') }
                >
                    <h1>Compare Products</h1>
                </ContentWrapper>
            </main>
        );
    }
}

ProductCompare.propTypes = {
    updateBreadcrumbs: PropTypes.func.isRequired
};

export default ProductCompare;
