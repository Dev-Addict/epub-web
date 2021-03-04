import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {RootState} from '../store';

export const useChapterData = () => {
	const {
		book: {data, currentChapter},
	} = useSelector((state: RootState) => state);

	const [isLoading, setLoading] = useState(false);
	const [html, setHtml] = useState('');

	useEffect(() => {
		setLoading(true);
		if (data) {
			const currentChapterId = data.content.chapters[currentChapter].idref;

			const chapter = data.content.items.find(({id}) => id === currentChapterId);

			if (!chapter)
				return;

			data.result.file(chapter.href)?.async('string')?.then(data => {
				setHtml(data);
				setLoading(false);
			});
		}
	}, [currentChapter, data]);

	return {
		isLoading,
		html
	};
};
