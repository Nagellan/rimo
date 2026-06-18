import { useRef, type PointerEvent } from 'react';

import type { Widget } from '../entities/widgets/Widget';
import type { Coordinate } from '../features/board/types';

const CLICK_THRESHOLD = 2;

type Coordinates = Record<string, Coordinate>;

export function useWidgetsPointerEvents(
	onMoving: (coordinates: Coordinates) => void,
	onClick: (event: PointerEvent<HTMLCanvasElement>, id: string) => void,
) {
	const pointedWidgetIdRef = useRef<string>(null);
	const movedRef = useRef(false);
	const initialCoordinatesRef = useRef<Coordinates>({});
	const initialXRef = useRef(0);
	const initialYRef = useRef(0);

	const onWidgetsMoveStart = (
		selectedWidgets: Widget[],
		startWidget: Widget,
		x: number,
		y: number,
	) => {
		pointedWidgetIdRef.current = startWidget.id;
		movedRef.current = false;
		if (startWidget.selected) {
			const coordinates: Coordinates = {};
			for (const widget of selectedWidgets) {
				coordinates[widget.id] = {
					x: widget.x,
					y: widget.y,
				};
			}
			initialCoordinatesRef.current = coordinates;
		} else {
			initialCoordinatesRef.current = {
				[startWidget.id]: {
					x: startWidget.x,
					y: startWidget.y,
				},
			};
		}
		initialXRef.current = x;
		initialYRef.current = y;
	};

	const onWidgetsMoving = (x: number, y: number) => {
		if (pointedWidgetIdRef.current === null) return;

		const deltaX = x - initialXRef.current;
		const deltaY = y - initialYRef.current;
		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

		if (distance < CLICK_THRESHOLD) return;

		movedRef.current = true;
		const coordinates: Coordinates = {};
		for (const id in initialCoordinatesRef.current) {
			const { x, y } = initialCoordinatesRef.current[id];
			coordinates[id] = {
				x: x + deltaX,
				y: y + deltaY,
			};
		}
		onMoving(coordinates);
	};

	const onWidgetsMoveEnd = (event: PointerEvent<HTMLCanvasElement>) => {
		if (pointedWidgetIdRef.current !== null && !movedRef.current) {
			onClick(event, pointedWidgetIdRef.current);
		}

		pointedWidgetIdRef.current = null;
		movedRef.current = false;
		initialCoordinatesRef.current = {};
		initialXRef.current = 0;
		initialYRef.current = 0;
	};

	return {
		onWidgetsMoveStart,
		onWidgetsMoving,
		onWidgetsMoveEnd,
	};
}
