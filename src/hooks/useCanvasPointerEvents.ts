import type { PointerEvent, RefObject } from 'react';

import { BOARD_ACTION_TYPE } from '../features/board/actions';
import { useBoardState } from '../features/board/contexts';
import { useResizeWidgets } from './useResizeWidgets';
import { useViewportPointerEvents } from './useViewportPointerEvents';
import { useWidgetsPointerEvents } from './useWidgetsPointerEvents';
import { useSelectPointerEvents } from './useSelectPointerEvents';
import type { CanvasRenderer } from '../entities/renderers/CanvasRenderer';

export function useCanvasPointerEvents(
	width: number,
	height: number,
	rendererRef: RefObject<CanvasRenderer | null>,
) {
	const [{ viewportX, viewportY, widgets }, dispatch] = useBoardState();

	const { onViewportMoveStart, onViewportMoving, onViewportMoveEnd } =
		useViewportPointerEvents((offsetX, offsetY) => {
			dispatch({
				type: BOARD_ACTION_TYPE.MOVE_VIEWPORT,
				payload: { x: offsetX, y: offsetY },
			});
		});

	const { onSelectionStart, onSelectionMoving, onSelectionEnd } =
		useSelectPointerEvents(
			(event, x1, y1, x2, y2) => {
				if (event.shiftKey) {
					dispatch({
						type: BOARD_ACTION_TYPE.SELECT_MORE,
						payload: { x1, y1, x2, y2 },
					});
				} else {
					dispatch({
						type: BOARD_ACTION_TYPE.SELECT,
						payload: { x1, y1, x2, y2 },
					});
				}
			},
			() => {
				dispatch({
					type: BOARD_ACTION_TYPE.DESELECT,
				});
			},
			(event) => {
				if (!event.shiftKey) {
					dispatch({
						type: BOARD_ACTION_TYPE.RESET_WIDGET_SELECTION,
					});
				}
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
		useResizeWidgets((boundingBoxes) => {
			dispatch({
				type: BOARD_ACTION_TYPE.RESIZE_WIDGETS,
				payload: { boundingBoxes },
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
		// scroll button down
		if (event.button === 1) {
			onViewportMoveStart(
				viewportX,
				viewportY,
				event.nativeEvent.offsetX,
				event.nativeEvent.offsetY,
			);
			return;
		}

		const [x, y] = getCenteredCoordinates(
			event.nativeEvent.offsetX,
			event.nativeEvent.offsetY,
		);

		const selectedWidgets = Object.values(widgets).filter(
			(widget) => widget.selected,
		);

		const pointedWidgets = [];

		for (const id in widgets) {
			const widget = widgets[id];
			if (
				(widget.selected &&
					rendererRef.current?.getSelectionCorner(x, y, widget)) ||
				widget.containsPoint(x, y)
			) {
				pointedWidgets.push(widget);
			}
		}

		if (pointedWidgets.length > 0) {
			pointedWidgets.sort((w1, w2) => w2.layer - w1.layer);

			const [topLayerWidget] = pointedWidgets;
			const corner = rendererRef.current?.getSelectionCorner(
				x,
				y,
				topLayerWidget,
			);
			if (corner) {
				onWidgetResizeStart(selectedWidgets, corner, x, y);
			} else {
				onWidgetsMoveStart(selectedWidgets, topLayerWidget, x, y);
			}
		} else {
			onSelectionStart(x, y);
		}
	}

	function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
		const [x, y] = getCenteredCoordinates(
			event.nativeEvent.offsetX,
			event.nativeEvent.offsetY,
		);

		onViewportMoving(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
		onSelectionMoving(event, x, y);
		onWidgetsMoving(x, y);
		onWidgetResizing(x, y);
	}

	function handlePointerUp(event: PointerEvent<HTMLCanvasElement>) {
		onViewportMoveEnd(event);
		onSelectionEnd(event);
		onWidgetsMoveEnd(event);
		onWidgetResizeEnd();
	}

	return {
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
	};
}
