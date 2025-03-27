import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, YouTube, School, Email, Phone, LocationOn } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Về chúng tôi', path: '/about' },
      { name: 'Sự nghiệp', path: '/careers' },
      { name: 'Tin tức', path: '/news' },
      { name: 'Liên hệ', path: '/contact' }
    ],
    support: [
      { name: 'Trung tâm hỗ trợ', path: '/support' },
      { name: 'Hướng dẫn sử dụng', path: '/guide' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Chính sách bảo mật', path: '/privacy' }
    ],
    legal: [
      { name: 'Điều khoản sử dụng', path: '/terms' },
      { name: 'Chính sách bảo mật', path: '/privacy' },
      { name: 'Chính sách cookie', path: '/cookie' },
      { name: 'Quy định', path: '/regulations' }
    ]
  };

  const socialLinks = [
    { icon: <Facebook />, url: 'https://facebook.com' },
    { icon: <Twitter />, url: 'https://twitter.com' },
    { icon: <Instagram />, url: 'https://instagram.com' },
    { icon: <LinkedIn />, url: 'https://linkedin.com' },
    { icon: <YouTube />, url: 'https://youtube.com' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#ffffff',
        color: '#2D3436',
        py: 6,
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ fontSize: 40, color: '#FF6B6B', mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2D3436' }}>
                  AI Math Tool
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#636E72', mb: 2 }}>
                Nền tảng học tập thông minh với công nghệ AI, giúp học sinh phát triển tư duy và kỹ năng toán học một cách hiệu quả.
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2D3436', fontWeight: 'bold' }}>
              Công ty
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {footerLinks.company.map((link) => (
                <Box component="li" key={link.name} sx={{ mb: 1 }}>
                  <Link
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      color: '#636E72',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#FF6B6B',
                      },
                    }}
                  >
                    {link.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Support Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2D3436', fontWeight: 'bold' }}>
              Hỗ trợ
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {footerLinks.support.map((link) => (
                <Box component="li" key={link.name} sx={{ mb: 1 }}>
                  <Link
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      color: '#636E72',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#FF6B6B',
                      },
                    }}
                  >
                    {link.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Legal Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2D3436', fontWeight: 'bold' }}>
              Pháp lý
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {footerLinks.legal.map((link) => (
                <Box component="li" key={link.name} sx={{ mb: 1 }}>
                  <Link
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      color: '#636E72',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#FF6B6B',
                      },
                    }}
                  >
                    {link.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2D3436', fontWeight: 'bold' }}>
              Liên hệ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 20, color: '#FF6B6B' }} />
                <Typography variant="body2" sx={{ color: '#636E72' }}>
                  support@aimathtool.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 20, color: '#FF6B6B' }} />
                <Typography variant="body2" sx={{ color: '#636E72' }}>
                  +84 123 456 789
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 20, color: '#FF6B6B' }} />
                <Typography variant="body2" sx={{ color: '#636E72' }}>
                  Hà Nội, Việt Nam
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#636E72', mb: { xs: 2, sm: 0 } }}>
            © {currentYear} AI Math Tool. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {socialLinks.map((social) => (
              <IconButton
                key={social.url}
                component="a"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#636E72',
                  '&:hover': {
                    color: '#FF6B6B',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
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