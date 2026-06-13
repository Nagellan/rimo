import type { Widget } from '../../entities/widgets/Widget';

export const BOARD_ACTION_TYPE = {
	MOVE_VIEWPORT: 'move-viewport',
	ADD_WIDGET: 'add-widget',
	MOVE_WIDGETS: 'move-widgets',
	SELECT_WIDGET: 'select-widget',
	TOGGLE_WIDGET_SELECTION: 'toggle-widget-selection',
	RESET_WIDGET_SELECTION: 'reset-widget-selection',
	RESIZE_WIDGETS: 'resize-widgets',
	DELETE_WIDGETS: 'delete-widgets',
	DUPLICATE_WIDGETS: 'duplicate-widgets',
} as const;

type MoveViewportAction = {
	type: typeof BOARD_ACTION_TYPE.MOVE_VIEWPORT;
	payload: {
		x: number;
		y: number;
	};
};

type AddWidgetAction = {
	type: typeof BOARD_ACTION_TYPE.ADD_WIDGET;
	payload: {
		widget: Widget;
	};
};

type MoveWidgetsAction = {
	type: typeof BOARD_ACTION_TYPE.MOVE_WIDGETS;
	payload: {
		coordinates: Array<{ id: string; x: number; y: number }>;
	};
};

type SelectWidgetAction = {
	type: typeof BOARD_ACTION_TYPE.SELECT_WIDGET;
	payload: {
		id: string;
	};
};

type ToggleWidgetSelectionAction = {
	type: typeof BOARD_ACTION_TYPE.TOGGLE_WIDGET_SELECTION;
	payload: {
		id: string;
	};
};

type ResetWidgetSelectionAction = {
	type: typeof BOARD_ACTION_TYPE.RESET_WIDGET_SELECTION;
};

type ResizeWidgetsAction = {
	type: typeof BOARD_ACTION_TYPE.RESIZE_WIDGETS;
	payload: {
		coordinates: Array<{
			id: string;
			x: number;
			y: number;
			width: number;
			height: number;
		}>;
	};
};

type DeleteWidgetsAction = {
	type: typeof BOARD_ACTION_TYPE.DELETE_WIDGETS;
	payload: {
		ids: string[];
	};
};

type DuplicateWidgetsAction = {
	type: typeof BOARD_ACTION_TYPE.DUPLICATE_WIDGETS;
	payload: {
		ids: string[];
	};
};

export type BoardAction =
	| MoveViewportAction
	| AddWidgetAction
	| MoveWidgetsAction
	| SelectWidgetAction
	| ToggleWidgetSelectionAction
	| ResetWidgetSelectionAction
	| ResizeWidgetsAction
	| DeleteWidgetsAction
	| DuplicateWidgetsAction;

export type BoardActionDispatch = (action: BoardAction) => void;
