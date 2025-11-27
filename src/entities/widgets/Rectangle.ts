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

	public clone() {
		return new Rectangle(
			this.x,
			this.y,
			this.width,
			this.height,
			this.style.clone(),
		);
	}
}
