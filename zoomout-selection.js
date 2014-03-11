/**
 * Highstock plugin for zooming out X-Axis by dragging from right to left.
 *
 * Author: Roland Banguiran
 * Email: banguiran@gmail.com
 *
 * Usage: Set zoomType to 'x'.
 */

// JSLint options:
/*global Highcharts */

(function (H) {

    H.wrap(H.Chart.prototype, 'init', function (proceed) {

        // Run the original proceed method
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
 
        var chart = this,
            options = chart.options,
            zoomType = options.chart.zoomType,
            container = chart.container,
            xAxis = chart.xAxis[0],
            extremes,
            dataMin,
            dataMax,
            min,
            max,
            selectFromPixels,
            selectToPixels,
            pixelDiff,
            valueDiff,
            newMin,
            newMax;
            
        if (zoomType === 'x') {
            
            H.addEvent(container, 'mousedown', function (e) {
                selectFromPixels = chart.pointer.normalize(e).chartX;
            });
            
            H.addEvent(container, 'mouseup', function (e) {
                selectToPixels = chart.pointer.normalize(e).chartX;
                pixelDiff = selectToPixels - selectFromPixels;
            });
            
            H.addEvent(chart, 'selection', function (e) {
                console.log(e);
            
                if (pixelDiff < 0) {
                    extremes = xAxis.getExtremes();
                    dataMin = extremes.dataMin;
                    dataMax = extremes.dataMax;
                    min = extremes.min;
                    max = extremes.max;
                        
                    valueDiff = Math.abs(xAxis.toValue(selectToPixels) - xAxis.toValue(selectFromPixels));
                    newMin = min - valueDiff;
                    newMax = max + valueDiff;

                    newMin = (newMin > dataMin) ? newMin : dataMin;
                    newMax = (newMax < dataMax) ? newMax : dataMax;

                    xAxis.setExtremes(newMin, newMax);
                    
                    e.preventDefault();
                }
            });
        }
    });
}(Highcharts));
