(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.TabScale = factory());
}(this, function () { 'use strict';

    var TabScale;
    (function (TabScale) {
        var Scale = /** @class */ (function () {
            function Scale(vizContainerElement) {
                var _this = this;
                /**
                 * Allows for granular control of the CSS transform-origin property. If this value
                 * is set, it overrides any value set on the `scaleFrom` property.
                 */
                this.transformOrigin = undefined;

                /** Simple, predefined options for controlling how the visualization is scaled. */
                this.scaleFrom = TabScale.Options.ScaleFrom.BottomRight;
                /**
                 * Determines whether scaling occurs in response to changes in the horizontal
                 * or vertical window size. */
                this.scaleDirection = TabScale.Options.ScaleDirection.Horizontal;
                /**
                 * Width, in pixels to be used to account for the browser's scroll bar. If this
                 * is not used or set incorrectly, the scrollbar will appear to overlap part of
                 * the visualization.
                */
                this.scrollbarPixelWidth = 17;
                this._maxScalePct = 1;
                /**
                 * Initializes the scaling behavior by setting event listeners and using any
                 * user-defined configuration options provided. This method should be called **after**
                 * the visualization is embedded. The recommended option is to call this in the
                 * `onFirstInteractive` option in Tableau's JS API.
                 */
                this.initialize = function () {
                    let childIframes = _this.domVizContainer.shadowRoot.querySelectorAll('iframe');
                    if (childIframes.length !== 1) {
                        throw new ReferenceError('The DOM element where you are embedding your visualization must contain EXACTLY one <iframe> element.');
                    }
                    _this.domVizIframe = childIframes[0];
                    _this.domVizContainer.style.transformOrigin = _this.transformOrigin || _this.scaleFrom;
                    window.addEventListener('resize', _this.scale);
                    _this.scale();
                };
                /**
                 * Forces the viz to scale based on current window size. Should not be called before
                 * the `initialize` method is invoked. Generally, this low-level method shouldn't be
                 * used but there may be instances where a user to needs to force a resize.
                 */
                this.scale = function () {
                    _this.scaleViz(_this.scaleDirection);
                };
                this.scaleViz = function (scaleDirection) {
                    var vizPixels, windowPixels, offsetPixels, boundingRectangle = _this.domVizContainer.getBoundingClientRect();
                    switch (scaleDirection) {
                        case TabScale.Options.ScaleDirection.Horizontal:
                            windowPixels = window.innerWidth - _this.scrollbarPixelWidth;
                            offsetPixels = boundingRectangle.left;
                            vizPixels = parseInt(_this.domVizIframe.style.width);
                            break;
                        case TabScale.Options.ScaleDirection.Vertical:
                            windowPixels = window.innerHeight;
                            offsetPixels = boundingRectangle.top;
                            vizPixels = parseInt(_this.domVizIframe.style.height);
                            break;
                    }
                    var scalingFactor = (windowPixels - offsetPixels) / vizPixels;
                    if (_this._minScalePct && scalingFactor < _this._minScalePct)
                        scalingFactor = _this._minScalePct;
                    if (_this._maxScalePct && scalingFactor > _this._maxScalePct)
                        scalingFactor = _this._maxScalePct;
                    _this.domVizContainer.style.transform = "scale(" + scalingFactor + ")";
                };
                this.domVizContainer = vizContainerElement;
            }
            Object.defineProperty(Scale.prototype, "maxScalePct", {
                /**
                 * The value of maxScalePct, expressed as a percentage.
                 */
                get: function () {
                    return this._maxScalePct * 100;
                },
                /**
                 * Sets the value of maxScalePct. The value provided should be expressed as a
                 * percentage (i.e. 75 instead of 0.75). Setting this to `undefined` will
                 * remove any upper boundary from the scaling function.
                 *
                 * Be wary of unbounded scaling as the visualization will likely start to look
                 * very pixelated at a certain point.
                 */
                set: function (scalePct) {
                    if (!scalePct)
                        this._maxScalePct = undefined;
                    else
                        this._maxScalePct = scalePct / 100;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scale.prototype, "minScalePct", {
                /**
                 * The value of minScalePct, expressed as a percentage.
                 */
                get: function () {
                    return this._minScalePct * 100;
                },
                /**
                 * Sets the value of minScalePct. The value provided should be expressed as a
                 * percentage (i.e. 75 instead of 0.75). Setting this to `undefined` will
                 * remove any lower boundary from the scaling function.
                 */
                set: function (scalePct) {
                    if (!scalePct)
                        this._minScalePct = undefined;
                    else
                        this._minScalePct = scalePct / 100;
                },
                enumerable: true,
                configurable: true
            });
            return Scale;
        }());
        TabScale.Scale = Scale;
        /**
         * Used to handle simple embedding scenario, in particular those cases where a user
         * wants to leverage the Embed Code provided by Tableau Server, Online, or Public.
         * This method uses a sensible set of defaults that should be sufficient for the
         * vast majority of simple embed use cases but allows no configuration or
         * customization.
         *
         * Example:
         * ```html
         * <!DOCTYPE html>
         * <html>
         *    <head>
         *        <title>Tableau Embedded - Dynamic Scaling</title>
         *        <!-- Add a reference to the tabscale lib -->
         *        <script type="text/javascript" src="./tabscale.js"></script>
         *    </head>
         *    <!-- On load, call the handleScaling function and provide the div ID where the viz is embedded -->
         *    <body onload="javascript: TabScale.handleScaling('tableauViz');">
         *        <div>Tableau Embedded - Dynamic Scaling</div>
         *        <div id="tableauViz">
         *            <!-- EMBED CODE FROM TABLEAU GOES HERE -->
         *        </div>
         *    </body>
         * </html>
         * ````
         */
        TabScale.handleScaling = function (nodeId) {
            var targetNode = document.getElementById(nodeId);
            var observerCallback = function (mutationsList, observer) {
                var mutation;
                for (var _i = 0, mutationsList_1 = mutationsList; _i < mutationsList_1.length; _i++) {
                    mutation = mutationsList_1[_i];
                    if (mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(function (node) {
                            if (node.tagName.toUpperCase() === 'IFRAME') {
                                var tabscale = new Scale(targetNode);
                                tabscale.initialize();
                            }
                        });
                    }
                }
            };
            var observer = new MutationObserver(observerCallback);
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
        };
        var ScaleFrom;
        (function (ScaleFrom) {
            ScaleFrom["TopLeft"] = "50% 50%";
            ScaleFrom["TopRight"] = "0% 50%";
            ScaleFrom["BottomLeft"] = "50% 0%";
            ScaleFrom["BottomRight"] = "0% 0%";
        })(ScaleFrom || (ScaleFrom = {}));
        var ScaleDirection;
        (function (ScaleDirection) {
            ScaleDirection[ScaleDirection["Horizontal"] = 0] = "Horizontal";
            ScaleDirection[ScaleDirection["Vertical"] = 1] = "Vertical";
        })(ScaleDirection || (ScaleDirection = {}));
        TabScale.Options = {
            ScaleFrom: ScaleFrom,
            ScaleDirection: ScaleDirection
        };
    })(TabScale || (TabScale = {}));
    var TabScale$1 = TabScale;

    return TabScale$1;

}));
