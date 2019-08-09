/* eslint-disable react/no-unused-state */
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
import React, { Component, createRef } from 'react';
import './Draggable.style';

class Draggable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDragging: false,
            originalX: 0,
            originalY: 0,
            translateX: 0,
            translateY: 0,
            lastTranslateX: 0,
            lastTranslateY: 0
        };

        this.draggableRef = createRef();

        this.mix = {};

        this.onFocus = this.onFocus.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('touchend', this.handleTouchEnd);
    }

    onFocus() {}

    onDrag() {}

    onDragEnd(state) {
        const { translateX, translateY } = state;

        // TO STAY WHERE RELEASED
        // originalX: 0,
        // originalY: 0,
        // lastTranslateX: translateX,
        // lastTranslateY: translateY,

        // TO RETURN INTO INITIAL
        // originalX: 0,
        // originalY: 0,
        // lastTranslateX: 0,
        // lastTranslateY: 0

        this.setState({
            originalX: 0,
            originalY: 0,
            lastTranslateX: translateX,
            lastTranslateY: translateY
        });
    }

    onDragStart() {}

    handleTouchStart({ touches }) {
        window.addEventListener('touchmove', this.handleTouchMove);
        window.addEventListener('touchend', this.handleTouchEnd);

        if (touches.length === 1) this._handleDragStart(touches[0]);
    }

    handleMouseDown(event) {
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);

        event.preventDefault();
        this._handleDragStart(event);
    }

    _handleDragStart({
        clientX,
        clientY
    }) {
        this.onDragStart();

        this.setState({
            originalX: clientX,
            originalY: clientY,
            isDragging: true
        });
    }

    handleTouchMove({ touches }) {
        if (touches.length === 1) this.handleMouseMove(touches[0]);
    }

    handleMouseMove({
        clientX,
        clientY
    }) {
        const { isDragging } = this.state;

        if (!isDragging) return;

        this.setState(({
            originalY,
            originalX,
            lastTranslateX,
            lastTranslateY
        }) => ({
            translateX: clientX - originalX + lastTranslateX,
            translateY: clientY - originalY + lastTranslateY
        }), () => {
            this.onDrag({ clientY, clientX });
        });
    }

    handleTouchEnd() {
        window.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('touchend', this.handleTouchEnd);

        this._handleDragEnd();
    }

    handleMouseUp() {
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);

        this._handleDragEnd();
    }

    handleDragStart() {}

    handleDragEnd() {}

    handleDrag() {}

    _handleDragEnd() {
        this.onDragEnd();
    }

    renderDraggableWrapper(children) {
        return children;
    }

    render() {
        const { children } = this.props;

        return this.renderDraggableWrapper(
            <div
              block="Draggable"
              mix={ { block: 'Slider', elem: 'Wrapper' } }
              ref={ this.draggableRef }
              onMouseDown={ this.handleMouseDown }
              onTouchStart={ this.handleTouchStart }
              onFocus={ this.onFocus }
              onDragStart={ this.handleDragStart }
              onDragEnd={ this.handleDragEnd }
              onDrag={ this.handleDrag }
              tabIndex={ 0 }
              role="button"
              aria-label="Draggable area"
            >
                { children }
            </div>
        );
    }
}

Draggable.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

export default Draggable;
