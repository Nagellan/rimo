import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { Board } from './components/Board';
import { BoardProvider } from './features/board/providers';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BoardProvider>
			<Board />
		</BoardProvider>
	</StrictMode>,
);
