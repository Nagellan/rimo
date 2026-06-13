import type { Widget } from '../../entities/widgets/Widget';
import type { BoardAction } from './actions';
import { BOARD_ACTION_TYPE } from './actions';

type BoardState = {
	viewportX: number;
	viewportY: number;
	widgets: Record<string, Widget>;
	selectedWidgetIds: string[];
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

			const newWidgets: Record<string, Widget> = {};

			for (const { id, x, y } of coordinates) {
				const widget = prevState.widgets[id];

				newWidgets[id] = widget.clone();
				newWidgets[id].reposition(x, y);
			}

			return {
				...prevState,
				widgets: {
					...prevState.widgets,
					...newWidgets,
				},
				selectedWidgetIds: coordinates.map(({ id }) => id),
			};
		}
		case BOARD_ACTION_TYPE.SELECT_WIDGET: {
			const { id } = action.payload;

			return {
				...prevState,
				selectedWidgetIds: [id],
			};
		}
		case BOARD_ACTION_TYPE.TOGGLE_WIDGET_SELECTION: {
			const { id } = action.payload;

			if (prevState.selectedWidgetIds.includes(id)) {
				return {
					...prevState,
					selectedWidgetIds: prevState.selectedWidgetIds.filter(
						(selectedWidgetId) => selectedWidgetId !== id,
					),
				};
			}

			return {
				...prevState,
				selectedWidgetIds: [...prevState.selectedWidgetIds, id],
			};
		}
		case BOARD_ACTION_TYPE.RESET_WIDGET_SELECTION: {
			return {
				...prevState,
				selectedWidgetIds: [],
			};
		}
		case BOARD_ACTION_TYPE.RESIZE_WIDGETS: {
			const { coordinates } = action.payload;
			const nextWidgets = { ...prevState.widgets };

			for (const { id, x, y, width, height } of coordinates) {
				const widget = nextWidgets[id];
				if (!widget) continue;

				const nextWidget = widget.clone();
				nextWidget.reposition(x, y);
				nextWidget.resize(width, height);
				nextWidgets[id] = nextWidget;
			}

			return {
				...prevState,
				widgets: nextWidgets,
			};
		}
		case BOARD_ACTION_TYPE.DELETE_WIDGETS: {
			const { ids } = action.payload;

			const nextWidgets = { ...prevState.widgets };
			for (const id of ids) {
				delete nextWidgets[id];
			}

			return {
				...prevState,
				widgets: nextWidgets,
				selectedWidgetIds: [],
			};
		}
		case BOARD_ACTION_TYPE.DUPLICATE_WIDGETS: {
			const { ids } = action.payload;

			let leftMostWidgetX = Infinity;
			let rightMostWidgetX = -Infinity;

			for (const id of ids) {
				const widget = prevState.widgets[id];
				const rightX = widget.x + widget.width;
				rightMostWidgetX = Math.max(rightMostWidgetX, rightX);
				leftMostWidgetX = Math.min(leftMostWidgetX, widget.x);
			}

			const widgetDuplicates = ids.map((id) => {
				const newWidget = prevState.widgets[id].duplicate();
				newWidget.reposition(
					newWidget.x + rightMostWidgetX - leftMostWidgetX + 20,
					newWidget.y,
				);
				return newWidget;
			});

			const nextWidgets = { ...prevState.widgets };
			for (const widget of widgetDuplicates) {
				nextWidgets[widget.id] = widget;
			}

			return {
				...prevState,
				widgets: nextWidgets,
				selectedWidgetIds: widgetDuplicates.map((widget) => widget.id),
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
	selectedWidgetIds: [],
};
