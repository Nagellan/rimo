import type { Widget } from '../../entities/widgets/Widget';
import type { Coordinate, BoundingBox } from './types';

export const BOARD_ACTION_TYPE = {
	MOVE_VIEWPORT: 'move-viewport',
	ADD_WIDGET: 'add-widget',
	MOVE_WIDGETS: 'move-widgets',
	RESIZE_WIDGETS: 'resize-widgets',
	SELECT_WIDGET: 'select-widget',
	TOGGLE_WIDGET_SELECTION: 'toggle-widget-selection',
	RESET_WIDGET_SELECTION: 'reset-widget-selection',
	DELETE_SELECTED_WIDGETS: 'delete-selected-widgets',
	DUPLICATE_SELECTED_WIDGETS: 'duplicate-selected-widgets',
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
		coordinates: Record<string, Coordinate>;
	};
};

type ResizeWidgetsAction = {
	type: typeof BOARD_ACTION_TYPE.RESIZE_WIDGETS;
	payload: {
		boundingBoxes: Record<string, BoundingBox>;
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

type DeleteSelectedWidgetsAction = {
	type: typeof BOARD_ACTION_TYPE.DELETE_SELECTED_WIDGETS;
};

type DuplicateSelectedWidgetsAction = {
	type: typeof BOARD_ACTION_TYPE.DUPLICATE_SELECTED_WIDGETS;
};

export type BoardAction =
	| MoveViewportAction
	| AddWidgetAction
	| MoveWidgetsAction
	| ResizeWidgetsAction
	| SelectWidgetAction
	| ToggleWidgetSelectionAction
	| ResetWidgetSelectionAction
	| DeleteSelectedWidgetsAction
	| DuplicateSelectedWidgetsAction;

export type BoardActionDispatch = (action: BoardAction) => void;
