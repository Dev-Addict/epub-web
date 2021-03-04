import React, {useEffect} from 'react';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import ReactHtmlParser, {
	convertNodeToElement,
	Transform,
} from 'react-html-parser';
import styled from 'styled-components';

import {
	BackHome,
	ChapterController,
	ChaptersMenu,
	Highlight,
	HighlightData,
	Page,
	SelectStyle,
} from '../components';
import {RootState} from '../store';
import {Color} from '../store/settings/types';
import {useWindowSize, useHighlight, useChapterData} from '../hooks';

interface ContainerProps {
	background: Color;
}

const Container = styled.div<ContainerProps>`
  background: ${({background}) => background};
`;

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

interface ContentContainerProps {
	background: Color;
	height: number;
	color: Color;
	fontSize: number;
}

const ContentContainer = styled.div<ContentContainerProps>`
  background: ${({background}) => background};
  height: ${({height}) => height}px;
  background: ${({background}) => background};
  transition: all 336ms;
  color: ${({color}) => color};
  font-size: ${({fontSize}) => 1 + fontSize / 10}em;
  padding: 0 20px;

  & > div {
    padding: 80px 0;
  }
`;

export const Reader = () => {
	const history = useHistory();

	const {
		book: {data},
		settings: {theme: {foreground, background}, fontSize},
	} = useSelector((state: RootState) => state);

	const [highlights, setHighlights] = useState<HighlightData[]>([]);

	const {height} = useWindowSize();
	const {isLoading, html} = useChapterData();

	useHighlight(highlights);

	useEffect(() => {
		if (!data)
			history.push('/');
	}, [data, history]);

	const transform: Transform = (node, index) => {
		const removeNodes = [
			'img',
			'header',
		];
		const turnNodes = [
			'html',
			'body',
		];

		if (removeNodes.includes(node.name)) return null;
		if (turnNodes.includes(node.name)) {
			node.name = 'div';
			return convertNodeToElement(node, index, transform);
		}
	};

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
			<Container background={background}>
				{
					isLoading ?
						<></> :
						<ContentContainer background={background} height={height} color={foreground} fontSize={fontSize}>
							{ReactHtmlParser(html, {
								transform: transform,
							})}
						</ContentContainer>
				}
			</Container>
			<ChapterController />
		</Page>
	);
};
