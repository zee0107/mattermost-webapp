import styled from 'styled-components';

interface INav {
  open: boolean;
}

export const StyledBurger = styled.div<INav>`
  width: 2rem;
  height: 2rem;
  position: fixed;
  top: 15px;
  right: 20px;
  z-index: 20;
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-around;
    flex-flow: column nowrap;
  }
`

export const Menus = styled.div<INav>`
    width: 2rem;
    height: 0.25rem;
    background-color: var(--text-primary);
    border-radius: 10px;
    transform-origin: 1px;
    transition: all 0.3s linear;
    cursor: pointer;

    &:nth-child(1) {
      transform: ${(props) => props.open ? 'rotate(45deg)' : 'rotate(0)'};
    }
    &:nth-child(2) {
      transform: ${(props) => props.open ? 'translateX(100%)' : 'translateX(0)'};
      opacity: ${(props) => props.open ? 0 : 1};
    }
    &:nth-child(3) {
      transform: ${(props) => props.open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
`

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  background-color: var(--background);
  align-items: center;
  position: relative;
  height: 70px;
  @media (max-width: 678px) {
    width: 100vw;
  }
`

export const Ul = styled.ul<INav>`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  position: absolute;
  width: 115%;
  top: 0;
  justify-content: center;
  margin-top: 0px;
  align-items: center;
  font-size: 18px;
  margin-left: 20px;

  a {
    text-decoration: none;
    text-transform: none;
    cursor: pointer;
    color: var(--text-primary);

    &:hover {
      color: #41cb4d;
    }
  }

  @media (max-width: 768px) {
    flex-flow: column nowrap;
    background-color: #fdfdfdfa;
    position: fixed;
    transform: ${(props) => props.open ? 'translateX(0)' : 'translateX(100%)'};
    top: -16px;
    right: 0;
    height: 100%;
    width: 300px;
    padding-top: 3.5rem;
    transition: transform 0.3s ease-in-out;
    z-index: 9;
    justify-content: normal;
    background-color: var(--bgDiv) !important;

  }
`

export const Li = styled.li`
  padding: 18px 30px;
  outline: none;

  @media (max-width: 768px) {
    margin-right: 34px;
    padding-bottom: 0px;
    &:hover {
      color: #41cb4d;
    }
}
`

export const Ul2 = styled.ul<INav>`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  position: absolute;
  width: 80%;
  top: 0;
  justify-content: flex-end;
  margin-top: 0px;
  align-items: center;
  font-size: 18px;
  margin-left: 20px;

  @media (max-width: 768px) {
    flex-flow: column nowrap;
    background-color: #fdfdfdfa;
    position: fixed;
    transform: ${(props) => props.open ? 'translateX(0)' : 'translateX(100%)'};
    top: -16px;
    right: 0;
    height: 100%;
    width: 300px;
    padding-top: 3.5rem;
    transition: transform 0.3s ease-in-out;
    z-index: 9;
    justify-content: normal;
  }
`

export const Li2 = styled.li`
  padding: 18px 5px;
  outline: none;

  @media (max-width: 768px) {
    color: #000;
    padding-bottom: 0px;
    margin-right: 34px;
}
`
export const Li3 = styled.li`
  margin-left: 170px;

  @media (max-width: 768px) {
    color: #000;
    padding-bottom: 0px;
    margin-right: 34px;
}
`

export const Logo = styled.img`
  margin: 20px 50px 20px 17%;
  width: 160px;
  height: 70px;
  object-fit: contain;

  @media (max-width: 1250px) {
    margin: 20px 50px 20px 5%;
  }

`

export const LogoUl = styled.img`
  margin: 20px 50px 20px 5%;
  display: none;

  @media (max-width: 768px) {
    display: flex;
    width: 160px;
    height: 70px;
    object-fit: contain;
  }
`

export const Icon = styled.div`
  width: 100vw;
  height: calc(100vh - 112px);
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Image = styled.img`
  width: 150px;
  height: 150px;
  pointer-events: none;
  object-fit: contain;
  animation: Spin infinite 20s linear;
`