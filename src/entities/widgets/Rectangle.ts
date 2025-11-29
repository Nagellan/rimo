import type { Renderer } from '../renderers/Renderer';
import type { Style } from '../styles/Style';
import { Widget } from './Widget';

export class Rectangle extends Widget {
	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		style: Style,
	) {
		super(x, y, width, height, style);
	}

	public accept(renderer: Renderer) {
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
}
