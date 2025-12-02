import { nanoid } from 'nanoid';
import type { Renderer } from '../renderers/Renderer';
import type { Style } from '../styles/Style';

export abstract class Widget {
	public readonly id: string;
	protected _x: number;
	protected _y: number;
	protected _style: Style;

	constructor(x: number, y: number, style: Style) {
		this.id = nanoid();
		this._x = x;
		this._y = y;
		this._style = style;
	}

	public get x(): number {
		return this._x;
	}

	public get y(): number {
		return this._y;
	}

	public abstract get width(): number;

	public abstract get height(): number;

	public get style(): Style {
		return this._style;
	}

	public clone(): Widget {
		const clone = Object.create(Object.getPrototypeOf(this));
		Object.assign(clone, this);
		return clone;
	}

	public abstract duplicate(): Widget;

	public abstract accept(renderer: Renderer): void;

	public abstract containsPoint(x: number, y: number): boolean;

	public abstract resize(width: number, height: number): void;

	public reposition(x: number, y: number): void {
		this._x = x;
		this._y = y;
	}
}
