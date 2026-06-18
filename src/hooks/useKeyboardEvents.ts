import { useEffect } from 'react';

import { BOARD_ACTION_TYPE } from '../features/board/actions';
import { useBoardState } from '../features/board/contexts';

export function useKeyboardEvents() {
	const [, dispatch] = useBoardState();

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'Backspace': {
					dispatch({
						type: BOARD_ACTION_TYPE.DELETE_SELECTED_WIDGETS,
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
					if (event.metaKey || event.ctrlKey) {
						dispatch({
							type: BOARD_ACTION_TYPE.DUPLICATE_SELECTED_WIDGETS,
						});
					}

					break;
				}
			}
		};
		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [dispatch]);
}
