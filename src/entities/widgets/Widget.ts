import { nanoid } from 'nanoid';
import type { Renderer } from '../renderers/Renderer';
import type { Style } from '../styles/Style';

export abstract class Widget {
	public readonly id: string;
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	public style: Style;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		style: Style,
	) {
		this.id = nanoid();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.style = style;
	}

	public abstract accept(renderer: Renderer): void;
	public abstract clone(): Widget;
}
