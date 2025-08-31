import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReadingTab } from '@zoroaster/ui';
import { AchievementsTab } from '@zoroaster/ui';
import { PreferencesTab } from '@zoroaster/ui';
import { SecurityTab } from '@zoroaster/ui';

const AccountPage: React.FC = () => {
  return (
    <div>
      <h1>Account Page</h1>
      <ReadingTab />
      <AchievementsTab />
      <PreferencesTab />
      <SecurityTab />
    </div>
  );
};

export default AccountPage;
