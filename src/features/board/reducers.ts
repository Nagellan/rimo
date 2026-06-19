import type { Widget } from '../../entities/widgets/Widget';
import type { BoardAction } from './actions';
import { BOARD_ACTION_TYPE } from './actions';

export type BoardState = {
	viewportX: number;
	viewportY: number;
	widgets: Record<string, Widget>;
	selection: { x1: number; y1: number; x2: number; y2: number } | null;
};

function getSortedWidgetIds(widgets: Record<string, Widget>): string[] {
	return Object.keys(widgets).sort(
		(a, b) => widgets[a].layer - widgets[b].layer,
	);
}

// Re-assigns the same set of layer values (taken from `sortedIds`, in order)
// to a new arrangement of ids (`newOrder`), cloning each affected widget.
function applyLayerOrder(
	widgets: Record<string, Widget>,
	sortedIds: string[],
	newOrder: string[],
): Record<string, Widget> {
	const layers = sortedIds.map((id) => widgets[id].layer);

	const nextWidgets: Record<string, Widget> = {};

	for (let i = 0; i < newOrder.length; i++) {
		const id = newOrder[i];
		const widget = widgets[id].clone();
		widget.setLayer(layers[i]);
		nextWidgets[id] = widget;
	}

	return nextWidgets;
}

export const boardReducer = (
	prevState: BoardState,
	action: BoardAction,
): BoardState => {
	switch (action.type) {
		case BOARD_ACTION_TYPE.MOVE_VIEWPORT: {
			const { x, y } = action.payload;
			return {
				...prevState,
				viewportX: x,
				viewportY: y,
			};
		}
		case BOARD_ACTION_TYPE.ADD_WIDGET: {
			const { widget } = action.payload;
			return {
				...prevState,
				widgets: {
					...prevState.widgets,
					[widget.id]: widget,
				},
			};
		}
		case BOARD_ACTION_TYPE.MOVE_WIDGETS: {
			const { coordinates } = action.payload;

			const nextWidgets: Record<string, Widget> = {};

			for (const id in prevState.widgets) {
				nextWidgets[id] = prevState.widgets[id].clone();

				if (id in coordinates) {
					const { x, y } = coordinates[id];
					nextWidgets[id].reposition(x, y);
					nextWidgets[id].select();
				} else {
					nextWidgets[id].deselect();
				}
			}

			return {
				...prevState,
				widgets: nextWidgets,
			};
		}
		case BOARD_ACTION_TYPE.RESIZE_WIDGETS: {
			const { boundingBoxes } = action.payload;

			const updatedWidgets: Record<string, Widget> = {};

			for (const id in boundingBoxes) {
				const { x, y, width, height } = boundingBoxes[id];
				updatedWidgets[id] = prevState.widgets[id].clone();
				updatedWidgets[id].reposition(x, y);
				updatedWidgets[id].resize(width, height);
			}

			return {
				...prevState,
				widgets: {
					...prevState.widgets,
					...updatedWidgets,
				},
			};
		}
		case BOARD_ACTION_TYPE.SELECT_WIDGET: {
			const { id: selectedId } = action.payload;

			const nextWidgets: Record<string, Widget> = {};

			for (const id in prevState.widgets) {
				nextWidgets[id] = prevState.widgets[id].clone();
				if (id === selectedId) {
					nextWidgets[id].select();
				} else {
					nextWidgets[id].deselect();
				}
			}

			return {
				...prevState,
				widgets: nextWidgets,
			};
		}
		case BOARD_ACTION_TYPE.TOGGLE_WIDGET_SELECTION: {
			const { id } = action.payload;

			const widget = prevState.widgets[id].clone();
			widget.toggleSelection();

			return {
				...prevState,
				widgets: {
					...prevState.widgets,
					[widget.id]: widget,
				},
			};
		}
		case BOARD_ACTION_TYPE.RESET_WIDGET_SELECTION: {
			const nextWidgets: Record<string, Widget> = {};

			for (const id in prevState.widgets) {
				nextWidgets[id] = prevState.widgets[id].clone();
				nextWidgets[id].deselect();
			}

			return {
				...prevState,
				widgets: nextWidgets,
			};
		}
		case BOARD_ACTION_TYPE.DELETE_SELECTED_WIDGETS: {
			const nextWidgets = { ...prevState.widgets };

			for (const id in prevState.widgets) {
				const widget = prevState.widgets[id];

				if (widget.selected) {
					delete nextWidgets[id];
				}
			}

			return {
				...prevState,
				widgets: nextWidgets,
			};
		}
		case BOARD_ACTION_TYPE.DUPLICATE_SELECTED_WIDGETS: {
			let leftMostWidgetX = Infinity;
			let rightMostWidgetX = -Infinity;

			for (const id in prevState.widgets) {
				const widget = prevState.widgets[id];
				if (!widget.selected) continue;
				const rightX = widget.x + widget.width;
				rightMostWidgetX = Math.max(rightMostWidgetX, rightX);
				leftMostWidgetX = Math.min(leftMostWidgetX, widget.x);
			}

			const updatedWidgets: Record<string, Widget> = {};

			for (const id in prevState.widgets) {
				const widget = prevState.widgets[id];
				if (!widget.selected) continue;
				// deselect previously selected widgets
				updatedWidgets[id] = widget.clone();
				updatedWidgets[id].deselect();
				// duplicate previously selected widgets
				const widgetDuplicate = widget.duplicate();
				widgetDuplicate.reposition(
					widgetDuplicate.x + rightMostWidgetX - leftMostWidgetX + 20,
					widgetDuplicate.y,
				);
				updatedWidgets[widgetDuplicate.id] = widgetDuplicate;
			}

			return {
				...prevState,
				widgets: {
					...prevState.widgets,
					...updatedWidgets,
				},
			};
		}
		case BOARD_ACTION_TYPE.BRING_FORWARD: {
			const sortedIds = getSortedWidgetIds(prevState.widgets);
			const newOrder = [...sortedIds];

			// Scan from the top down: whenever a selected widget is
			// immediately below an unselected one, swap them so it moves up.
			for (let i = newOrder.length - 2; i >= 0; i--) {
				const currentId = newOrder[i];
				const nextId = newOrder[i + 1];

				if (
					prevState.widgets[currentId].selected &&
					!prevState.widgets[nextId].selected
				) {
					newOrder[i] = nextId;
					newOrder[i + 1] = currentId;
				}
			}

			return {
				...prevState,
				widgets: applyLayerOrder(
					prevState.widgets,
					sortedIds,
					newOrder,
				),
			};
		}
		case BOARD_ACTION_TYPE.BRING_BACKWARD: {
			const sortedIds = getSortedWidgetIds(prevState.widgets);
			const newOrder = [...sortedIds];

			// Scan from the bottom up: whenever a selected widget is
			// immediately above an unselected one, swap them so it moves down.
			for (let i = 1; i < newOrder.length; i++) {
				const currentId = newOrder[i];
				const prevId = newOrder[i - 1];

				if (
					prevState.widgets[currentId].selected &&
					!prevState.widgets[prevId].selected
				) {
					newOrder[i] = prevId;
					newOrder[i - 1] = currentId;
				}
			}

			return {
				...prevState,
				widgets: applyLayerOrder(
					prevState.widgets,
					sortedIds,
					newOrder,
				),
			};
		}
		case BOARD_ACTION_TYPE.BRING_TO_FRONT: {
			const sortedIds = getSortedWidgetIds(prevState.widgets);
			const unselected = sortedIds.filter(
				(id) => !prevState.widgets[id].selected,
			);
			const selected = sortedIds.filter(
				(id) => prevState.widgets[id].selected,
			);
			const newOrder = [...unselected, ...selected];

			return {
				...prevState,
				widgets: applyLayerOrder(
					prevState.widgets,
					sortedIds,
					newOrder,
				),
			};
		}
		case BOARD_ACTION_TYPE.BRING_TO_BACK: {
			const sortedIds = getSortedWidgetIds(prevState.widgets);
			const unselected = sortedIds.filter(
				(id) => !prevState.widgets[id].selected,
			);
			const selected = sortedIds.filter(
				(id) => prevState.widgets[id].selected,
			);
			const newOrder = [...selected, ...unselected];

			return {
				...prevState,
				widgets: applyLayerOrder(
					prevState.widgets,
					sortedIds,
					newOrder,
				),
			};
		}
		case BOARD_ACTION_TYPE.SELECT: {
			const { x1, y1, x2, y2 } = action.payload;

			const left = Math.min(x1, x2);
			const right = Math.max(x1, x2);
			const top = Math.max(y1, y2);
			const bottom = Math.min(y1, y2);

			const nextWidgets: Record<string, Widget> = {};

			for (const id in prevState.widgets) {
				const widget = prevState.widgets[id].clone();
				const widgetLeft = widget.x;
				const widgetRight = widget.x + widget.width;
				const widgetTop = widget.y;
				const widgetBottom = widget.y - widget.height;

				if (
					left <= widgetRight &&
					right >= widgetLeft &&
					bottom <= widgetTop &&
					top >= widgetBottom
				) {
					widget.select();
				} else {
					widget.deselect();
				}
				nextWidgets[widget.id] = widget;
			}

			return {
				...prevState,
				selection: {
					x1,
					y1,
					x2,
					y2,
				},
				widgets: nextWidgets,
			};
		}
		case BOARD_ACTION_TYPE.SELECT_MORE: {
			const { x1, y1, x2, y2 } = action.payload;

			const left = Math.min(x1, x2);
			const right = Math.max(x1, x2);
			const top = Math.max(y1, y2);
			const bottom = Math.min(y1, y2);

			const updatedWidgets: Record<string, Widget> = {};

			for (const id in prevState.widgets) {
				const widget = prevState.widgets[id];
				const widgetLeft = widget.x;
				const widgetRight = widget.x + widget.width;
				const widgetTop = widget.y;
				const widgetBottom = widget.y - widget.height;

				if (
					left <= widgetRight &&
					right >= widgetLeft &&
					bottom <= widgetTop &&
					top >= widgetBottom
				) {
					updatedWidgets[widget.id] = widget.clone();
					updatedWidgets[widget.id].select();
				}
			}

			return {
				...prevState,
				selection: {
					x1,
					y1,
					x2,
					y2,
				},
				widgets: {
					...prevState.widgets,
					...updatedWidgets,
				},
			};
		}
		case BOARD_ACTION_TYPE.DESELECT: {
			return {
				...prevState,
				selection: null,
			};
		}
		default: {
			throw new Error('Unknown event type!');
		}
	}
};

export const BOARD_INITIAL_STATE: BoardState = {
	viewportX: 0,
	viewportY: 0,
	widgets: {},
	selection: null,
};
