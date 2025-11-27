import type { Renderer } from '../renderers/Renderer';
import type { Style } from '../styles/Style';
import { Widget } from './Widget';

export class Circle extends Widget {
	public radius: number;

	constructor(x: number, y: number, radius: number, style: Style) {
		super(x, y, radius * 2, radius * 2, style);
		this.radius = radius;
	}

	public accept(renderer: Renderer) {
		renderer.drawCircle(this);
	}

	public clone() {
		return new Circle(this.x, this.y, this.radius, this.style.clone());
	}
}
