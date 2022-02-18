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
        <S.Li3><hr /></S.Li3>
        <S.Li3><hr /></S.Li3>
        <S.Li3><hr /></S.Li3>
        <S.Li3><hr /></S.Li3>
        <S.Li3><hr /></S.Li3>
        <S.Li2><a href="/signup_index" className="btn buttonBgGreen">Register</a></S.Li2>
        <S.Li2><a href="/login" className="btn buttonBgWhite">Login</a></S.Li2>
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