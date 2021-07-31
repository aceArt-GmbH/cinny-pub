import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Settings.scss';

import initMatrix from '../../../client/initMatrix';
import settings from '../../../client/state/settings';

import Text from '../../atoms/text/Text';
import IconButton from '../../atoms/button/IconButton';
import SegmentedControls from '../../atoms/segmented-controls/SegmentedControls';

import PopupWindow, { PWContentSelector } from '../../molecules/popup-window/PopupWindow';
import SettingTile from '../../molecules/setting-tile/SettingTile';

import SunIC from '../../../../public/res/ic/outlined/sun.svg';
import LockIC from '../../../../public/res/ic/outlined/lock.svg';
import InfoIC from '../../../../public/res/ic/outlined/info.svg';
import CrossIC from '../../../../public/res/ic/outlined/cross.svg';

function AppearanceSection() {
  return (
    <div className="settings-content">
      <SettingTile
        title="Theme"
        content={(
          <SegmentedControls
            selected={settings.getThemeIndex()}
            segments={[
              { text: 'Light' },
              { text: 'Silver' },
              { text: 'Dark' },
              { text: 'Butter' },
            ]}
            onSelect={(index) => settings.setTheme(index)}
          />
        )}
      />
    </div>
  );
}

function SecuritySection() {
  return <div className="settings-content" />;
}

function AboutSection() {
  return (
    <div className="settings-content">
      <Text className="settings__about" variant="b1">
        <a href="https://cinny.in/#about" target="_blank" rel="noreferrer">About</a>
      </Text>
      <Text className="settings__about">Version: 1.0.0</Text>
      <Text className="settings__about">{`Device ID: ${initMatrix.matrixClient.getDeviceId()}`}</Text>
    </div>
  );
}

function Settings({ isOpen, onRequestClose }) {
  const settingSections = [{
    name: 'Appearance',
    iconSrc: SunIC,
    render() {
      return <AppearanceSection />;
    },
  }, {
    name: 'Security & Privacy',
    iconSrc: LockIC,
    render() {
      return <SecuritySection />;
    },
  }, {
    name: 'Help & About',
    iconSrc: InfoIC,
    render() {
      return <AboutSection />;
    },
  }];
  const [selectedSection, setSelectedSection] = useState(settingSections[0]);

  return (
    <PopupWindow
      className="settings-window"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title="Settings"
      contentTitle={selectedSection.name}
      drawer={
        settingSections.map((section) => (
          <PWContentSelector
            key={section.name}
            selected={selectedSection.name === section.name}
            onClick={() => setSelectedSection(section)}
            iconSrc={section.iconSrc}
          >
            {section.name}
          </PWContentSelector>
        ))
      }
      contentOptions={<IconButton src={CrossIC} onClick={onRequestClose} tooltip="Close" />}
    >
      {selectedSection.render()}
    </PopupWindow>
  );
}

Settings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

export default Settings;
