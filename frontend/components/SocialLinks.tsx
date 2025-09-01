import {
  TikTokIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedInIcon,
  YouTubeIcon,
  DiscordIcon,
  TelegramIcon,
} from './Icons';

interface SocialLinksProps {
  size?: 'normal' | 'large';
}

export default function SocialLinks({ size = 'normal' }: SocialLinksProps) {
  const links = [
    { icon: TikTokIcon, href: 'https://tiktok.com/@angelkellogg', label: 'TikTok' },
    { icon: InstagramIcon, href: 'https://instagram.com/angelkellogg', label: 'Instagram' },
    { icon: TwitterIcon, href: 'https://twitter.com/angelkellogg', label: 'Twitter' },
    { icon: YouTubeIcon, href: 'https://youtube.com/@angelkellogg', label: 'YouTube' },
    { icon: LinkedInIcon, href: 'https://linkedin.com/in/angelkellogg', label: 'LinkedIn' },
    { icon: DiscordIcon, href: 'https://discord.gg/angelkellogg', label: 'Discord' },
    { icon: TelegramIcon, href: 'https://t.me/angelkellogg', label: 'Telegram' },
  ];

  const iconSize = size === 'large' ? 'w-8 h-8' : 'w-6 h-6';
  const buttonSize = size === 'large' ? 'p-4' : 'p-3';

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`glass-effect ${buttonSize} rounded-full hover:scale-110 transition-transform`}
          aria-label={link.label}
        >
          <link.icon className={iconSize} />
        </a>
      ))}
    </div>
  );
}
