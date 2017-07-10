// NOTE - orientation is degrees clockwise from right divided by 45 (it's multiplied by pi/4 (shh it's fine))  CS style.
// UPDATED NOTE - though the above is still true, orientation no longer means anything at all
//                the enemy's gate is down
/*
 * This thing is currently very buggy.  Please improve it.
 */
var s;

var waypoints = new Array();

// formatting constants
const dotSize = 1.6; // dot radius in px
const traceWidth = 1; // trace line width in px
const lanes = 5; // number of parallel trace lanes (may not all be filled)
const spacing = 10; // spacing multiplier (makes lanes and nodes farther apart)

// pattern constants - increasing mults makes more likely, increasing thresholds makes less likely
const nodeMult = 1.3 // likelihood of a node spawning, in a vacuum
const chainMult = 0.9 // additional likelihood of a node spawning if there is another node above it
const linearThreshold = 0.1 // threshold for a line to be drawn from a node to the one below it
const rightThreshold = 0.8 // threshold for a line to be drawn from a node to the one below and to the right of it
const leftThreshold = 0.8 // threshold for a line to be drawn from a node the one below and to the left of it

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

// These bastardized square segments with trigonometric rotation is really annoying
// If you know the (probably obvious) solution to this, please update this code and let me know.
function drawLineSegment(start, orientation, direction) {
    var end = new coord(0, 0);
    if (orientation === 2) {
        end.y = start.y + spacing;
        if (direction === 2) {
            end.x = start.x;
        } else if (direction === 1) {
            end.x = start.x + spacing;
        } else if (direction === 3) {
            end.x = start.x - spacing;
        }
    } else if (orientation === 1) {
        if (direction === 2) {
            end.x = start.x + spacing;
            end.y = start.y + spacing;
        } else if (direction === 1) {
            end.x = start.x + spacing;
            end.y = start.y;
        } else if (direction === 3) {
            end.x = start.x;
            end.y = start.y + spacing;
        }
    } else if (orientation === 3) {
        if (direction === 2) {
            end.x = start.x - spacing;
            end.y = start.y + spacing;
        } else if (direction === 1) {
            end.x = start.x;
            end.y = start.y + spacing;
        } else if (direction === 3) {
            end.x = start.x - spacing;
            end.y = start.y;
        }
    } else {
        console.log("Orientation: " + orientation + ", Direction: " + direction + ", wth did you do???");
    }
    s.line(start.x, start.y, end.x, end.y).attr({stroke: traceColor, strokeWidth: traceWidth});
}

// Look on my pyramid and despair!
// Also please get rid of all these repeated floating point operations.
// This draws traces at random given a starting coordinate, maximum length, and orientation
// Orientation 1 is 45 degrees clockwise from right, 2 is down, 3 is 45 degrees clockwise from down (artifact of old trig stuff)
function drawTraces(start, length, orientation, topRow) {
    var dotArray = createDotArray(lanes, Math.floor(length / spacing), topRow);
    var bottomRow = dotArray[dotArray.length - 1];
    console.log(dotArray);
    for (var column = 0; column < dotArray.length; column++) {
        for (var row = 0; row < dotArray[0].length - 1; row++) {

            var drawn = 0;
            if (dotArray[column][row] > 0) {
                var currentCoords = getCoords(column, row, start, orientation);
                // debug circles: s.circle(currentCoords.x, currentCoords.y, dotSize).attr({fill: "#ddd"});
                // if there is a dot below this one, maybe draw a trace to it
                if (dotArray[column][row + 1]) {
                    if (Math.random() > linearThreshold) {
                        drawLineSegment(currentCoords, orientation, 2);
                        dotArray[column][row] = dotArray[column][row] + 1;
                        dotArray[column][row + 1] = dotArray[column][row + 1] + 1;
                        drawn = 2;
                    }
                }
                // if there is a dot below and to the right of this one, maybe draw a trace to it
                if (column + 1 < dotArray.length && dotArray[column + 1][row + 1]) {
                    if (Math.random() > rightThreshold + .1 * drawn) {
                        drawLineSegment(currentCoords, orientation, 1);
                        dotArray[column][row] = dotArray[column][row] + 1;
                        dotArray[column + 1][row + 1] = dotArray[column + 1][row + 1] + 1;
                        // drawn = 2;
                    }
                }
                // if there is a dot below and to the left of this one, maybe draw a trace to it
                if (column - 1 > 0 && dotArray[column - 1][row + 1]) {
                    if (Math.random() > leftThreshold + .1 * drawn) {
                        drawLineSegment(currentCoords, orientation, 3);
                        dotArray[column][row] = dotArray[column][row] + 1;
                        dotArray[column - 1][row + 1] = dotArray[column - 1][row + 1] + 1;
                        // drawn = 2;
                    }
                }

            }
        }
    }

    // draw trace dots (if they have exactly one connection)
    // tracked by incrementing members of dotArray when drawing the random traces
    for (var column = 0; column < dotArray.length; column++) {
        for (var row = 0; row < dotArray[0].length - 1; row++) {
            var currentCoords = getCoords(column, row, start, orientation);
            var drawn = 0;
            if (dotArray[column][row] == 2) {
                s.circle(currentCoords.x, currentCoords.y, dotSize).attr({fill: dotColor});
            } else if (dotArray[column][row] >= 2) {
                //s.circle(currentCoords.x, currentCoords.y, 3).attr({fill: "#8df"});
            } else if (dotArray[column][row] == 1) {
                //s.circle(currentCoords.x, currentCoords.y, 3).attr({fill: "#cc0"});
            }
        }
    }

    return dotArray;
}

$(document).ready(function() {
    console.log("The cavalry's here!");
    s = Snap("#traces");

    var logo = $("#logo");
    waypoints.push(new coord(logo.offset().left + logo.width() * .4 - lanes * spacing / 2, logo.offset().top + logo.innerHeight() * .6));
    waypoints.push(new coord(60, waypoints[0].y + 600));
    waypoints.push(new coord(120, 1500));

    var length;
    var intermediateCoord;
    var tempArray;
    var lastEnds = [1, 1, 1, 1, 1];
    s.circle(waypoints[0].x, waypoints[0].y, 3).attr({fill: emphasizedDotColor});
    for (var i = 0; i < waypoints.length - 1; i++) {
        s.circle(waypoints[i + 1].x, waypoints[i + 1].y, 3).attr({fill: emphasizedDotColor});

        length = waypoints[i + 1].y - waypoints[i].y - Math.abs(waypoints[i + 1].x - waypoints[i].x) + spacing;

        tempArray = drawTraces(new coord(waypoints[i].x, waypoints[i].y), length, 2, lastEnds);
        lastEnds = [tempArray[0][tempArray[0].length - 1], tempArray[1][tempArray[0].length - 1], tempArray[2][tempArray[0].length - 1], tempArray[3][tempArray[0].length - 1], tempArray[4][tempArray[0].length - 1]];

        intermediateCoord = new coord(waypoints[i].x, waypoints[i].y + length - spacing);
        if (waypoints[i + 1].x > waypoints[i].x) {
            tempArray = drawTraces(intermediateCoord, (waypoints[i + 1].x - waypoints[i].x) + spacing, 1, lastEnds);
        } else if (waypoints[i + 1].x < waypoints[i].x) {
            tempArray = drawTraces(intermediateCoord, (waypoints[i].x - waypoints[i + 1].x) + spacing, 3, lastEnds);
        }

        lastEnds = [tempArray[0][tempArray[0].length - 1], tempArray[1][tempArray[0].length - 1], tempArray[2][tempArray[0].length - 1], tempArray[3][tempArray[0].length - 1], tempArray[4][tempArray[0].length - 1]];
    }
});
