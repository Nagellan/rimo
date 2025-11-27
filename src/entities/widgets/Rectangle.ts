import type { Renderer } from '../renderers/Renderer';
import type { Style } from '../styles/Style';
import { Widget } from './Widget';

export class Rectangle extends Widget {
	public width: number;
	public height: number;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		style: Style,
	) {
		super(x, y, style);
		this.width = width;
		this.height = height;
	}

	accept(renderer: Renderer) {
		renderer.drawRectangle(this);
	}
}
