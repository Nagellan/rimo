import { isInsideEllipse } from '../../utils/geometry';
import type { Renderer } from '../renderers/Renderer';
import type { Style } from '../styles/Style';
import { Widget } from './Widget';

export class Ellipse extends Widget {
	private _radiusX: number;
	private _radiusY: number;

	constructor(
		x: number,
		y: number,
		radiusX: number,
		radiusY: number,
		style: Style,
	) {
		super(x, y, style);
		this._radiusX = radiusX;
		this._radiusY = radiusY;
	}

	public get radiusX(): number {
		return this._radiusX;
	}

	public get radiusY(): number {
		return this._radiusY;
	}

	public get width(): number {
		return this.radiusX * 2;
	}

	public get height(): number {
		return this.radiusY * 2;
	}

	public duplicate(): Ellipse {
		return new Ellipse(
			this.x,
			this.y,
			this.radiusX,
			this.radiusY,
			this.style.clone(),
		);
	}

	public accept(renderer: Renderer) {
		renderer.drawEllipse(this);
	}

	public containsPoint(x: number, y: number): boolean {
		const centerX = this.x + this.radiusX;
		const centerY = this.y - this.radiusY;
		return isInsideEllipse(
			x,
			y,
			centerX,
			centerY,
			this.radiusX,
			this.radiusY,
		);
	}

	public resize(width: number, height: number) {
		this._radiusX = Math.floor(width / 2);
		this._radiusY = Math.floor(height / 2);
	}
}
