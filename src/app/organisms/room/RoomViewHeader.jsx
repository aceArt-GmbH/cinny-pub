import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './RoomViewHeader.scss';
import { useTranslation } from 'react-i18next';

import { twemojify } from '../../../util/twemojify';
import { blurOnBubbling } from '../../atoms/button/script';

import initMatrix from '../../../client/initMatrix';
import cons from '../../../client/state/cons';
import navigation from '../../../client/state/navigation';
import {
  toggleRoomSettings,
  openReusableContextMenu,
  openNavigation,
} from '../../../client/action/navigation';
import colorMXID from '../../../util/colorMXID';
import { getEventCords } from '../../../util/common';

import { tabText } from './RoomSettings';
import Text from '../../atoms/text/Text';
import RawIcon from '../../atoms/system-icons/RawIcon';
import IconButton from '../../atoms/button/IconButton';
import Header, { TitleWrapper } from '../../atoms/header/Header';
import Avatar from '../../atoms/avatar/Avatar';
import RoomOptions from '../../molecules/room-options/RoomOptions';

import ChevronBottomIC from '../../../../public/res/ic/outlined/chevron-bottom.svg';
import SearchIC from '../../../../public/res/ic/outlined/search.svg';
import UserIC from '../../../../public/res/ic/outlined/user.svg';
import VerticalMenuIC from '../../../../public/res/ic/outlined/vertical-menu.svg';
import BackArrowIC from '../../../../public/res/ic/outlined/chevron-left.svg';

import { useForceUpdate } from '../../hooks/useForceUpdate';
import { useSetSetting } from '../../state/hooks/settings';
import { settingsAtom } from '../../state/settings';

function RoomViewHeader({ roomId }) {
  const [, forceUpdate] = useForceUpdate();
  const mx = initMatrix.matrixClient;
  const isDM = initMatrix.roomList.directs.has(roomId);
  const room = mx.getRoom(roomId);
  const setPeopleDrawer = useSetSetting(settingsAtom, 'isPeopleDrawer');
  let avatarSrc = room.getAvatarUrl(mx.baseUrl, 36, 36, 'crop');
  avatarSrc = isDM
    ? room.getAvatarFallbackMember()?.getAvatarUrl(mx.baseUrl, 36, 36, 'crop')
    : avatarSrc;
  const roomName = room.name;

  const roomHeaderBtnRef = useRef(null);
  useEffect(() => {
    const settingsToggle = (isVisibile) => {
      const rawIcon = roomHeaderBtnRef.current.lastElementChild;
      rawIcon.style.transform = isVisibile ? 'rotateX(180deg)' : 'rotateX(0deg)';
    };
    navigation.on(cons.events.navigation.ROOM_SETTINGS_TOGGLED, settingsToggle);
    return () => {
      navigation.removeListener(cons.events.navigation.ROOM_SETTINGS_TOGGLED, settingsToggle);
    };
  }, []);

  useEffect(() => {
    const { roomList } = initMatrix;
    const handleProfileUpdate = (rId) => {
      if (roomId !== rId) return;
      forceUpdate();
    };

    roomList.on(cons.events.roomList.ROOM_PROFILE_UPDATED, handleProfileUpdate);
    return () => {
      roomList.removeListener(cons.events.roomList.ROOM_PROFILE_UPDATED, handleProfileUpdate);
    };
  }, [roomId]);

  const openRoomOptions = (e) => {
    openReusableContextMenu('bottom', getEventCords(e, '.ic-btn'), (closeMenu) => (
      <RoomOptions roomId={roomId} afterOptionSelect={closeMenu} />
    ));
  };
  const { t } = useTranslation();

  return (
    <Header>
      <IconButton
        src={BackArrowIC}
        className="room-header__back-btn"
        tooltip={t('Organisms.RoomViewHeader.return_navigation')}
        onClick={() => openNavigation()}
      />
      <button
        ref={roomHeaderBtnRef}
        className="room-header__btn"
        onClick={() => toggleRoomSettings()}
        type="button"
        onMouseUp={(e) => blurOnBubbling(e, '.room-header__btn')}
      >
        <Avatar imageSrc={avatarSrc} text={roomName} bgColor={colorMXID(roomId)} size="small" />
        <TitleWrapper>
          <Text variant="h2" weight="medium" primary>
            {twemojify(roomName)}
          </Text>
        </TitleWrapper>
        <RawIcon src={ChevronBottomIC} />
      </button>
      {mx.isRoomEncrypted(roomId) === false && (
        <IconButton
          onClick={() => toggleRoomSettings(tabText.SEARCH)}
          tooltip={t('Organisms.RoomViewHeader.search_tooltip')}
          src={SearchIC}
        />
      )}
      <IconButton
        className="room-header__drawer-btn"
        onClick={() => {
          setPeopleDrawer((toggle) => !toggle);
        }}
        tooltip={t('Organisms.RoomViewHeader.people_tooltip')}
        src={UserIC}
      />
      <IconButton
        className="room-header__members-btn"
        onClick={() => toggleRoomSettings(tabText.MEMBERS)}
        tooltip={t('Organisms.RoomViewHeader.members_tooltip')}
        src={UserIC}
      />
      <IconButton onClick={openRoomOptions} tooltip={t('common.options')} src={VerticalMenuIC} />
    </Header>
  );
}
RoomViewHeader.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default RoomViewHeader;
