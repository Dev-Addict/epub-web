import {Action} from 'redux';
import {ThunkAction} from 'redux-thunk';

import {epubParser} from '../utils';
import {RootState} from '../store';
import {setError, setLoading} from '../store/app/actions';
import {setData, setToc} from '../store/book/actions';

export const handleEpubThunk = (
	file: File,
): ThunkAction<void, RootState, unknown, Action<string>> => async (
	dispatch,
) => {
	dispatch(setLoading(true));

	try {
		const {book, toc} = await epubParser(file);

		dispatch(setData(book));
		dispatch(setToc(toc));
	} catch (error) {
		dispatch(setError('Invalid input. Error while trying to parse the file.'));
	}

	dispatch(setLoading(false));
};
