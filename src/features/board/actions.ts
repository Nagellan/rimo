import type { Widget } from '../../entities/widgets/Widget';

export const BOARD_ACTION_TYPE = {
	MOVE_VIEWPORT: 'move-viewport',
	ADD_WIDGET: 'add-widget',
	MOVE_WIDGET: 'move-widget',
	SELECT_WIDGET: 'select-widget',
	RESIZE_WIDGET: 'resize-widget',
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

type MoveWidgetAction = {
	type: typeof BOARD_ACTION_TYPE.MOVE_WIDGET;
	payload: {
		id: string;
		x: number;
		y: number;
	};
};

type SelectWidgetAction = {
	type: typeof BOARD_ACTION_TYPE.SELECT_WIDGET;
	payload: {
		id: string | null;
		add?: boolean;
	};
};

type ResizeWidgetAction = {
	type: typeof BOARD_ACTION_TYPE.RESIZE_WIDGET;
	payload: {
		id: string;
		x: number;
		y: number;
		width: number;
		height: number;
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
	| MoveWidgetAction
	| SelectWidgetAction
	| ResizeWidgetAction
	| DeleteWidgetsAction
	| DuplicateWidgetsAction;

export type BoardActionDispatch = (action: BoardAction) => void;
