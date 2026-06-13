import type { PointerEvent, RefObject } from 'react';

import { BOARD_ACTION_TYPE } from '../features/board/actions';
import { useBoardState } from '../features/board/contexts';
import { useResizeWidgets } from './useResizeWidgets';
import { useViewportPointerEvents } from './useViewportPointerEvents';
import { useWidgetsPointerEvents } from './useWidgetsPointerEvents';
import type { CanvasRenderer } from '../entities/renderers/CanvasRenderer';

export function useCanvasPointerEvents(
	width: number,
	height: number,
	rendererRef: RefObject<CanvasRenderer | null>,
) {
	const [{ viewportX, viewportY, widgets, selectedWidgetIds }, dispatch] =
		useBoardState();

	const { onViewportMoveStart, onViewportMoving, onViewportMoveEnd } =
		useViewportPointerEvents(
			(offsetX, offsetY) => {
				dispatch({
					type: BOARD_ACTION_TYPE.MOVE_VIEWPORT,
					payload: { x: offsetX, y: offsetY },
				});
			},
			() => {
				dispatch({
					type: BOARD_ACTION_TYPE.RESET_WIDGET_SELECTION,
				});
			},
		);

	const { onWidgetsMoveStart, onWidgetsMoving, onWidgetsMoveEnd } =
		useWidgetsPointerEvents(
			(coordinates) => {
				dispatch({
					type: BOARD_ACTION_TYPE.MOVE_WIDGETS,
					payload: { coordinates },
				});
			},
			(event, id) => {
				if (event.shiftKey) {
					dispatch({
						type: BOARD_ACTION_TYPE.TOGGLE_WIDGET_SELECTION,
						payload: { id },
					});
				} else {
					dispatch({
						type: BOARD_ACTION_TYPE.SELECT_WIDGET,
						payload: { id },
					});
				}
			},
		);

	const { onWidgetResizeStart, onWidgetResizing, onWidgetResizeEnd } =
		useResizeWidgets((coordinates) => {
			dispatch({
				type: BOARD_ACTION_TYPE.RESIZE_WIDGETS,
				payload: { coordinates },
			});
		});

	function getCenteredCoordinates(
		offsetX: number,
		offsetY: number,
	): [number, number] {
		return [
			offsetX - (Math.floor(width / 2) + viewportX),
			Math.floor(height / 2) - viewportY - offsetY,
		];
	}

	function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
		const [x, y] = getCenteredCoordinates(
			event.nativeEvent.offsetX,
			event.nativeEvent.offsetY,
		);

		for (const widgetId of selectedWidgetIds) {
			const widget = widgets[widgetId];

			const widgetSelectionCorner =
				rendererRef.current?.getSelectionCorner(x, y, widget) ?? null;

			// pointer is down on widget selection corner
			if (widgetSelectionCorner !== null) {
				onWidgetResizeStart(
					selectedWidgetIds,
					widgets,
					widgetSelectionCorner,
					x,
					y,
				);
				return;
			}
		}

		for (const widget of Object.values(widgets)) {
			// pointer is down on widget
			if (widget.containsPoint(x, y)) {
				onWidgetsMoveStart(selectedWidgetIds, widgets, x, y, widget.id);
				return;
			}
		}

		// pointer is down on grid
		onViewportMoveStart(
			viewportX,
			viewportY,
			event.nativeEvent.offsetX,
			event.nativeEvent.offsetY,
		);
	}

	function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
		const [x, y] = getCenteredCoordinates(
			event.nativeEvent.offsetX,
			event.nativeEvent.offsetY,
		);

		onViewportMoving(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
		onWidgetsMoving(x, y);
		onWidgetResizing(x, y);
	}

	function handlePointerUp(event: PointerEvent<HTMLCanvasElement>) {
		onViewportMoveEnd();
		onWidgetsMoveEnd(event);
		onWidgetResizeEnd();
	}

	return {
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
	};
}
