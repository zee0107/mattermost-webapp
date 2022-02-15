import * as S from './styles';

import logoLight from 'images/logoLight.png';
import logoDark from 'images/logoWhite.png';
import Logo from 'images/logoLight.png';
import Burger from './Burger';

type Props = {
  children?: ChildNode;
};

export default function Navbar(props: Props, mode) {
  console.log(mode);
  return (
    <>
      <div className='row navBg'>
        <S.Nav>
            {mode === 'dark' && <S.Logo src={logoDark} alt='Crypter' />}
            {mode !== 'dark' && <S.Logo src={logoLight} alt='Crypter' />}
        </S.Nav>
        <Burger />
        {props.children}
      </div>
    </>
  );
}