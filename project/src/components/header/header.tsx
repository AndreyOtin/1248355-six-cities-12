import Logo from '../logo/logo';
import { AppRoute, AuthorizationStatus, LogoVariant } from '../../consts/enum';
import cl from './header.module.css';
import classNames from 'classnames';
import React, { MouseEventHandler } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { Link } from 'react-router-dom';
import { logUserOut } from '../../store/thunk-actions';

type HeaderProps = {
  isLoginRoute: boolean;
}

const Header = ({ isLoginRoute }: HeaderProps) => {
  const isLoading = useAppSelector((state) => state.api.isLoading);
  const authorizationStatus = useAppSelector((state) => state.api.authorizationStatus);
  const user = useAppSelector((state) => state.api.user);
  const dispatch = useAppDispatch();

  const handleLogoutClick: MouseEventHandler<HTMLAnchorElement> = (evt) => {
    evt.preventDefault();
    dispatch(logUserOut());
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Logo variant={LogoVariant.Header}/>
          </div>
          {isLoginRoute ||
            <nav className="header__nav">
              <ul
                className={classNames(
                  'header__nav-list',
                  { [cl.animation]: isLoading || authorizationStatus === AuthorizationStatus.Unknown })}
              >
                {
                  authorizationStatus === AuthorizationStatus.Auth
                    ?
                    <>
                      <li className="header__nav-item user">
                        <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Favorites}>
                          <div className="header__avatar-wrapper user__avatar-wrapper">
                          </div>
                          <span className="header__user-name user__name">{user?.email}</span>
                          <span className="header__favorite-count">3</span>
                        </Link>
                      </li>
                      <li className="header__nav-item">
                        <a onClick={handleLogoutClick} className="header__nav-link" href={AppRoute.Root}>
                          <span className="header__signout">Sign out</span>
                        </a>
                      </li>
                    </>
                    :
                    <li className="header__nav-item user">
                      <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Login}>
                        <div className="header__avatar-wrapper user__avatar-wrapper">
                        </div>
                        <span className="header__login">Sign in</span>
                      </Link>
                    </li>
                }
              </ul>
            </nav>}
        </div>
      </div>
    </header>
  );
};

export default Header;
