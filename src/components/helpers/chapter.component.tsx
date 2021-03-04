import {useSelector} from 'react-redux';
import ReactHtmlParser, {
	convertNodeToElement,
	Transform
} from 'react-html-parser';
import styled from 'styled-components';

import {useChapterData} from '../../hooks';
import {Color} from '../../store/settings/types';
import {RootState} from '../../store';

interface ContentContainerProps {
	background: Color;
	color: Color;
	fontSize: number;
}

const ContentContainer = styled.div<ContentContainerProps>`
  background: ${({background}) => background};
  transition: all 336ms;
  color: ${({color}) => color};
  font-size: ${({fontSize}) => 1 + fontSize / 10}em;
  padding: 0 20px;

  & > div {
    padding: 80px 0;
  }
`;

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

export const Chapter = () => {
	const {
		settings: {theme: {foreground, background}, fontSize},
	} = useSelector((state: RootState) => state);

	const {isLoading, html} = useChapterData();

	return (
		<ContentContainer fontSize={fontSize} color={foreground} background={background}>
			{
				isLoading &&
				ReactHtmlParser(html, {
					transform,
				})
			}
		</ContentContainer>
	);
};
