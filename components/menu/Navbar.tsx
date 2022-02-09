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
        <S.Logo src={Logo} alt='Crypter' />
      </S.Nav>
      <Burger />
      {props.children}
    </>
  );
}