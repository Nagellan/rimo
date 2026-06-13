import { useRef, type PointerEvent } from 'react';

import type { Widget } from '../entities/widgets/Widget';

export const useWidgetsPointerEvents = (
	onMoving: (
		coordinates: Array<{ id: string; x: number; y: number }>,
	) => void,
	onClick: (event: PointerEvent<HTMLCanvasElement>, id: string) => void,
) => {
	const movingWidgetIdRef = useRef<string>(null);
	const movedRef = useRef(false);
	const initialSelectedWidgetsCoordinates = useRef<
		Array<{ id: string; x: number; y: number }>
	>([]);
	const initialX = useRef(0);
	const initialY = useRef(0);

	const onWidgetsMoveStart = (
		selectedWidgetIds: string[],
		widgets: Record<string, Widget>,
		x: number,
		y: number,
		movingWidgetId: string,
	) => {
		movingWidgetIdRef.current = movingWidgetId;
		movedRef.current = false;
		if (selectedWidgetIds.includes(movingWidgetId)) {
			initialSelectedWidgetsCoordinates.current = selectedWidgetIds.map(
				(id) => ({
					id,
					x: widgets[id].x,
					y: widgets[id].y,
				}),
			);
		} else {
			initialSelectedWidgetsCoordinates.current = [
				{
					id: movingWidgetId,
					x: widgets[movingWidgetId].x,
					y: widgets[movingWidgetId].y,
				},
			];
		}
		initialX.current = x;
		initialY.current = y;
	};

	const onWidgetsMoving = (x: number, y: number) => {
		if (movingWidgetIdRef.current === null) return;

		movedRef.current = true;

		const deltaX = x - initialX.current;
		const deltaY = y - initialY.current;

		onMoving(
			initialSelectedWidgetsCoordinates.current.map((coordinate) => ({
				id: coordinate.id,
				x: coordinate.x + deltaX,
				y: coordinate.y + deltaY,
			})),
		);
	};

	const onWidgetsMoveEnd = (event: PointerEvent<HTMLCanvasElement>) => {
		if (movingWidgetIdRef.current !== null && !movedRef.current) {
			onClick(event, movingWidgetIdRef.current);
		}

		movingWidgetIdRef.current = null;
		movedRef.current = false;
		initialSelectedWidgetsCoordinates.current = [];
		initialX.current = 0;
		initialY.current = 0;
	};

	return {
		onWidgetsMoveStart,
		onWidgetsMoving,
		onWidgetsMoveEnd,
	};
};
