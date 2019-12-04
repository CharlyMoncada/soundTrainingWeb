import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout, Tabs } from 'antd';

import AllUsersChartDinamic from './components/AllUsersChart';
import UserChartDinamic from './components/UserChart';

import { BrowserRouter, Route, Link } from 'react-router-dom';
const { TabPane } = Tabs;
const { Content } = Layout;

function callback(key) {
  console.log(key);
}

class App extends Component {

  render(){
    return (
      <div className="App">
      <Layout>
        <Content> 
            <BrowserRouter>
                <Tabs onChange={callback} type="card">
                  <TabPane tab={ <Link to='/'>Home</Link>} key="1"> </TabPane>
                  <TabPane tab={ <Link to='/allUsersChart'>History - All Users Chart</Link>} key="2"></TabPane>
                  <TabPane tab={ <Link to='/userChart'>History - User Chart</Link>} key="3"></TabPane>
                </Tabs>
              <Route path='/allUsersChart' component={AllUsersChartDinamic}/>
              <Route path='/userChart' component={UserChartDinamic}/>
            </BrowserRouter>
        </Content>
      </Layout>
      </div>
    );
  }
};

export default App;