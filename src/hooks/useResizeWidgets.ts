import { useRef } from 'react';

import type { Widget } from '../entities/widgets/Widget';

export type ResizeCorner =
	| 'top-left'
	| 'top-right'
	| 'bottom-right'
	| 'bottom-left';

interface WidgetBounds {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

const getBoundingBox = (widgets: WidgetBounds[]) => ({
	left: Math.min(...widgets.map((w) => w.x)),
	top: Math.max(...widgets.map((w) => w.y)), // top = max y
	right: Math.max(...widgets.map((w) => w.x + w.width)),
	bottom: Math.min(...widgets.map((w) => w.y - w.height)), // bottom = min y
});

export const useResizeWidgets = (
	onResizing: (coordinates: WidgetBounds[]) => void,
) => {
	const resizingStarted = useRef(false);
	const cornerRef = useRef<ResizeCorner>(null);
	const initialWidgetsRef = useRef<WidgetBounds[]>([]);
	const startXRef = useRef(0);
	const startYRef = useRef(0);

	const onWidgetResizeStart = (
		selectedWidgetIds: string[],
		widgets: Record<string, Widget>,
		corner: ResizeCorner,
		x: number,
		y: number,
	) => {
		resizingStarted.current = true;
		cornerRef.current = corner;
		initialWidgetsRef.current = selectedWidgetIds.map((id) => ({
			id,
			x: widgets[id].x,
			y: widgets[id].y,
			width: widgets[id].width,
			height: widgets[id].height,
		}));
		startXRef.current = x;
		startYRef.current = y;
	};

	const onWidgetResizing = (x: number, y: number) => {
		if (!resizingStarted.current) return;

		const initialWidgets = initialWidgetsRef.current;
		const corner = cornerRef.current;
		if (initialWidgets.length === 0 || !corner) return;

		const dx = x - startXRef.current;
		const dy = y - startYRef.current;

		const bbox = getBoundingBox(initialWidgets);
		const newBbox = { ...bbox };

		// Top edge moves with corner that has "top", bottom edge moves with "bottom"
		// Both just add dy directly since cursor y and widget y are in the same space
		if (corner === 'top-left' || corner === 'top-right')
			newBbox.top = bbox.top + dy;
		if (corner === 'bottom-left' || corner === 'bottom-right')
			newBbox.bottom = bbox.bottom + dy;
		if (corner === 'top-left' || corner === 'bottom-left')
			newBbox.left = bbox.left + dx;
		if (corner === 'top-right' || corner === 'bottom-right')
			newBbox.right = bbox.right + dx;

		// Normalize: in Y-up space top > bottom, so flip if top drops below bottom
		if (newBbox.left > newBbox.right)
			[newBbox.left, newBbox.right] = [newBbox.right, newBbox.left];
		if (newBbox.bottom > newBbox.top)
			[newBbox.bottom, newBbox.top] = [newBbox.top, newBbox.bottom];

		const oldW = bbox.right - bbox.left;
		const oldH = bbox.top - bbox.bottom; // positive because top > bottom in Y-up
		const newW = newBbox.right - newBbox.left;
		const newH = newBbox.top - newBbox.bottom;

		const scaleX = oldW === 0 ? 1 : newW / oldW;
		const scaleY = oldH === 0 ? 1 : newH / oldH;

		const nextCoordinates = initialWidgets.map((widget) => {
			// Measure from top anchor downward (in Y-up: subtracting moves down)
			const relX = widget.x - bbox.left;
			const relY = bbox.top - widget.y; // distance from bounding top, always positive

			return {
				id: widget.id,
				x: newBbox.left + relX * scaleX,
				y: newBbox.top - relY * scaleY, // place from new top, going down
				width: widget.width * scaleX,
				height: widget.height * scaleY,
			};
		});

		onResizing(nextCoordinates);
	};

	const onWidgetResizeEnd = () => {
		resizingStarted.current = false;
		cornerRef.current = null;
		initialWidgetsRef.current = [];
		startXRef.current = 0;
		startYRef.current = 0;
	};

	return { onWidgetResizeStart, onWidgetResizing, onWidgetResizeEnd };
};
