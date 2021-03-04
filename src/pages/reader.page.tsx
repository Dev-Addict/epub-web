import React, {useEffect} from 'react';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';

import {
	BackHome, Chapter,
	ChapterController,
	ChaptersMenu,
	Highlight,
	HighlightData,
	Page,
	SelectStyle,
} from '../components';
import {RootState} from '../store';
import {useHighlight} from '../hooks';

const SelectStyleContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  transition: all 336ms;
  z-index: 2;
`;

const BackHomeContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  transition: all 336ms;
  z-index: 2;
`;

const ChaptersMenuContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transition: all 336ms;
  transform: translateX(-50%);
  z-index: 2;
`;

export const Reader = () => {
	const history = useHistory();

	const {
		book: {data},
	} = useSelector((state: RootState) => state);

	const [highlights, setHighlights] = useState<HighlightData[]>([]);

	useHighlight(highlights);

	useEffect(() => {
		if (!data)
			history.push('/');
	}, [data, history]);

	return (
		<Page>
			<BackHomeContainer>
				<BackHome />
			</BackHomeContainer>
			<SelectStyleContainer>
				<SelectStyle />
			</SelectStyleContainer>
			<ChaptersMenuContainer>
				<ChaptersMenu />
			</ChaptersMenuContainer>
			<Highlight setHighlights={setHighlights} />
			<Chapter />
			<ChapterController />
		</Page>
	);
};
