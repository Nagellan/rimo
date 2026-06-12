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
		case BOARD_ACTION_TYPE.MOVE_WIDGET: {
			const { id, x, y } = action.payload;
			const widget = prevState.widgets[id];
			const newWidget = widget.clone();
			newWidget.reposition(x, y);
			return {
				...prevState,
				widgets: {
					...prevState.widgets,
					[newWidget.id]: newWidget,
				},
			};
		}
		case BOARD_ACTION_TYPE.SELECT_WIDGET: {
			const { id, add } = action.payload;
			if (id === null) {
				return {
					...prevState,
					selectedWidgetIds: [],
				};
			} else {
				if (add) {
					return {
						...prevState,
						selectedWidgetIds: prevState.selectedWidgetIds.includes(
							id,
						)
							? prevState.selectedWidgetIds.filter(
									(_id) => _id !== id,
								)
							: [...prevState.selectedWidgetIds, id],
					};
				} else {
					return {
						...prevState,
						selectedWidgetIds: [id],
					};
				}
			}
		}
		case BOARD_ACTION_TYPE.RESIZE_WIDGET: {
			const { id, x, y, width, height } = action.payload;
			const widget = prevState.widgets[id];
			const newWidget = widget.clone();
			newWidget.reposition(x, y);
			newWidget.resize(width, height);
			return {
				...prevState,
				widgets: {
					...prevState.widgets,
					[newWidget.id]: newWidget,
				},
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
