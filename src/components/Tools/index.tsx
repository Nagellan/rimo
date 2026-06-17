import { Style } from '../../entities/styles/Style';
import { Rectangle, Circle, Ellipse } from '../../entities/widgets';
import { BOARD_ACTION_TYPE } from '../../features/board/actions';
import { useBoardState } from '../../features/board/contexts';
import './style.css';

const style = new Style().fill('#ffffff').stroke('#000000', 1);

export function Tools() {
	const [{ viewportX, viewportY }, dispatch] = useBoardState();

	function handleAddRectangle() {
		const rectangle = new Rectangle(
			-50 - viewportX,
			25 - viewportY,
			100,
			50,
			style,
		);
		dispatch({
			type: BOARD_ACTION_TYPE.ADD_WIDGET,
			payload: { widget: rectangle },
		});
	}

	function handleAddCircle() {
		const circle = new Circle(-50 - viewportX, 50 - viewportY, 50, style);
		dispatch({
			type: BOARD_ACTION_TYPE.ADD_WIDGET,
			payload: { widget: circle },
		});
	}

	function handleAddEllipse() {
		const ellipse = new Ellipse(
			-50 - viewportX,
			25 - viewportY,
			50,
			25,
			style,
		);
		dispatch({
			type: BOARD_ACTION_TYPE.ADD_WIDGET,
			payload: { widget: ellipse },
		});
	}

	return (
		<div className="tools">
			<button onClick={handleAddRectangle}>Rectangle</button>
			<button onClick={handleAddCircle}>Circle</button>
			<button onClick={handleAddEllipse}>Ellipse</button>
		</div>
	);
}
