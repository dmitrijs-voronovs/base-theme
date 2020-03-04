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
import { connect } from 'react-redux';
import { showOfflineNotice, setBigOfflineNotice } from 'Store/Offline';
import { withRouter } from 'react-router';
import { LocationType } from 'Type/Common';
import OfflineNotice from './OfflineNotice.component';

export const mapStateToProps = state => ({
    isOffline: state.OfflineReducer.isOffline,
    isBig: state.OfflineReducer.isBig
});

export const mapDispatchToProps = dispatch => ({
    showOfflineNotice: isOffline => dispatch(showOfflineNotice(isOffline)),
    setBigOfflineNotice: isBig => dispatch(setBigOfflineNotice(isBig))
});

class OfflineNoticeContainer extends PureComponent {
    static propTypes = {
        setBigOfflineNotice: PropTypes.func.isRequired,
        showOfflineNotice: PropTypes.func.isRequired,
        location: LocationType.isRequired,
        isBig: PropTypes.bool.isRequired,
        isPage: PropTypes.bool
    };

    static defaultProps = {
        isPage: false
    };

    componentDidMount() {
        const { isPage } = this.props;

        if (!isPage) {
            this.handleNetworkChange();
            window.addEventListener('online', this.handleNetworkChange);
            window.addEventListener('offline', this.handleNetworkChange);
        }
    }

    componentDidUpdate(prevProps) {
        const { location: { pathname } } = this.props;
        const { location: { pathname: prevPathname } } = prevProps;

        if (pathname !== prevPathname) {
            const { isBig, setBigOfflineNotice } = this.props;
            if (isBig) setBigOfflineNotice(false);
        }
    }

    componentWillUnmount() {
        const { isPage } = this.props;

        if (!isPage) {
            window.removeEventListener('online', this.handleNetworkChange);
            window.removeEventListener('offline', this.handleNetworkChange);
        }
    }

    handleNetworkChange = () => {
        const {
            isBig, showOfflineNotice, setBigOfflineNotice
        } = this.props;

        if (navigator.onLine) {
            document.body.classList.remove('offline');
            showOfflineNotice(false);
        } else {
            document.body.classList.add('offline');
            showOfflineNotice(true);
            if (isBig) setBigOfflineNotice(false);
        }
    };

    render() {
        return (
            <OfflineNotice
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OfflineNoticeContainer));