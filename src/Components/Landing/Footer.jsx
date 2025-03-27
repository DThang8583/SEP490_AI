import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, YouTube } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();

  const footerLinks = {
    company: [
      { text: 'Về chúng tôi', href: '/about' },
      { text: 'Sự nghiệp', href: '/careers' },
      { text: 'Tin tức', href: '/news' },
      { text: 'Blog', href: '/blog' },
    ],
    support: [
      { text: 'Trung tâm hỗ trợ', href: '/support' },
      { text: 'FAQ', href: '/faq' },
      { text: 'Liên hệ', href: '/contact' },
      { text: 'Báo lỗi', href: '/report' },
    ],
    legal: [
      { text: 'Điều khoản sử dụng', href: '/terms' },
      { text: 'Chính sách bảo mật', href: '/privacy' },
      { text: 'Cookie Policy', href: '/cookies' },
      { text: 'GDPR', href: '/gdpr' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook />, href: 'https://facebook.com' },
    { icon: <Twitter />, href: 'https://twitter.com' },
    { icon: <Instagram />, href: 'https://instagram.com' },
    { icon: <LinkedIn />, href: 'https://linkedin.com' },
    { icon: <YouTube />, href: 'https://youtube.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
        borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              AI Math Tool
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nền tảng học toán thông minh với AI, giúp học sinh phát triển tư duy và kỹ năng giải quyết vấn đề.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Công ty
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              {footerLinks.company.map((link) => (
                <Box component="li" key={link.text} sx={{ mb: 1 }}>
                  <Link
                    href={link.href}
                    color="text.secondary"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Support Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Hỗ trợ
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              {footerLinks.support.map((link) => (
                <Box component="li" key={link.text} sx={{ mb: 1 }}>
                  <Link
                    href={link.href}
                    color="text.secondary"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Legal Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Pháp lý
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              {footerLinks.legal.map((link) => (
                <Box component="li" key={link.text} sx={{ mb: 1 }}>
                  <Link
                    href={link.href}
                    color="text.secondary"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" gutterBottom>
              Liên hệ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@aimathtool.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Điện thoại: (84) 123-456-789
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} AI Math Tool. All rights reserved.
          </Typography>
          <Box>
            {socialLinks.map((social) => (
              <IconButton
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 