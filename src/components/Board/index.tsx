import { useRef, useLayoutEffect } from 'react';

import { Canvas } from '../Canvas';
import { Tools } from '../Tools';
import { CanvasRenderer } from '../../entities/renderers/CanvasRenderer';
import {
	useWindowSize,
	useDevicePixelRatio,
	useCanvasPointerEvents,
	useKeyboardEvents,
} from '../../hooks';
import { useBoardState } from '../../features/board/contexts';

export function Board() {
	const rendererRef = useRef<CanvasRenderer>(null);

	const { width, height } = useWindowSize();
	const dpr = useDevicePixelRatio();
	const [{ viewportX, viewportY, widgets, selection }] = useBoardState();
	const { handlePointerDown, handlePointerMove, handlePointerUp } =
		useCanvasPointerEvents(width, height, rendererRef);

	useKeyboardEvents();

	useLayoutEffect(() => {
		if (!rendererRef.current) return;

		rendererRef.current.setViewportX(viewportX);
		rendererRef.current.setViewportY(viewportY);
		rendererRef.current.setWidth(width);
		rendererRef.current.setHeight(height);
		rendererRef.current.setDpr(dpr);

		rendererRef.current.clear();

		if (selection) {
			const { x1, y1, x2, y2 } = selection;
			rendererRef.current.drawSelection(x1, y1, x2, y2);
		}

		const sortedWidgets = Object.values(widgets).sort(
			(w1, w2) => w1.layer - w2.layer,
		);

		for (const widget of sortedWidgets) {
			widget.accept(rendererRef.current);

			if (widget.selected) {
				rendererRef.current.select(widget);
			}
		}
	}, [viewportX, viewportY, width, height, dpr, selection, widgets]);

	function setRef(el: HTMLCanvasElement | null) {
		if (!el) return;
		const ctx = el.getContext('2d');
		if (!ctx) return;
		rendererRef.current = new CanvasRenderer(
			ctx,
			width,
			height,
			viewportX,
			viewportY,
			dpr,
		);
	}

	return (
		<>
			<Tools />
			<Canvas
				ref={setRef}
				width={width}
				height={height}
				dpr={dpr}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
			/>
		</>
	);
}
