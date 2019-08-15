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
import { Link, withRouter } from 'react-router-dom';
import { isSignedIn } from 'Util/Auth';
import Overlay from 'Component/Overlay';
import Form from 'Component/Form';
import Field from 'Component/Field';
import Loader from 'Component/Loader';
import { CUSTOMER_ACCOUNT } from 'Component/Header';
import './MyAccountOverlay.style';
import isMobile from 'Util/Mobile';

export const STATE_SIGN_IN = 'signIn';
export const STATE_FORGOT_PASSWORD = 'forgotPassword';
export const STATE_FORGOT_PASSWORD_SUCCESS = 'forgotPasswordSuccess';
export const STATE_CREATE_ACCOUNT = 'createAccount';
export const STATE_LOGGED_IN = 'loggedIn';

class MyAccountOverlay extends PureComponent {
    constructor(props) {
        super(props);

        const { isPasswordForgotSend } = props;

        this.state = {
            state: isSignedIn() ? STATE_LOGGED_IN : STATE_SIGN_IN,
            // eslint-disable-next-line react/no-unused-state
            isPasswordForgotSend,
            isLoading: false
        };

        this.renderMap = {
            [STATE_SIGN_IN]: {
                render: () => this.renderSignIn(),
                title: 'Sign in to your account'
            },
            [STATE_FORGOT_PASSWORD]: {
                render: () => this.renderForgotPassword(),
                title: 'Get password link'
            },
            [STATE_FORGOT_PASSWORD_SUCCESS]: {
                render: () => this.renderForgotPasswordSuccess()
            },
            [STATE_CREATE_ACCOUNT]: {
                render: () => this.renderCreateAccount(),
                title: 'Create new account'
            },
            [STATE_LOGGED_IN]: {
                render: () => this.renderAccountActions()
            }
        };

        this.handleForgotPassword = this.handleForgotPassword.bind(this);
        this.handleForgotPasswordSuccess = this.handleForgotPasswordSuccess.bind(this);
        this.handleCreateAccount = this.handleCreateAccount.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const {
            isSignedIn,
            isPasswordForgotSend,
            showNotification,
            isOverlayVisible
        } = props;

        const {
            isPasswordForgotSend: currentIsPasswordForgotSend,
            state: myAccountState
        } = state;

        const stateToBeUpdated = {};

        if (!isOverlayVisible && !isSignedIn) {
            stateToBeUpdated.state = STATE_SIGN_IN;
        } else if (!isOverlayVisible && isSignedIn) {
            stateToBeUpdated.state = STATE_LOGGED_IN;
        }

        if (myAccountState !== STATE_LOGGED_IN && isSignedIn) {
            stateToBeUpdated.isLoading = false;
            showNotification('success', __('You are successfully logged in!'));
            stateToBeUpdated.state = STATE_LOGGED_IN;
        }

        if (myAccountState === STATE_LOGGED_IN && !isSignedIn) {
            stateToBeUpdated.state = STATE_SIGN_IN;
            showNotification('success', __('You are successfully logged out!'));
        }

        if (isPasswordForgotSend !== currentIsPasswordForgotSend) {
            stateToBeUpdated.isLoading = false;
            stateToBeUpdated.isPasswordForgotSend = isPasswordForgotSend;
            showNotification('success', __(`If there is an account associated with the
            provided address you will receive an email with a link to reset your password.`));
            stateToBeUpdated.state = STATE_SIGN_IN;
        }

        return Object.keys(stateToBeUpdated).length ? stateToBeUpdated : null;
    }

    componentDidUpdate(prevProps, prevState) {
        const { state: oldMyAccountState } = prevState;
        const { state: newMyAccountState } = this.state;
        const { history } = this.props;

        if (oldMyAccountState === newMyAccountState) return;

        if (newMyAccountState === STATE_LOGGED_IN && isMobile.any()) {
            history.push({ pathname: '/my-account', state: 'accountOverview' });
        }
    }

    async onSignInSuccess(fields) {
        const { signIn, showNotification } = this.props;

        try {
            await signIn(fields);
        } catch (e) {
            this.setState({ isLoading: false });
            showNotification('error', e.message);
        }
    }

    onSignInAttempt() {
        this.setState({ isLoading: true });
    }

    onCreateAccountAttempt(fields, invalidFields) {
        const { showNotification } = this.props;
        if (invalidFields) {
            showNotification('error', __('Incorrect data! Please resolve all field validation errors.'));
        }
        this.setState({ isLoading: !invalidFields });
    }

    onCreateAccountSuccess(fields) {
        const { createAccount } = this.props;
        const {
            password,
            email,
            firstname,
            lastname,
            is_subscribed
        } = fields;
        const customerData = {
            customer: {
                firstname,
                lastname,
                email,
                is_subscribed
            },
            password
        };

        createAccount(customerData);
    }

    onForgotPasswordSuccess(fields) {
        const { forgotPassword } = this.props;
        forgotPassword(fields);
    }

    onForgotPasswordAttempt() {
        this.setState({ isLoading: true });
    }

    onFormError() {
        this.setState({ isLoading: false });
    }

    handleForgotPassword() {
        const { setHeaderState } = this.props;

        this.setState({ state: STATE_FORGOT_PASSWORD });
        setHeaderState({ name: CUSTOMER_ACCOUNT, title: 'Forgot password' });
    }

    handleForgotPasswordSuccess() {
        this.setState({ state: STATE_FORGOT_PASSWORD_SUCCESS });
    }

    handleSignIn() {
        const { setHeaderState } = this.props;

        this.setState({ state: STATE_SIGN_IN });
        setHeaderState({ name: CUSTOMER_ACCOUNT, title: 'Sign in' });
    }

    handleCreateAccount() {
        const { setHeaderState } = this.props;

        this.setState({ state: STATE_CREATE_ACCOUNT });
        setHeaderState({ name: CUSTOMER_ACCOUNT, title: 'Create account' });
    }

    renderMyAccount() {
        const { state } = this.state;
        const { render, title } = this.renderMap[state];

        return (
            <div block="MyAccountOverlay" elem="Action" mods={ { state } }>
                <p block="MyAccountOverlay" elem="Heading">{ title }</p>
                { render() }
            </div>
        );
    }

    renderAccountActions() {
        const { logout, hideActiveOverlay } = this.props;
        const linkTo = {
            pathname: '/my-account',
            state: 'accountOverview'
        };

        return (
            <nav block="MyAccountOverlay" elem="Navigation">
                <ul>
                    <li><Link to={ linkTo } onClick={ hideActiveOverlay }>{ __('My Account') }</Link></li>
                    <li>
                        <button
                          block="Button"
                          mods={ { likeLink: true } }
                          onClick={ () => logout() }
                        >
                            { __('Logout') }
                        </button>
                    </li>
                </ul>
            </nav>
        );
    }

    renderForgotPassword() {
        const { state } = this.state;

        return (
            <>
                <Form
                  key="forgot-password"
                  onSubmit={ () => this.onForgotPasswordAttempt() }
                  onSubmitSuccess={ fields => this.onForgotPasswordSuccess(fields) }
                  onSubmitError={ () => this.onFormError() }
                >
                    <Field type="text" id="email" name="email" label="Email" validation={ ['notEmpty', 'email'] } />
                    <div block="MyAccountOverlay" elem="Buttons">
                        <button block="Button" type="submit" onClick={ this.handleForgotPasswordSuccess }>
                            { __('Send reset link') }
                        </button>
                    </div>
                </Form>
                <article block="MyAccountOverlay" elem="Additional" mods={ { state } }>
                    <section aria-labelledby="forgot-password-labe">
                        <h4 id="forgot-password-label">{ __('Already have an account?') }</h4>
                        <button
                          block="Button"
                          mods={ { likeLink: true } }
                          onClick={ this.handleSignIn }
                        >
                            { __('Sign in here') }
                        </button>
                    </section>
                    <section aria-labelledby="create-account-label">
                        <h4 id="create-account-label">{ __('Don`t have an account?') }</h4>
                        <button
                          block="Button"
                          mods={ { likeLink: true } }
                          onClick={ this.handleCreateAccount }
                        >
                            { __('Create an account') }
                        </button>
                    </section>
                </article>
            </>
        );
    }

    renderForgotPasswordSuccess() {
        const { state } = this.state;

        return (
            <article
              aria-labelledby="forgot-password-success"
              block="MyAccountOverlay"
              elem="Additional"
              mods={ { state } }
            >
                <h4 id="forgot-password-success">
                    { __('If there is an account associated with the provided address you will receive an email with a link to reset your password') }
                </h4>
                <button
                  block="Button"
                  onClick={ this.handleSignIn }
                >
                    { __('Got it') }
                </button>
            </article>
        );
    }

    renderCreateAccount() {
        const { state } = this.state;

        return (
            <>
                <Form
                  key="create-account"
                  onSubmit={ () => this.onCreateAccountAttempt() }
                  onSubmitSuccess={ fields => this.onCreateAccountSuccess(fields) }
                  onSubmitError={ (fields, invalidFields) => this.onCreateAccountAttempt(fields, invalidFields) }
                >
                    <fieldset block="MyAccountOverlay" elem="Legend">
                        <legend>{ __('Personal Information') }</legend>
                        <Field
                          type="text"
                          label="First Name"
                          id="firstname"
                          name="firstname"
                          validation={ ['notEmpty'] }
                        />
                        <Field
                          type="text"
                          label="Last Name"
                          id="lastname"
                          name="lastname"
                          validation={ ['notEmpty'] }
                        />
                        <Field
                          type="checkbox"
                          label={ __('Subscribe to ScandiPWA newsletter') }
                          id="is_subscribed"
                          mix={ { block: 'MyAccountOverlay', elem: 'Checkbox' } }
                          name="is_subscribed"
                        />
                    </fieldset>
                    <fieldset block="MyAccountOverlay" elem="Legend">
                        <legend>{ __('Sign-Up Information') }</legend>
                        <Field type="text" label="Email" id="email" name="email" validation={ ['notEmpty', 'email'] } />
                        <Field
                          type="password"
                          label={ __('Password') }
                          id="password"
                          name="password"
                          validation={ ['notEmpty', 'password'] }
                        />
                        <Field
                          type="password"
                          label={ __('Confirm password') }
                          id="confirm_password"
                          name="confirm_password"
                          validation={ ['notEmpty', 'password'] }
                        />
                    </fieldset>
                    <div block="MyAccountOverlay" elem="Buttons">
                        <button block="Button" type="submit">{ __('Sign up') }</button>
                    </div>
                </Form>
                <article block="MyAccountOverlay" elem="Additional" mods={ { state } }>
                    <section>
                        <h4>{ __('Already have an account?') }</h4>
                        <button
                          block="Button"
                          mods={ { likeLink: true } }
                          onClick={ this.handleSignIn }
                        >
                            { __('Sign in here') }
                        </button>
                    </section>
                </article>
            </>
        );
    }

    renderSignIn() {
        const { state } = this.state;

        return (
            <>
                <Form
                  key="sign-in"
                  onSubmit={ () => this.onSignInAttempt() }
                  onSubmitSuccess={ fields => this.onSignInSuccess(fields) }
                  onSubmitError={ () => this.onFormError() }
                >
                    <Field
                      type="text"
                      label={ __('Login or Email') }
                      id="email"
                      name="email"
                      validation={ ['notEmpty', 'email'] }
                    />
                    <Field
                      type="password"
                      label={ __('Password') }
                      id="password"
                      name="password"
                      validation={ ['notEmpty', 'password'] }
                    />
                    <div block="MyAccountOverlay" elem="Buttons">
                        <button block="Button">{ __('Sign in') }</button>
                    </div>
                    <button
                      block="Button"
                      mods={ { likeLink: true } }
                      onClick={ this.handleForgotPassword }
                    >
                        Forgot password?
                    </button>
                </Form>
                <article block="MyAccountOverlay" elem="Additional" mods={ { state } }>
                    <section>
                        <h4 id="forgot-password-label">{ __('New to ScandiPWA?') }</h4>
                        <button
                          block="Button"
                          onClick={ this.handleCreateAccount }
                        >
                            { __('Create an account') }
                        </button>
                    </section>
                </article>
            </>
        );
    }

    render() {
        const { isLoading } = this.state;

        return (
            <Overlay
              id="customer_account"
              mix={ { block: 'MyAccountOverlay' } }
            >
                <Loader isLoading={ isLoading } />
                { this.renderMyAccount() }
            </Overlay>
        );
    }
}

MyAccountOverlay.propTypes = {
    forgotPassword: PropTypes.func.isRequired,
    signIn: PropTypes.func.isRequired,
    isPasswordForgotSend: PropTypes.bool.isRequired,
    showNotification: PropTypes.func.isRequired,
    createAccount: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    isOverlayVisible: PropTypes.bool.isRequired,
    setHeaderState: PropTypes.func.isRequired,
    hideActiveOverlay: PropTypes.func.isRequired,
    history: PropTypes.shape({
        location: PropTypes.object.isRequired,
        push: PropTypes.func.isRequired
    }).isRequired,
    setHeaderState: PropTypes.func.isRequired
};

export default withRouter(MyAccountOverlay);
