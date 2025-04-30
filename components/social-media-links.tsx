"use client"

import { Facebook, Twitter, Youtube, Instagram, Linkedin } from "lucide-react"

interface SocialMediaLinksProps {
  className?: string
  iconSize?: number
  showLabels?: boolean
}

export function SocialMediaLinks({ className = "", iconSize = 20, showLabels = false }: SocialMediaLinksProps) {
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/SanFranciscoDeputySheriffsAssociation",
      icon: <Facebook size={iconSize} />,
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/sanfranciscodsa",
      icon: <Twitter size={iconSize} />,
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/channel/UCgyW7q86c-Mua4bS1a9wBWA",
      icon: <Youtube size={iconSize} />,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/sfdeputysheriffsassociation/",
      icon: <Instagram size={iconSize} />,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/san-francisco-deputy-sheriffs%E2%80%99-association",
      icon: <Linkedin size={iconSize} />,
    },
  ]

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
          className="hover:text-[#FFD700] transition-colors flex items-center"
        >
          {link.icon}
          {showLabels && <span className="ml-1 text-sm">{link.name}</span>}
        </a>
      ))}
    </div>
  )
}
