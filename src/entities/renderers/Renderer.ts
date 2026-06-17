import type { Rectangle, Circle, Ellipse } from '../widgets';

export interface Renderer {
	drawRectangle(rectangle: Rectangle): void;
	drawCircle(circle: Circle): void;
	drawEllipse(ellipse: Ellipse): void;
}
