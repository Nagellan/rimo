import type { Renderer } from '../renderers/Renderer';
import type { Style } from '../styles/Style';
import { Widget } from './Widget';

export class Circle extends Widget {
	public radius: number;

	constructor(x: number, y: number, radius: number, style: Style) {
		super(x, y, style);
		this.radius = radius;
	}

	accept(renderer: Renderer) {
		renderer.drawCircle(this);
	}
}
