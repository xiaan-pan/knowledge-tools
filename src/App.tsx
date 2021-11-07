import React, { Component } from 'react';
import { 
	BrowserRouter  as Router, 
	Route, 
	Switch,
} from 'react-router-dom'
import './App.css'
import LoginView from './components/LoginView';
import Main from './components/Main';
// import Main from './components/Main'


interface AppProps {

}
interface AppState {

}
class App extends Component<AppProps, AppState>{
	public constructor(props: AppProps) {
		super(props)
		this.state = {

		}
	}

	public render(): JSX.Element {
		return (
			<Router>
				{/* <Switch> */}
					{/* <Route path="/DictionaryWindow/:path" component={DictionaryWindow} exact/>
					<Route path="/TextWindow/:path" component={TextWindow} exact/>
					<Route path="/ModelConfigWindow" component={ModelConfigWindow} exact/> */}
					<Route path="/" component={LoginView} exact/>
					<Route path="/index" component={Main} />

				{/* </Switch> */}
				
				{/* <Main /> */}
			</Router>
		)
	}


}
export default App;
