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
	};
};

export type Event = MoveViewportEvent | MoveWidgetEvent | SelectWidgetEvent;

export type Dispatch = (event: Event) => void;
