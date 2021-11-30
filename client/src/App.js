import {useRef} from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {GameProvider} from './store/GameContext';
import {Header, Welcome, Game, Scores, Page404} from './components';

import './App.css';


const App = () => {
	const appRef = useRef();
	const gameRef = useRef();

	return (
		<div className="App" ref={appRef}>
			<Router>
				<Header />
				<GameProvider>
					<Routes>
						<Route path="/" element={<Welcome />} />
						<Route path="/game" element={<Game ref={gameRef} appRef={appRef}/>} />
						<Route path="/scores" element={<Scores />} />
						<Route path="*" element={<Page404 />} />
					</Routes>
				</GameProvider>
			</Router>
		</div>

	);
}

export default App;
