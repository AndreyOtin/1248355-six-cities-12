import { BookmarkVariant } from '../../types/app';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { updateFavorite } from '../../store/middlewares/thunk/thunk-actions';
import { getFavorites, getUserStatus } from '../../store/reducers/user-slice/selectors';
import { AppRoute, AuthorizationStatus } from '../../consts/enum';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type ButtonProps = {
  variant: BookmarkVariant;
  id: number;
}

const BookmarkButton = ({ variant, id }: ButtonProps) => {
  const authStatus = useAppSelector(getUserStatus);
  const favorites = useAppSelector(getFavorites);
  const isFavorite = favorites?.some((f) => f.id === id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onClick = () => {
    (async () => {
      if (AuthorizationStatus.Auth !== authStatus) {
        navigate(AppRoute.Login);

        return;
      }

      const action = await dispatch(
        updateFavorite({
          id,
          isFavorite: !isFavorite
        }));

      if (updateFavorite.rejected.match(action)) {
        toast.error(action.error.message, { toastId: action.error.code });
      }
    })();
  };

  return (
    <button
      onClick={onClick}
      className={
        classNames(
          `${variant.block}__bookmark-button button`,
          { [`${variant.block}__bookmark-button--active`]: isFavorite }
        )
      }
      type="button"
    >
      <svg
        className={`${variant.block}__bookmark-icon`}
        width={variant.imgSize.width}
        height={variant.imgSize.height}
      >
        <use xlinkHref="#icon-bookmark"></use>
      </svg>
      <span className="visually-hidden">To bookmarks</span>
    </button>
  );
};

export default BookmarkButton;
