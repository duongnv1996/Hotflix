import * as styled from './styles';

import { ProfileContext } from 'components/layout/Layout';

import { useContext } from 'react';
import Image from 'next/image';
import { signOut } from 'next-auth/client';

export default function UserMenu() {
  const { selectedProfile, setSelectedProfile, profile } =
    useContext(ProfileContext);
  const { avatar, name } = selectedProfile;

  return (
    <styled.Wrapper className="menu">
      <styled.Menu className="button">
        <Image src={avatar} alt={`${name}'s avatar`} width={32} height={32} />
        <styled.Dropdown className="dropdown">
          {profile.map(({ name, avatar }) => (
            <styled.DropdownOptions
              key={name}
              onClick={() => setSelectedProfile({ name, avatar })}
            >
              <styled.Wrapper className="image">
                <Image
                  src={avatar}
                  alt={`${name}'s avatar`}
                  width={32}
                  height={32}
                />
              </styled.Wrapper>
              {name}
            </styled.DropdownOptions>
          ))}
          <styled.DropdownOptions
            className="text"
            onClick={() => setSelectedProfile(null)}
          >
            Manage Profiles
          </styled.DropdownOptions>
          <styled.DropdownOptions className="text" onClick={() => signOut()}>
            Sign out of Nextflix
          </styled.DropdownOptions>
        </styled.Dropdown>
        <styled.Caret className="caret"></styled.Caret>
      </styled.Menu>
    </styled.Wrapper>
  );
}
