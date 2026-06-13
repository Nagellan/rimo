import { useReducer, type PropsWithChildren } from 'react';

import { BOARD_INITIAL_STATE, boardReducer } from './reducers';
import { BoardContext } from './contexts';

export function BoardProvider({ children }: PropsWithChildren) {
	const value = useReducer(boardReducer, BOARD_INITIAL_STATE);

	return <BoardContext value={value}>{children}</BoardContext>;
}
