var Class = require('./class');
//let pathArray = new Array();
module.exports = Class({	
	initialize: function(path){
		this.reset().push(path);
	},

	/* parser */
	
	push: function(){
		var p = Array.prototype.join.call(arguments, ' ')
			.match(/[a-df-z]|[\-+]?(?:[\d\.]e[\-+]?|[^\s\-+,a-z])+/ig);
		if (!p) return this;

		var last, cmd = p[0], i = 1;
		while (cmd){
			switch (cmd){
				case 'm': this.move(p[i++], p[i++]); break;
				case 'l': this.line(p[i++], p[i++]); break;
				case 'c': this.curve(p[i++], p[i++], p[i++], p[i++], p[i++], p[i++]); break;
				case 's': this.curve(p[i++], p[i++], null, null, p[i++], p[i++]); break;
				case 'q': this.curve(p[i++], p[i++], p[i++], p[i++]); break;
				case 't': this.curve(p[i++], p[i++]); break;
				case 'a': this.arc(p[i+5], p[i+6], p[i], p[i+1], p[i+3], !+p[i+4], p[i+2]); i += 7; break;
				case 'h': this.line(p[i++], 0); break;
				case 'v': this.line(0, p[i++]); break;

				case 'M': this.moveTo(p[i++], p[i++]); break;
				case 'L': this.lineTo(p[i++], p[i++]); break;
				case 'C': this.curveTo(p[i++], p[i++], p[i++], p[i++], p[i++], p[i++]); break;
				case 'S': this.curveTo(p[i++], p[i++], null, null, p[i++], p[i++]); break;
				case 'Q': this.curveTo(p[i++], p[i++], p[i++], p[i++]); break;
				case 'T': this.curveTo(p[i++], p[i++]); break;
				case 'A': this.arcTo(p[i+5], p[i+6], p[i], p[i+1], p[i+3], !+p[i+4], p[i+2]); i += 7; break;
				case 'H': this.lineTo(p[i++], this.penY); break;
				case 'V': this.lineTo(this.penX, p[i++]); break;
				
				case 'Z': case 'z': this.close(); break;
				default: cmd = last; i--; continue;
			}

			last = cmd;
			if (last == 'm') last = 'l';
			else if (last == 'M') last = 'L';
			cmd = p[i++];
		}
		return this;
	},

	/* utility methods */

	reset: function(){
		this.penX = this.penY = 0;
		this.penDownX = this.penDownY = null;
		this._pivotX = this._pivotY = 0;
		this.transX = 0;
		this.transY = 0;
		this.onReset();
		return this;
	},
	setTranslate:function(x, y){
		this.transX = x;
		this.transY = y;
		return this;
	},

	move: function(x,y){
		this.onMove(this.penX, this.penY, this._pivotX = this.penX += (+x), this._pivotY = this.penY += (+y));
		return this;
	},
	moveTo: function(x,y){
		this.onMove(this.penX, this.penY, this._pivotX = this.penX = (+x), this._pivotY = this.penY = (+y));
		return this;
	},

	line: function(x,y){
		return this.lineTo(this.penX + (+x), this.penY + (+y));
	},
	lineTo: function(x,y){
		if (this.penDownX == null){ this.penDownX = this.penX; this.penDownY = this.penY; }
		this.onLine(this.penX, this.penY, this._pivotX = this.penX = (+x), this._pivotY = this.penY = (+y));
		return this;
	},
	
	curve: function(c1x, c1y, c2x, c2y, ex, ey){
		var x = this.penX, y = this.penY;
		return this.curveTo(
			x + (+c1x), y + (+c1y),
			c2x == null ? null : x + (+c2x),
			c2y == null ? null : y + (+c2y),
			ex == null ? null : x + (+ex),
			ey == null ? null : y + (+ey)
		);
	},
	curveTo: function(c1x, c1y, c2x, c2y, ex, ey){
		var x = this.penX, y = this.penY;
		if (c2x == null){
			c2x = +c1x; c2y = +c1y;
			c1x = (x * 2) - (this._pivotX || 0); c1y = (y * 2) - (this._pivotY || 0);
		}
		if (ex == null){
			this._pivotX = +c1x; this._pivotY = +c1y;
			ex = +c2x; ey = +c2y;
			c2x = (ex + (+c1x) * 2) / 3; c2y = (ey + (+c1y) * 2) / 3;
			c1x = (x + (+c1x) * 2) / 3; c1y = (y + (+c1y) * 2) / 3;
		} else {
			this._pivotX = +c2x; this._pivotY = +c2y;
		}
		if (this.penDownX == null){ this.penDownX = x; this.penDownY = y; }
		this.onBezierCurve(x, y, +c1x, +c1y, +c2x, +c2y, this.penX = +ex, this.penY = +ey);
		return this;
	},
	
	arc: function(x, y, rx, ry, outer, counterClockwise, rotation){
		return this.arcTo(this.penX + (+x), this.penY + (+y), rx, ry, outer, counterClockwise, rotation);
	},
	arcTo: function(x, y, rx, ry, outer, counterClockwise, rotation){
		ry = Math.abs(+ry || +rx || (+y - this.penY));
		rx = Math.abs(+rx || (+x - this.penX));

		if (!rx || !ry || (x == this.penX && y == this.penY)) return this.lineTo(x, y);

		var tX = this.penX, tY = this.penY, clockwise = !+counterClockwise, large = !!+outer;

		var rad = rotation ? rotation * Math.PI / 180 : 0, cos = Math.cos(rad), sin = Math.sin(rad);
		x -= tX; y -= tY;
		
		// Ellipse Center
		var cx = cos * x / 2 + sin * y / 2,
			cy = -sin * x / 2 + cos * y / 2,
			rxry = rx * rx * ry * ry,
			rycx = ry * ry * cx * cx,
			rxcy = rx * rx * cy * cy,
			a = rxry - rxcy - rycx;

		if (a < 0){
			a = Math.sqrt(1 - a / rxry);
			rx *= a; ry *= a;
			cx = x / 2; cy = y / 2;
		} else {
			a = Math.sqrt(a / (rxcy + rycx));
			if (large == clockwise) a = -a;
			var cxd = -a * cy * rx / ry,
			    cyd =  a * cx * ry / rx;
			cx = cos * cxd - sin * cyd + x / 2;
			cy = sin * cxd + cos * cyd + y / 2;
		}

		// Rotation + Scale Transform
		var xx =  cos / rx, yx = sin / rx,
		    xy = -sin / ry, yy = cos / ry;

		// Start and End Angle
		var sa = Math.atan2(xy * -cx + yy * -cy, xx * -cx + yx * -cy),
		    ea = Math.atan2(xy * (x - cx) + yy * (y - cy), xx * (x - cx) + yx * (y - cy));

		cx += tX; cy += tY;
		x += tX; y += tY;

		// Circular Arc
		if (this.penDownX == null){ this.penDownX = this.penX; this.penDownY = this.penY; }
		this.onArc(
			tX, tY, this._pivotX = this.penX = x, this._pivotY = this.penY = y,
			cx, cy, rx, ry, sa, ea, !clockwise, rotation
		);
		return this;
	},

	counterArc: function(x, y, rx, ry, outer){
		return this.arc(x, y, rx, ry, outer, true);
	},
	counterArcTo: function(x, y, rx, ry, outer){
		return this.arcTo(x, y, rx, ry, outer, true);
	},

	close: function(){
		if (this.penDownX != null){
			this.onClose(this.penX, this.penY, this.penX = this.penDownX, this.penY = this.penDownY);
			this.penDownX = null;
		}
		return this;
	},

	/* overridable handlers */
	
	onReset: function(){
		this.path = new Array();
	},

	onMove: function(sx, sy, ex, ey){
		//pathArray.push([sx, sy, sx, sy, ex, ey, ex, ey]);
	},

	onLine: function(sx, sy, ex, ey){
		this.onBezierCurve(sx, sy, sx, sy, ex, ey, ex, ey);
	},

	onBezierCurve: function(sx, sy, c1x, c1y, c2x, c2y, ex, ey){
		//this.path.push([sx + this.transX, sy + this.transY, c1x + this.transX, c1y + this.transY, c2x + this.transX, c2y + this.transY, ex + this.transX, ey + this.transY]);	
		this.path.push([sx , sy , c1x, c1y , c2x , c2y , ex , ey]);		
	},

	onArc: function(sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation){
		// Inverse Rotation + Scale Transform
		var rad = rotation ? rotation * Math.PI / 180 : 0, cos = Math.cos(rad), sin = Math.sin(rad),
			xx = cos * rx, yx = -sin * ry,
		    xy = sin * rx, yy =  cos * ry;

		// Bezier Curve Approximation
		var arc = ea - sa;
		if (arc < 0 && !ccw) arc += Math.PI * 2;
		else if (arc > 0 && ccw) arc -= Math.PI * 2;

		var n = Math.ceil(Math.abs(arc / (Math.PI / 2))),
		    step = arc / n,
		    k = (4 / 3) * Math.tan(step / 4);

		var x = Math.cos(sa), y = Math.sin(sa);

		for (var i = 0; i < n; i++){
			var cp1x = x - k * y, cp1y = y + k * x;

			sa += step;
			x = Math.cos(sa); y = Math.sin(sa);

			var cp2x = x + k * y, cp2y = y - k * x;

			this.onBezierCurve(
				sx, sy,
				cx + xx * cp1x + yx * cp1y, cy + xy * cp1x + yy * cp1y,
				cx + xx * cp2x + yx * cp2y, cy + xy * cp2x + yy * cp2y,
				(sx = (cx + xx * x + yx * y)), (sy = (cy + xy * x + yy * y))
			);
		}
	},

	onClose: function(sx, sy, ex, ey){
		if(sx === ex && sy=== ey){
		}else{
			this.onLine(sx, sy, ex, ey);
		}
	},
	getPointsArray(){
		if(this.transX ===0 && this.transY === 0){
		}else{
			for(let i = 0; i < this.path.length; i ++){
				
				this.path[i][0] += this.transX;
				this.path[i][1] += this.transY;
				this.path[i][2] += this.transX;
				this.path[i][3] += this.transY;
				this.path[i][4] += this.transX;
				this.path[i][5] += this.transY;
				this.path[i][6] += this.transX;
				this.path[i][7] += this.transY;
			}
		}
		return this.path;
	}
});