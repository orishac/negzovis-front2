import React, { useEffect, useState } from 'react';
import { HashRouter, Route } from 'react-router-dom';

import { SetTitleContext, UserEmailContext } from './contexts';

import Content from './Components/Content/Content';
import Footer from './Components/Footer';
import Navigation from './Components/Navigation';

import Cookies from 'js-cookie';
import { setLogout } from './networking/request';

const App = () => {
	const [logged, setLogged] = useState(false);
	setLogout(() => setLogged(false));
	useEffect(() => {
		if (Cookies.get('auth-token')) {
			setLogged(true);
		}
	}, []);

	const [title, setTitle] = useState('');

	return (
		<HashRouter>
			<div className='App'>
				<SetTitleContext.Provider value={(newTitle) => setTitle(newTitle)}>
					<UserEmailContext.Provider value={{ logged, setLogged }}>
						<Route path={'/'} children>
							{(props) => <Navigation title={title} {...props} />}
						</Route>
						<Content />
						<Footer />
					</UserEmailContext.Provider>
				</SetTitleContext.Provider>
			</div>
		</HashRouter>
	);
};

export default App;
