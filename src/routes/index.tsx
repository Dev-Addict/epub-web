import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from 'react-router-dom';

import {ChaptersNames, Home, Reader} from '../pages';

export const RootRouter = () => {
	return (
		<Router>
			<div>
				<Switch>
					<Route path='/' exact>
						<Home />
					</Route>
					<Route path="/chapters-names" exact>
						<ChaptersNames/>
					</Route>
					<Route path='/reader' exact>
						<Reader />
					</Route>
				</Switch>
			</div>
		</Router>
	);
};
