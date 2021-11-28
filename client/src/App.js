import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {Header, Welcome, Game, Scores, Rules, Page404} from './components';

import './App.css';

const App = () => (
    <div className="App">
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<Welcome />} />
				<Route path="/game" element={<Game />} />
				<Route path="/scores" element={<Scores />} />
				<Route path="/rules" element={<Rules />} />
				<Route path="*" element={<Page404 />} />
			</Routes>
		</Router>
    </div>
);

export default App;
