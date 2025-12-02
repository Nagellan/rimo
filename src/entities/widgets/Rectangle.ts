import type { Renderer } from '../renderers/Renderer';
import type { Style } from '../styles/Style';
import { Widget } from './Widget';

export class Rectangle extends Widget {
	private _width: number;
	private _height: number;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		style: Style,
	) {
		super(x, y, style);
		this._width = width;
		this._height = height;
	}

	public get width(): number {
		return this._width;
	}

	public get height(): number {
		return this._height;
	}

	public accept(renderer: Renderer): void {
		renderer.drawRectangle(this);
	}

	public containsPoint(x: number, y: number): boolean {
		return (
			x >= this.x &&
			x <= this.x + this.width &&
			y >= this.y - this.height &&
			y <= this.y
		);
	}

	public resize(width: number, height: number): void {
		this._width = width;
		this._height = height;
	}
}
