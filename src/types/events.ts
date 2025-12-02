import type { EVENT } from '../constants/events';

type MoveViewportEvent = {
	type: typeof EVENT.MOVE_VIEWPORT;
	payload: {
		x: number;
		y: number;
	};
};

type MoveWidgetEvent = {
	type: typeof EVENT.MOVE_WIDGET;
	payload: {
		id: string;
		x: number;
		y: number;
	};
};

type SelectWidgetEvent = {
	type: typeof EVENT.SELECT_WIDGET;
	payload: {
		id: string | null;
		add?: boolean;
	};
};

type ResizeWidgetEvent = {
	type: typeof EVENT.RESIZE_WIDGET;
	payload: {
		id: string;
		x: number;
		y: number;
		width: number;
		height: number;
	};
};

export type Event =
	| MoveViewportEvent
	| MoveWidgetEvent
	| SelectWidgetEvent
	| ResizeWidgetEvent;

export type Dispatch = (event: Event) => void;
