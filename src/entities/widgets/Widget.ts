import { nanoid } from 'nanoid';
import type { Renderer } from '../renderers/Renderer';
import type { Style } from '../styles/Style';

export abstract class Widget {
	readonly id: string;
	public x: number;
	public y: number;
	public style: Style;

	constructor(x: number, y: number, style: Style) {
		this.id = nanoid();
		this.x = x;
		this.y = y;
		this.style = style;
	}

	abstract accept(renderer: Renderer): void;
}
