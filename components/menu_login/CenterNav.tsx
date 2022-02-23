import * as S from './styles';

import Logo from 'images/logoLight.png';
import profPic from 'images/profiles/user-profile-1.png'
import * as GlobalActions from 'actions/global_actions';
import StatusDropdown from '../status_dropdown';

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

function handleEmitUserLoggedOutEvent(){
  GlobalActions.emitUserLoggedOutEvent();
}

function CenterNav(props: Props) {
  return (
    <S.Ul open={props.open}>
        <S.LogoUl src={Logo} alt={'Crypter'} />
        <S.Li4>
          <div className='d-flex search-div'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-search search-icon" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <input id='search' type='text' className='search-input' placeholder='Search People, Pages, Groups &amp; #Hashtag'/>
          </div>
        </S.Li4>
        <S.Li3><hr /></S.Li3>
        <S.Li2><a href="/messages" className="bg-icons"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-person-plus menu-align" viewBox="0 0 16 16">
        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
        <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
      </svg></a></S.Li2>
        <S.Li2><a href="/messages" className="bg-icons"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-chat-right-text menu-align" viewBox="0 0 16 16">
          <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
          <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
        </svg></a></S.Li2>
        <S.Li2><a href="/notification" className="bg-icons"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--text-primary)" className="bi bi-bell menu-align" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
        </svg></a></S.Li2>
        <S.Li2><StatusDropdown globalHeader={true}/>{/*<a href="/profile" className="bg-icons"><img className='img-profile' src={profPic}></img>Evan Yates</a>*/}</S.Li2>
        <S.Li2><button onClick={handleEmitUserLoggedOutEvent} className='btn-logout'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box-arrow-in-right logout-icon" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" fill='var(--text-primary)'/>
          <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" fill='var(--text-primary)'/>
        </svg> Logout</button></S.Li2>
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