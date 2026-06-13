import { Style } from '../../entities/styles/Style';
import { Circle, Rectangle } from '../../entities/widgets';
import { BOARD_ACTION_TYPE } from '../../features/board/actions';
import { useBoardState } from '../../features/board/contexts';
import './style.css';

const style = new Style().fill('#ffffff').stroke('#000000', 1);

export function Tools() {
	const [{ viewportX, viewportY }, dispatch] = useBoardState();

	function handleAddRectangle() {
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
	}

	function handleAddCircle() {
		const circle = new Circle(-50 - viewportX, 50 - viewportY, 50, style);
		dispatch({
			type: BOARD_ACTION_TYPE.ADD_WIDGET,
			payload: { widget: circle },
		});
	}

	return (
		<div className="tools">
			<button onClick={handleAddRectangle}>Rectangle</button>
			<button onClick={handleAddCircle}>Circle</button>
		</div>
	);
}
