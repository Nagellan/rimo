import type { Rectangle } from '../widgets/Rectangle';
import type { Circle } from '../widgets/Circle';

export interface Renderer {
	drawRectangle(rectangle: Rectangle): void;
	drawCircle(circle: Circle): void;
}
