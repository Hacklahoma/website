// NOTE - orientation is degrees clockwise from right divided by 45 (it's multiplied by pi/4 (shh it's fine))  CS style.
// UPDATED NOTE - though the above is still true, orientation no longer means anything at all
//                the enemy's gate is down
/*
 * This thing is currently very buggy.  Please improve it.
 */
var s;

var waypoints = new Array();

var traces;
var traceChildren;
var traceChildrenY;
var dots;
var dotChildren;
var dotChildrenY;

var scrollTop;
var height;
var windowHeight;
var target = 0;

// formatting constants
const dotSize = 1.6; // dot radius in px
const traceWidth = 1; // trace line width in px
const lanes = 5; // number of parallel trace lanes (may not all be filled)
const spacing = 10; // spacing multiplier (makes lanes and nodes farther apart)
const drawCompMult = 1.01; // adds a bit of length to straight segments, so they render better.  set to 1 to be normal.

// pattern constants - increasing mults makes more likely, increasing thresholds makes less likely
const nodeMult = 1.34 // likelihood of a node spawning, in a vacuum
const chainMult = 0.86 // additional likelihood of a node spawning if there is another node above it
const linearThreshold = 0.0 // threshold for a line to be drawn from a node to the one below it
const rightThreshold = 0.7 // threshold for a line to be drawn from a node to the one below and to the right of it
const leftThreshold = 0.7 // threshold for a line to be drawn from a node the one below and to the left of it

// colors
const dotColor = "#fff";
const emphasizedDotColor = "#f00";
const traceColor = "#fff";


function createDotArray(width, height, topRow) {
    var result = [];
    for (var i = 0 ; i < width; i++) {
        result[i] = [topRow[i]];
        for (var j = 1; j < height; j++) {
            result[i][j] = Math.min(Math.random() * nodeMult + result[i][j - 1] * chainMult | 0, 1);
        }
    }
    return result;
}

function coord(x, y) {
    this.x = x;
    this.y = y;
}

function getCoords(column, row, start, orientation) {
    var currentCoords = new coord(0, 0);
    if (orientation === 2) {
        currentCoords.x = start.x + column * spacing;
        currentCoords.y = start.y + row * spacing;
    } else if (orientation === 1) {
        currentCoords.x = start.x + ((column + row) * spacing);
        currentCoords.y = start.y + (row * spacing);
    } else if (orientation === 3) {
        currentCoords.x = start.x + ((column - row) * spacing);
        currentCoords.y = start.y + (row * spacing);
    }
    return currentCoords;
}

function drawLineSegment(start, orientation, direction) {
    drawLine(start, orientation, direction, spacing * drawCompMult);
}

// These bastardized square segments with trigonometric rotation is really annoying
// If you know the (probably obvious) solution to this, please update this code and let me know.
function drawLine(start, orientation, direction, length) {
    var end = new coord(0, 0);
    if (orientation === 2) {
        end.y = start.y + length;
        if (direction === 2) {
            end.x = start.x;
        } else if (direction === 1) {
            end.x = start.x + length;
        } else if (direction === 3) {
            end.x = start.x - length;
        }
    } else if (orientation === 1) {
        if (direction === 2) {
            end.x = start.x + length;
            end.y = start.y + length;
        } else if (direction === 1) {
            end.x = start.x + length;
            end.y = start.y;
        } else if (direction === 3) {
            end.x = start.x;
            end.y = start.y + length;
        }
    } else if (orientation === 3) {
        if (direction === 2) {
            end.x = start.x - length;
            end.y = start.y + length;
        } else if (direction === 1) {
            end.x = start.x;
            end.y = start.y + length;
        } else if (direction === 3) {
            end.x = start.x - length;
            end.y = start.y;
        }
    } else {
        console.log("Orientation: " + orientation + ", Direction: " + direction + ", wth did you do???");
    }
    length = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
    s.line(start.x, start.y, end.x, end.y).attr({stroke: traceColor, strokeWidth: traceWidth, "stroke-dasharray": length, "stroke-dashoffset": length, "length": length}).appendTo(traces);
}

// Look on my pyramid and despair!
// Also please get rid of all these repeated floating point operations.
// This draws traces at random given a starting coordinate, maximum length, and orientation
// Orientation 1 is 45 degrees clockwise from right, 2 is down, 3 is 45 degrees clockwise from down (artifact of old trig stuff)
function drawTraces(start, length, orientation, topRow) {
    var dotArray = createDotArray(lanes, Math.floor(length / spacing) + 1, topRow);
    for (var column = 0; column < dotArray.length; column++) {
        for (var row = 0; row < dotArray[0].length - 1; row++) {
            var currentCoords = getCoords(column, row, start, orientation);
            if (dotArray[column][row] === 1) {

                // debug circles: s.circle(currentCoords.x, currentCoords.y, dotSize).attr({fill: "#ddd"});

                // if there is a dot below this one, maybe draw a trace to it
                var j = 1;
                while (dotArray[column][row + j] === 1 && Math.random() > linearThreshold) {
                    dotArray[column][row + j - 1] = dotArray[column][row + j - 1] + 1;
                    dotArray[column][row + j] = dotArray[column][row + j] + 1;
                    j++;
                }
                if (j > 1) {
                    drawLine(currentCoords, orientation, 2, spacing * (j - 1));
                }

            } else if (dotArray[column][row] > 1 && dotArray[column][row + 1] < 1) {
                // if there is a dot below and to the right of this one, maybe draw a trace to it
                if (column + 1 < dotArray.length && dotArray[column + 1][row + 1]) {
                    if (Math.random() > rightThreshold) {
                        drawLineSegment(currentCoords, orientation, 1);
                        dotArray[column][row] = dotArray[column][row] + 1;
                        dotArray[column + 1][row + 1] = dotArray[column + 1][row + 1] + 1;
                    }
                }

                // if there is a dot below and to the left of this one, maybe draw a trace to it
                if (column - 1 > 0 && dotArray[column - 1][row + 1]) {
                    if (Math.random() > leftThreshold) {
                        drawLineSegment(currentCoords, orientation, 3);
                        dotArray[column][row] = dotArray[column][row] + 1;
                        dotArray[column - 1][row + 1] = dotArray[column - 1][row + 1] + 1;
                    }
                }
            }
        }
    }

    // draw trace dots (if they have exactly one connection)
    // tracked by incrementing members of dotArray when drawing the random traces
    for (var column = 0; column < dotArray.length; column++) {
        for (var row = 1; row < (dotArray[0].length - 1); row++) {
            var currentCoords = getCoords(column, row, start, orientation);
            var drawn = 0;
            if (dotArray[column][row] == 2) {
                s.circle(currentCoords.x, currentCoords.y, 0).attr({fill: dotColor}).appendTo(dots);
            } else if (dotArray[column][row] > 2) {
                //s.circle(currentCoords.x, currentCoords.y, 2).attr({fill: "#8df"}); // blue
            } else if (dotArray[column][row] == 1) {
                //s.circle(currentCoords.x, currentCoords.y, 2).attr({fill: "#cc0"}); // yellow
            }
        }
    }
    // console.log(dotArray);
    return dotArray;
}

function setup() {
    height = document.body.scrollHeight;
    windowHeight = $(window).height();

    s = Snap("#traces");

    traces = s.group();
    dots = s.group();

    waypoints.push(new coord(300, 100));
    waypoints.push(new coord(60, waypoints[0].y + 600));
    waypoints.push(new coord(120, 1500));
    waypoints.push(new coord(20, 2000));
}

$(document).ready(function() {
    if ($(window).width() < mobileMaxWidth) {
        return -1;
    }
    setup();

    var length;
    var intermediateCoord;
    var tempArray;
    lastEnds = [];
    for (var i; i < lanes; i++) {
        lastEnds[i] = 1;
    }
    //s.circle(waypoints[0].x, waypoints[0].y, 3).attr({fill: emphasizedDotColor});
    for (var i = 0; i < waypoints.length - 1; i++) {
        //s.circle(waypoints[i + 1].x, waypoints[i + 1].y, 3).attr({fill: emphasizedDotColor});

        length = waypoints[i + 1].y - waypoints[i].y - Math.abs(waypoints[i + 1].x - waypoints[i].x);

        tempArray = drawTraces(new coord(waypoints[i].x, waypoints[i].y), length, 2, lastEnds);
        // stellar work here vvv
        lastEnds = [];
        for (var j = 0; j < lanes; j++) {
            lastEnds[i] = tempArray[i][tempArray[0].length - 1] - 1;
        }

        intermediateCoord = new coord(waypoints[i].x, waypoints[i].y + length);
        if (waypoints[i + 1].x > waypoints[i].x) {
            tempArray = drawTraces(intermediateCoord, (waypoints[i + 1].x - waypoints[i].x), 1, lastEnds);
        } else if (waypoints[i + 1].x < waypoints[i].x) {
            tempArray = drawTraces(intermediateCoord, (waypoints[i].x - waypoints[i + 1].x), 3, lastEnds);
        }

        lastEnds = [];
        for (var j = 0; j < lanes; j++) {
            lastEnds[i] = tempArray[i][tempArray[0].length - 1] - 1;
        }
    }

    // at this point is becomes painfully obvious that this could have been done more cleanly
    traceChildren = traces.children();
    dotChildren = dots.children();
    traceChildrenY = calculateY(traceChildren);
    dotChildrenY = calculateY(dotChildren);
    traceChildrenLength = calculateLength(traceChildren);

    tracesScroll();
});

function calculateY(array) {
    out = [];
    for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
        out[i] = array[i].getBBox().y;
    }
    return out;
}

function calculateLength(array) {
    out = [];
    for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
        out[i] = array[i].attr("length");
    }
    return out;
}

function tracesScroll () {
    scrollTop = $(window).scrollTop();
    last = target;
    target = scrollTop + windowHeight * .4;
    var childY;

    for (var i = 0, arrayLen = traceChildren.length; i < arrayLen; i++) {
        let child = traceChildren[i];
        childY = traceChildrenY[i];

        if (childY <= target && childY > last) {
            Snap.animate(traceChildrenLength[i], 0, function( value ) {
                    child.attr({ "stroke-dashoffset": value});
            }, 250);
        } else if (childY < last && childY > target) {
            Snap.animate(0, traceChildrenLength[i], function( value ) {
                    child.attr({ "stroke-dashoffset": value});
            }, 250);
        }
    }
    for (var i = 0; i < dotChildren.length; i++) {
        let child = dotChildren[i];
        childY = dotChildrenY[i];

        if (childY <= target && childY > last) {
            child.animate({r: dotSize}, 250);
        } else if (childY < last && childY > target) {
            child.animate({r: 0}, 250);
        }
    }
}
