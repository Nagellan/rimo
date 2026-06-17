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
	const [{ viewportX, viewportY, widgets, selectedWidgetIds }] =
		useBoardState();
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
		for (const id in widgets) {
			const widget = widgets[id];
			widget.accept(rendererRef.current);
		}
		for (const id of selectedWidgetIds) {
			const widget = widgets[id];
			rendererRef.current.select(widget);
		}
	}, [viewportX, viewportY, width, height, dpr, widgets, selectedWidgetIds]);

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
