/** 
 * This file contains functions for creating new SVG objects.
 * 
 * You must implement the required functions. 
 * 
 * You are encouraged to implement more helper functions here if you need to. 
 * 
 * You may find a tutorial on SVG at: http://www.w3schools.com/svg/ 
 */ 

//  Namespace for SVG elements, different than normal HTML element namespace.
var SVGNameSpace = "http://www.w3.org/2000/svg";

/**
 * Makes a new SVG line object and returns it. 
 *
 * @param x1 {number} 
 * @param y1 {number}
 * @param x2 {number}
 * @param y2 {number}
 * @param color {string} the color of the line
 * @param stroke {number} the thickness of the line.
 * @returns {object}
 *
 * This has been implemented to provide an example. 
 */
function makeLine(x1, y1, x2, y2, color, stroke) {

    var e = document.createElementNS(SVGNameSpace, "line");
    e.setAttribute("x1", x1);
    e.setAttribute("y1", y1);
    e.setAttribute("x2", x2);
    e.setAttribute("y2", y2);

    e.style.stroke      = color || "#000000";
    e.style.strokeWidth = stroke || 2;

    return e;

}

/**
* Makes and returns a new SVG rectange object. 
* 
* @param x {number} the x position of the rectangle.
* @param y {number} the y position of the rectangle.
* @param w {number} the width of the rectangle.
* @param h {number} the height of the rectangle.
* @param c {string} the color of the rectangle. 
* 
* @return {object} 
*/ 
function makeRectangle(x, y, w, h, c){
  var rect = document.createElementNS(SVGNameSpace, "rect");

  // set the attributes for the rectangle object.	
	rect.setAttribute("x", x);
	rect.setAttribute("y", y);
	rect.setAttribute("width", w);
	rect.setAttribute("height", h);
	rect.style.fill = c;
	
	rect.style.strokeWidth = 1;
   rect.style.stroke = "#000000";
	
  return rect;
}

function makeSquare(x, y, w, c){
  var rect = document.createElementNS(SVGNameSpace, "rect");

  // set the attributes for the rectangle object.	
    rect.setAttribute("x", x);
	rect.setAttribute("y", y);
	rect.setAttribute("width", w);
	rect.setAttribute("height", w);
	rect.style.fill = c;
	rect.style.stroke = "black";
	
  return rect;
}


/**
* Makes and returns a new SVG circle object. 
* 
* @param x {number} the x position of the circle.
* @param y {number} the y position of the circle.
* @param r {number} the radius 
* @param c {number} the color 
* 
* @return {object} 
*/
function makeStar(x,y,r,c){
    var star = document.createElementNS(SVGNameSpace, "polygon");
    
     // set the attributes for the circle object.
     r=r*1.3;
     off = -r*0.1
	var point1 = [x,y-0.9*r+off];
	var point2 = [x-0.6*r,y+0.98*r+off];
	var point3 = [x+0.9*r,y-.22*r+off];
	var point4 = [x-0.9*r,y-0.22*r+off];
	var point5 = [x+0.6*r,y+0.98*r+off];
	
	
	var points = ""+point1[0]+","+point1[1]+" "+point2[0]+","+point2[1]+" "+point3[0]+","+point3[1]+" "+point4[0]+","+point4[1]+" "+point5[0]+","+point5[1];
	star.setAttribute("points", points);
	star.style.stroke = "black";
    star.style.fill = c;
    

  return star;
}


/**
* Makes and returns a new SVG circle object. 
* 
* @param x {number} the x position of the circle.
* @param y {number} the y position of the circle.
* @param r {number} the radius 
* @param c {number} the color 
* 
* @return {object} 
*/
function makeCircle(x, y, r, c){

	var circ = document.createElementNS(SVGNameSpace, "circle"); 
	
    // set the attributes for the circle object.
	circ.setAttribute("cx", x);
	circ.setAttribute("cy", y);
	circ.setAttribute("r", r);
    circ.style.fill = c;
    circ.style.stroke = "black";
    
    return circ;

}

function makeTriangle(x, y, r, c){

	var tri = document.createElementNS(SVGNameSpace, "polygon"); 
    r = r*1.25;
    var off = -r*.15;
    // set the attributes for the circle object.
	var point1 = [x+r,y+r+off];
	var point2 = [x-r,y+r+off];
	var point3 = [x,y-r+off];
	var points = ""+point1[0]+","+point1[1]+" "+point2[0]+","+point2[1]+" "+point3[0]+","+point3[1];
	tri.setAttribute("points", points);
    tri.style.fill = c;
    tri.style.stroke = "black";
    
    return tri;

}

function makeShape(x, y, r, c, shape) {
    switch (shape) {
        case "Circle":
            return makeCircle(x, y, r, c);
        break;
        case "Triangle":
            return makeTriangle(x,y,r,c);
        break;
        case "Square":
            return makeSquare(x-r,y-r,2*r,c);
        break;
        case "Star":
            return makeStar(x,y,r,c);
        break;
        
    }
    
    return makeCircle(x, y, r, c);
    
}

/**
* Makes an SVG element. 
* 
* @param w {number} the width
* @param h {number} the height 
* 
* @return {object} 
*/
function makeSVG(w, h){
    var s = document.createElementNS(SVGNameSpace, "svg"); 
    s.setAttribute("width", w); 
    s.setAttribute("height", w); 
    s.setAttribute('xmlns', SVGNameSpace);
    s.setAttribute('xmlns:xlink',"http://www.w3.org/1999/xlink");
    return s;
}
