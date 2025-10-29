import { Container, Group, ActionIcon, Avatar, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.scss';

const mainLinks = [
  { link: '/summary', label: 'Сводка' },
  { link: '/portfolio', label: 'Портфель' },
  { link: '/transactions', label: 'Сделки' },
  { link: '/structure', label: 'Структура' },
];

export const Header = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const toggleTheme = () => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');

  const mainItems = mainLinks.map((item) => (
    <NavLink
      to={item.link}
      key={item.label}
      end
      className={({ isActive }) =>
        `${styles.mainLink} ${isActive ? styles.active : ''}`
      }
    >
      {item.label}
    </NavLink>
  ));

  return (
    <header className={styles.header}>
      <Container className={styles.inner} size="lg">
        <nav className={styles.navDesktop}>
          <Group gap="sm">{mainItems}</Group>
        </nav>

        <Group gap="xs" className={styles.actions}>
          <ActionIcon variant="subtle" onClick={toggleTheme} className={styles.actionIcon}>
            {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </ActionIcon>
          <Avatar size={28} radius="xl">Ю</Avatar>
        </Group>
      </Container>
    </header>
  );
};
