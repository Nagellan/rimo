import { useState } from 'react';

import { Canvas } from '../Canvas';
import { Tools } from '../Tools';
import type { Widget } from '../entities/widgets/Widget';
import { Rectangle } from '../entities/widgets/Rectangle';
import { Circle } from '../entities/widgets/Circle';
import { Style } from '../entities/styles/Style';
import { useWindowSize } from './useWindowSize';

const style = new Style().fill('#ffffff').stroke('#000000', 1);

export const Board = () => {
	const { width, height } = useWindowSize();

	const [widgets, setWidgets] = useState<Record<string, Widget>>(() => ({}));

	const addRectangle = () => {
		const rect = new Rectangle(-50, 25, 100, 50, style);
		setWidgets((prev) => ({ ...prev, [rect.id]: rect }));
	};

	const addCircle = () => {
		const circle = new Circle(-50, 50, 50, style);
		setWidgets((prev) => ({ ...prev, [circle.id]: circle }));
	};

	return (
		<>
			<Tools onRectangle={addRectangle} onCircle={addCircle} />
			<Canvas widgets={widgets} width={width} height={height} />
		</>
	);
};
