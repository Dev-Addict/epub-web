import {HighlightData} from '../components';
import {useEffect} from 'react';

export const useHighlight = (highlights: HighlightData[]) => {
	useEffect(() => {
		highlights.forEach(({range, className}) => {
			const span = document.createElement('span');

			span.className = `highlight ${className}`;
			span.appendChild(range.extractContents());
			range.insertNode(span);
		});
	});
};
