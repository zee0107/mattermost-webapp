import * as S from './styles';

import Logo from 'images/logoLight.png';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from 'react-router-dom';

type Props = {
  open: boolean;
};

function RightNav(props: Props) {
  return (
    <S.Ul2 open={props.open}>
        <NavLink
          to='/signup_index'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <S.Li2>
              <a href="/signup_index" className="btn buttonBgGreen">Register</a>
          </S.Li2>
        </NavLink>

        <NavLink
          to='/login'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <S.Li2><a href="/login" className="btn buttonBgGreen">Login</a></S.Li2>
        </NavLink>
    </S.Ul2>

    /*<Router>
      

      <Switch>
        <Route exact path='/signup_index'>
        </Route>
        <Route exact path='/login'>
        </Route>
        <Route exact path='#'>
          <S.Icon>
            <S.Image src={IconMario} alt='Mario' />
          </S.Icon>
        </Route>
        <Route exact path='#'>
          <S.Icon>
            <S.Image src={IconTurtle} alt='Turtle' />
          </S.Icon>
        </Route>

        <Redirect to='/home' />
      </Switch>
    </Router>*/
  );
}

export default RightNav;