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
    <Router>
      <S.Ul open={props.open}>
        <S.LogoUl src={Logo} alt={'Crypter'} />

        <NavLink
          to='#'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <S.Li>About Us</S.Li>
        </NavLink>
        <NavLink
          to='#'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <S.Li>Docs</S.Li>
        </NavLink>
        <NavLink
          to='#'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <S.Li>Help</S.Li>
        </NavLink>
        <NavLink
          to='#'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <S.Li>Contact Us</S.Li>
        </NavLink>

        {/*<NavLink
          to='#'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <S.Li>
              <a href="/signup_index" className="btn buttonBgGreen">Register</a>
          </S.Li>
        </NavLink>

        <NavLink
          to='#'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <S.Li><a href="/login" className="btn buttonBgGreen">Login</a></S.Li>
        </NavLink>*/}
      </S.Ul>

      <Switch>
        <Route exact path='#'>
          <S.Icon>
            {/*<S.Image src={IconReact} alt='React' />*/}
          </S.Icon>
        </Route>
        <Route exact path='#'>
          <S.Icon>
            {/*<S.Image src={IconMegamen} alt='Megamen' />*/}
          </S.Icon>
        </Route>
        <Route exact path='#'>
          <S.Icon>
            {/*<S.Image src={IconMario} alt='Mario' />*/}
          </S.Icon>
        </Route>
        <Route exact path='#'>
          <S.Icon>
            {/*<S.Image src={IconTurtle} alt='Turtle' />*/}
          </S.Icon>
        </Route>

        <Redirect to='/home' />
      </Switch>
    </Router>
  );
}

export default RightNav;