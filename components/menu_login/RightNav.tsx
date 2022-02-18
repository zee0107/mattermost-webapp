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
      <S.Li2><a href="/signup_index" className="btn buttonBgGreen">Register</a></S.Li2>
      <S.Li2><a href="/login" className="btn buttonBgGreen">Login</a></S.Li2>
    </S.Ul2>
  );
}

export default RightNav;