import { useEffect, useState } from 'react';

export function useDevicePixelRatio() {
	const [dpr, setDpr] = useState(() => Math.floor(window.devicePixelRatio));

	useEffect(() => {
		let remove = () => {};

		const updatePixelRatio = () => {
			remove();

			const mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
			const media = matchMedia(mqString);

			media.addEventListener('change', updatePixelRatio);

			remove = () => {
				media.removeEventListener('change', updatePixelRatio);
			};

			setDpr(Math.floor(window.devicePixelRatio));
		};

		updatePixelRatio();

		return () => {
			remove();
		};
	}, []);

	return dpr;
}
