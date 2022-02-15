import * as S from './styles';

import logoLight from 'images/logoLight.png';
import logoDark from 'images/logoWhite.png';
import Logo from 'images/logoLight.png';
import Burger from './Burger';

type Props = {
  children?: ChildNode;
};

export default function Navbar(props: Props) {
  return (
    <>
      <div className='row navBg'>
        <S.Nav>
          <S.Logo src={Logo} alt='Crypter' />
        </S.Nav>
        <Burger />
        {props.children}
      </div>
    </>
  );
}