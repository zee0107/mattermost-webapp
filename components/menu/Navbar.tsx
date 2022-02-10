import * as S from './styles';

import Logo from 'images/logoLight.png';
import Burger from './Burger';

type Props = {
  children?: ChildNode;
};

export default function Navbar(props: Props) {
  return (
    <>
      <S.Nav>
        <a href="/home">
          <S.Logo src={Logo} alt='Crypter' />
        </a>
      </S.Nav>
      <Burger />
      {props.children}
    </>
  );
}