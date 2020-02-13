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

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { LocationType } from 'Type/Common';

import media, { PRODUCT_MEDIA } from 'Util/Media/Media';

import ProductGallery from './ProductGalleryBaseImage.component';

export const RESET_TRANSFORMATION_INTERVAL = 200;

export class ProductGalleryBaseImageContainer extends PureComponent {
    static propTypes = {
        disableZoom: PropTypes.func.isRequired,
        scale: PropTypes.number.isRequired,
        previousScale: PropTypes.number.isRequired,
        index: PropTypes.number.isRequired,
        mediaData: PropTypes.shape({
            label: PropTypes.string,
            file: PropTypes.string,
            base: PropTypes.shape({
                url: PropTypes.string
            })
        }).isRequired,
        resetTransform: PropTypes.func.isRequired,
        isZoomEnabled: PropTypes.bool.isRequired,
        location: LocationType.isRequired
    };

    constructor(props) {
        super(props);
        this.interval = null;
    }

    componentDidUpdate(prevProps) {
        const {
            scale,
            previousScale,
            disableZoom,
            location: { pathname },
            resetTransform
        } = this.props;
        const { location: { pathname: prevPathname } } = prevProps;

        if (pathname !== prevPathname && scale !== 1) {
            this.interval = setInterval(resetTransform, RESET_TRANSFORMATION_INTERVAL);
        }

        if (scale === 1 && this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        if (scale === 1 && previousScale !== 1) {
            disableZoom();
        }
    }

    containerProps = () => ({
        alt: this._getAlt(),
        src: this._getSrc()
    });

    _getAlt() {
        const { mediaData: { label } = {} } = this.props;
        return label || '';
    }

    _getSrc() {
        const {
            mediaData: { file, base: { url: baseUrl } = {} },
            isZoomEnabled
        } = this.props;

        if (!isZoomEnabled) return baseUrl || media(file, PRODUCT_MEDIA);
        return file ? media(file, PRODUCT_MEDIA) : baseUrl;
    }

    render() {
        return (
            <ProductGallery
              { ...this.containerProps() }
            />
        );
    }
}

export default withRouter(ProductGalleryBaseImageContainer);
