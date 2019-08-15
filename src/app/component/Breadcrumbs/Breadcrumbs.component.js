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
import Link from 'Component/Link';
import ContentWrapper from 'Component/ContentWrapper';
import { BreadcrumbsType } from 'Type/Breadcrumbs';
import './Breadcrumbs.style';
import TextPlaceholder from 'Component/TextPlaceholder';

/**
 * Breadcrumbs
 * @class Breadcrumbs
 */
class Breadcrumbs extends PureComponent {
    renderBreadcrumb({ url, name }, i) {
        const { breadcrumbs } = this.props;
        const isDisabled = !url || breadcrumbs.length - 1 === i;

        return (
            <li
              block="Breadcrumbs"
              elem="Crumb"
              key={ i }
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
                <Link
                  block="Breadcrumbs"
                  elem="Link"
                  to={ url || '' }
                  tabIndex={ isDisabled ? '-1' : '0' }
                  itemType="https://schema.org/Thing"
                  itemProp="item"
                >
                    <span itemProp="name">
                        <TextPlaceholder content={ name } />
                    </span>
                    <meta itemProp="position" content={ i } />
                </Link>
            </li>
        );
    }

    renderBreadcrumbList(breadcrumbs) {
        return breadcrumbs.map((_, i) => this.renderBreadcrumb(
            breadcrumbs[breadcrumbs.length - 1 - i], i
        ));
    }

    render() {
        const { breadcrumbs, areBreadcrumbsVisible } = this.props;

        if (!areBreadcrumbsVisible) return null;

        return (
            <ContentWrapper mix={ { block: 'Breadcrumbs' } } label={ __('Breadcrumbs (current location)...') }>
                <nav aria-label="Breadcrumbs navigation">
                    <ul
                      block="Breadcrumbs"
                      elem="List"
                      itemScope
                      itemType="https://schema.org/BreadcrumbList"
                    >
                        { breadcrumbs.length
                            ? this.renderBreadcrumbList(breadcrumbs)
                            : this.renderBreadcrumb({}, 0)
                        }
                    </ul>
                </nav>
            </ContentWrapper>
        );
    }
}

Breadcrumbs.propTypes = {
    breadcrumbs: BreadcrumbsType.isRequired,
    areBreadcrumbsVisible: PropTypes.bool.isRequired
};

export default Breadcrumbs;
