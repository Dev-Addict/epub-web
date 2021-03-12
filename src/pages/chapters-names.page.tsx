import React, {ChangeEventHandler, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import styled, {css} from 'styled-components';

import {Button, Page} from '../components';

import {RootState} from '../store';
import {generateArray} from '../utils';
import {Color} from '../store/settings/types';
import {setChaptersNames as setGlobalChaptersNames} from '../store/book/actions';

const Container = styled.div`
  padding: 20px;
  width: 800px;
  margin: auto;

  @media only screen and (max-width: 1000px) {
    width: auto;
  }
`;

interface InputProps {
	background: Color;
	color: Color;
	shadow?: boolean;
}

const Input = styled.input<InputProps>`
  width: 100%;
  margin: 10px 0;
  outline: none;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  font-size: 18px;
	border: none;
	color: ${({color}) => color};
	background-color: ${({background}) => background};

  ${({shadow}) => shadow && css`
    box-shadow: 3px 0 6px 0 #00000029;
  `}
`;

const SaveButtonContainer = styled.div`
	margin: 20px 0;
`;

export const ChaptersNames = () => {
	const history = useHistory();

	const dispatch = useDispatch();
	const {
		book: {data},
		settings: {theme: {secondaryBackground, foreground, shadow}},
	} = useSelector((state: RootState) => state);

	const [chaptersNames, setChaptersNames] = useState(generateArray(data?.content?.chapters?.length || 0, ''));

	useEffect(() => {
		if (!data)
			history.push('/');
	}, [data, history]);

	useEffect(() => {
		setChaptersNames(generateArray(data?.content?.chapters?.length || 0, ''));
	}, [data?.content?.chapters?.length]);

	const onInputChange = (i: number): ChangeEventHandler<HTMLInputElement> => ({target: {value}}) => {
		const newChaptersNames = [...chaptersNames];

		newChaptersNames[i] = value;

		setChaptersNames(newChaptersNames);
	};
	const onSaveClick = () => () => {
		dispatch(setGlobalChaptersNames(chaptersNames));

		history.push('/reader');
	};

	const renderInputs = () => chaptersNames.map((name, i) => (
		<Input background={secondaryBackground} shadow={shadow} color={foreground} value={chaptersNames[i]}
					 onChange={onInputChange(i)} placeholder={`Chapter ${i + 1} Name`} />
	));

	return (
		<Page>
			<Container>
				{renderInputs()}
				<SaveButtonContainer>
					<Button color={Color.WHITE} onClick={onSaveClick()}>Save</Button>
				</SaveButtonContainer>
			</Container>
		</Page>
	);
};
