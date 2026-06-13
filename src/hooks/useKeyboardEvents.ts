import { useEffect } from 'react';

import { BOARD_ACTION_TYPE } from '../features/board/actions';
import { useBoardState } from '../features/board/contexts';

export function useKeyboardEvents() {
	const [{ selectedWidgetIds }, dispatch] = useBoardState();

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
						type: BOARD_ACTION_TYPE.RESET_WIDGET_SELECTION,
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
	}, [selectedWidgetIds, dispatch]);
}
