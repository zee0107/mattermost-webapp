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

function CenterNav(props: Props) {
  return (
    <S.Ul open={props.open}>
        <S.LogoUl src={Logo} alt={'Crypter'} />

        <NavLink
          to='/about'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <S.Li>About Us</S.Li>
        </NavLink>
        <NavLink
          to='/docs'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <S.Li>Docs</S.Li>
        </NavLink>
        <NavLink
          to='/help'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <S.Li>Help</S.Li>
        </NavLink>
        <NavLink
          to='/contact_us'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <S.Li>Contact Us</S.Li>
        </NavLink>
        <S.Li2><a href="/signup_index" className="btn buttonBgGreen">Register</a></S.Li2>
        <S.Li2><a href="/login" className="btn buttonBgGreen">Login</a></S.Li2>
    </S.Ul>

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

export default CenterNav;