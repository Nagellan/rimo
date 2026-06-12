import { useEffect, useReducer } from 'react';

import { Canvas } from '../Canvas';
import { Tools } from '../Tools';
import { Rectangle, Circle } from '../../entities/widgets';
import { Style } from '../../entities/styles/Style';
import { useWindowSize, useDevicePixelRatio } from '../../hooks';
import {
	boardReducer,
	BOARD_INITIAL_STATE,
} from '../../features/board/reducers';
import { BOARD_ACTION_TYPE } from '../../features/board/actions';

const style = new Style().fill('#ffffff').stroke('#000000', 1);

export const Board = () => {
	const { width, height } = useWindowSize();
	const dpr = useDevicePixelRatio();

	const [{ viewportX, viewportY, widgets, selectedWidgetIds }, dispatch] =
		useReducer(boardReducer, BOARD_INITIAL_STATE);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'Backspace': {
					dispatch({
						type: BOARD_ACTION_TYPE.DELETE_WIDGETS,
						payload: { ids: selectedWidgetIds },
					});
					break;
				}
				case 'Escape': {
					dispatch({
						type: BOARD_ACTION_TYPE.SELECT_WIDGET,
						payload: { id: null },
					});
					break;
				}
				case 'd': {
					if (
						!selectedWidgetIds.length ||
						(!event.metaKey && !event.ctrlKey)
					)
						break;
					dispatch({
						type: BOARD_ACTION_TYPE.DUPLICATE_WIDGETS,
						payload: { ids: selectedWidgetIds },
					});
					break;
				}
			}
		};
		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [selectedWidgetIds, widgets]);

	const handleAddRectangle = () => {
		const rect = new Rectangle(
			-50 - viewportX,
			25 - viewportY,
			100,
			50,
			style,
		);
		dispatch({
			type: BOARD_ACTION_TYPE.ADD_WIDGET,
			payload: { widget: rect },
		});
	};

	const handleAddCircle = () => {
		const circle = new Circle(-50 - viewportX, 50 - viewportY, 50, style);
		dispatch({
			type: BOARD_ACTION_TYPE.ADD_WIDGET,
			payload: { widget: circle },
		});
	};

	return (
		<>
			<Tools
				onRectangle={handleAddRectangle}
				onCircle={handleAddCircle}
			/>
			<Canvas
				widgets={widgets}
				selectedWidgetIds={selectedWidgetIds}
				width={width}
				height={height}
				viewportX={viewportX}
				viewportY={viewportY}
				dpr={dpr}
				dispatch={dispatch}
			/>
		</>
	);
};
