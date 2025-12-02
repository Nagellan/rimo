import { isInsideCircle } from '../../utils/geometry';
import type { Widget } from '../widgets/Widget';
import { Rectangle } from '../widgets/Rectangle';
import { Circle } from '../widgets/Circle';
import { Style } from '../styles/Style';
import type { Renderer } from './Renderer';

const SELECTION_CIRCLE_RADIUS = 3;
const SELECTION_PADDING = 4;

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
		this.clear();
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

	public clear() {
		this.ctx.fillStyle = '#f3f3f3';
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.drawGrid();
	}

	public drawGrid() {
		const span = 20;
		this.ctx.fillStyle = '#c7c7c7';

		// Compute visible world-space bounds for the canvas
		const worldXMin = -this.centerX - this.viewportX;
		const worldXMax = this.width - this.centerX - this.viewportX;

		const worldYMax = this.centerY - this.viewportY; // top of screen in world coords
		const worldYMin = this.centerY - this.height - this.viewportY; // bottom of screen in world coords

		// Determine which grid indices (multiples of span) intersect the view
		const kxMin = Math.floor(worldXMin / span) - 1;
		const kxMax = Math.ceil(worldXMax / span) + 1;
		const kyMin = Math.floor(worldYMin / span) - 1;
		const kyMax = Math.ceil(worldYMax / span) + 1;

		for (let kx = kxMin; kx <= kxMax; kx++) {
			const worldX = kx * span;
			const screenX = this.centerX + worldX + this.viewportX + 0.5;
			for (let ky = kyMin; ky <= kyMax; ky++) {
				const worldY = ky * span;
				const screenY = this.centerY - worldY - this.viewportY + 0.5;
				this.ctx.beginPath();
				this.ctx.arc(screenX, screenY, 1.5, 0, Math.PI * 2, true);
				this.ctx.fill();
			}
		}
	}

	public applyStyle(style: Style) {
		const {
			fillColor,
			strokeColor,
			strokeWidth,
			strokeLineDash,
			shadowColor,
			shadowBlur,
			shadowOffsetX,
			shadowOffsetY,
		} = style;

		if (fillColor) this.ctx.fillStyle = fillColor;
		if (strokeColor) this.ctx.strokeStyle = strokeColor;
		if (strokeWidth) this.ctx.lineWidth = strokeWidth;
		if (strokeLineDash) this.ctx.setLineDash(strokeLineDash);
		if (shadowColor) this.ctx.shadowColor = shadowColor;
		if (shadowBlur) this.ctx.shadowBlur = shadowBlur;
		if (shadowOffsetX) this.ctx.shadowOffsetX = shadowOffsetX;
		if (shadowOffsetY) this.ctx.shadowOffsetY = shadowOffsetY;

		if (fillColor) this.ctx.fill();
		if (strokeColor && strokeWidth) this.ctx.stroke();
	}

	public drawRectangle(rectangle: Rectangle) {
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

	public drawCircle(circle: Circle) {
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

	public select(widget: Widget) {
		const rect = new Rectangle(
			widget.x - SELECTION_PADDING,
			widget.y + SELECTION_PADDING,
			widget.width + 2 * SELECTION_PADDING,
			widget.height + 2 * SELECTION_PADDING,
			new Style().stroke('blue', 1, [4, 4]),
		);
		this.drawRectangle(rect);

		const circleStyle = new Style().fill('white').stroke('blue', 1);
		const topLeftCircle = new Circle(
			widget.x - SELECTION_PADDING - SELECTION_CIRCLE_RADIUS,
			widget.y + SELECTION_PADDING + SELECTION_CIRCLE_RADIUS,
			SELECTION_CIRCLE_RADIUS,
			circleStyle,
		);
		this.drawCircle(topLeftCircle);
		const topRightCircle = new Circle(
			widget.x +
				widget.width +
				SELECTION_PADDING -
				SELECTION_CIRCLE_RADIUS,
			widget.y + SELECTION_PADDING + SELECTION_CIRCLE_RADIUS,
			SELECTION_CIRCLE_RADIUS,
			circleStyle,
		);
		this.drawCircle(topRightCircle);
		const bottomRightCircle = new Circle(
			widget.x +
				widget.width +
				SELECTION_PADDING -
				SELECTION_CIRCLE_RADIUS,
			widget.y -
				widget.height -
				SELECTION_PADDING +
				SELECTION_CIRCLE_RADIUS,
			SELECTION_CIRCLE_RADIUS,
			circleStyle,
		);
		this.drawCircle(bottomRightCircle);
		const bottomLeftCircle = new Circle(
			widget.x - SELECTION_PADDING - SELECTION_CIRCLE_RADIUS,
			widget.y -
				widget.height -
				SELECTION_PADDING +
				SELECTION_CIRCLE_RADIUS,
			SELECTION_CIRCLE_RADIUS,
			circleStyle,
		);
		this.drawCircle(bottomLeftCircle);
	}

	public getSelectionCorner(x: number, y: number, widget: Widget) {
		if (
			isInsideCircle(
				x,
				y,
				widget.x - SELECTION_PADDING,
				widget.y + SELECTION_PADDING,
				SELECTION_CIRCLE_RADIUS,
			)
		) {
			return 'top-left';
		}
		if (
			isInsideCircle(
				x,
				y,
				widget.x + widget.width + SELECTION_PADDING,
				widget.y + SELECTION_PADDING,
				SELECTION_CIRCLE_RADIUS,
			)
		) {
			return 'top-right';
		}
		if (
			isInsideCircle(
				x,
				y,
				widget.x + widget.width + SELECTION_PADDING,
				widget.y - widget.height - SELECTION_PADDING,
				SELECTION_CIRCLE_RADIUS,
			)
		) {
			return 'bottom-right';
		}
		if (
			isInsideCircle(
				x,
				y,
				widget.x - SELECTION_PADDING,
				widget.y - widget.height - SELECTION_PADDING,
				SELECTION_CIRCLE_RADIUS,
			)
		) {
			return 'bottom-left';
		}
		return null;
	}
}
