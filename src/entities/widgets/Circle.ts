import { isInsideCircle } from '../../utils/geometry';
import type { Renderer } from '../renderers/Renderer';
import type { Style } from '../styles/Style';
import { Widget } from './Widget';

export class Circle extends Widget {
	private _radius: number;

	constructor(x: number, y: number, radius: number, style: Style) {
		super(x, y, style);
		this._radius = radius;
	}

	public get radius(): number {
		return this._radius;
	}

	public get width(): number {
		return this.radius * 2;
	}

	public get height(): number {
		return this.radius * 2;
	}

	public accept(renderer: Renderer) {
		renderer.drawCircle(this);
	}

	public containsPoint(x: number, y: number): boolean {
		const centerX = this.x + this.radius;
		const centerY = this.y - this.radius;
		return isInsideCircle(x, y, centerX, centerY, this.radius);
	}

	public resize(width: number, height: number) {
		this._radius = Math.min(width, height);
	}
}
