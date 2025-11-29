import type { Rectangle } from '../widgets/Rectangle';
import type { Circle } from '../widgets/Circle';
import type { Style } from '../styles/Style';
import type { Renderer } from './Renderer';

export class CanvasRenderer implements Renderer {
	private ctx: CanvasRenderingContext2D;

	private width: number;
	private height: number;

	private viewportX: number;
	private viewportY: number;

	private dpr: number;

	constructor(
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		viewportX: number,
		viewportY: number,
		dpr = 1,
	) {
		this.ctx = ctx;

		this.width = width;
		this.height = height;

		this.viewportX = viewportX;
		this.viewportY = viewportY;

		this.dpr = dpr;

		this.setup();
	}

	private setup() {
		this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
	}

	public setDpr(dpr: number) {
		this.dpr = dpr;
	}

	public setWidth(width: number) {
		this.width = width;
	}

	public setHeight(height: number) {
		this.height = height;
	}

	public setViewportX(viewportX: number) {
		this.viewportX = viewportX;
	}

	public setViewportY(viewportY: number) {
		this.viewportY = viewportY;
	}

	private get centerX() {
		return Math.floor(this.width / 2);
	}

	private get centerY() {
		return Math.floor(this.height / 2);
	}

	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	applyStyle(style: Style) {
		const {
			fillColor,
			strokeColor,
			strokeWidth,
			shadowColor,
			shadowBlur,
			shadowOffsetX,
			shadowOffsetY,
		} = style;

		if (fillColor) this.ctx.fillStyle = fillColor;
		if (strokeColor) this.ctx.strokeStyle = strokeColor;
		if (strokeWidth) this.ctx.lineWidth = strokeWidth;
		if (shadowColor) this.ctx.shadowColor = shadowColor;
		if (shadowBlur) this.ctx.shadowBlur = shadowBlur;
		if (shadowOffsetX) this.ctx.shadowOffsetX = shadowOffsetX;
		if (shadowOffsetY) this.ctx.shadowOffsetY = shadowOffsetY;

		if (fillColor) this.ctx.fill();
		if (strokeColor && strokeWidth) this.ctx.stroke();
	}

	drawRectangle(rectangle: Rectangle) {
		const { x, y, width, height, style } = rectangle;

		this.ctx.beginPath();
		this.ctx.rect(
			this.centerX + x + this.viewportX,
			this.centerY - y - this.viewportY,
			width,
			height,
		);

		this.applyStyle(style);
	}

	drawCircle(circle: Circle) {
		const { x, y, radius, style } = circle;

		this.ctx.beginPath();
		this.ctx.arc(
			this.centerX + x + radius + this.viewportX,
			this.centerY - y + radius - this.viewportY,
			radius,
			0,
			2 * Math.PI,
			false,
		);

		this.applyStyle(style);
	}
}
