import type { Widget } from '../../entities/widgets/Widget';
import type { BoardAction } from './actions';
import { BOARD_ACTION_TYPE } from './actions';

export type BoardState = {
	viewportX: number;
	viewportY: number;
	widgets: Record<string, Widget>;
};

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
		default: {
			throw new Error('Unknown event type!');
		}
	}
};

export const BOARD_INITIAL_STATE: BoardState = {
	viewportX: 0,
	viewportY: 0,
	widgets: {},
};
