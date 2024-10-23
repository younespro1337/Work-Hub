import { Container, Typography, Box, Divider, Button } from '@mui/material';
import React from 'react';

const CustomTermsAndConditions = () => {
  return (
    <Container>
      <Box sx={{ mt: 14 }}>
        <Typography variant="h4" gutterBottom>
          Terms and Conditions
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to Work-Hub  By using our services, you agree to the following terms and conditions:
        </Typography>

        <Divider />

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          1. User Agreement
        </Typography>
        <Typography variant="body1" paragraph>
          By accessing and using our platform, you agree to comply with these terms. Failure to do so may result in termination of your account.
        </Typography>

        <Divider />

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          2. Account and Security
        </Typography>
        <Typography variant="body1" paragraph>
          You are responsible for maintaining the confidentiality of your account credentials. Any activity that occurs under your account is your responsibility.
        </Typography>

        <Divider />

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          3. Subscription and Payment
        </Typography>
        <Typography variant="body1" paragraph>
          Our services are provided on a subscription basis. By subscribing, you agree to pay the associated fees. Payments are non-refundable.
        </Typography>

        <Divider />

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          4. Data Privacy
        </Typography>
        <Typography variant="body1" paragraph>
          We respect your privacy and will not share your personal information with third parties without your consent, unless required by law.
        </Typography>

        <Divider />

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          5. Intellectual Property
        </Typography>
        <Typography variant="body1" paragraph>
          All content, software, and technology provided by [Your SaaS App Name] is owned by us. You may not copy, modify, or distribute it without our permission.
        </Typography>

        <Divider />

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          6. Termination
        </Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to terminate or suspend your account if you violate these terms or engage in any unlawful activities.
        </Typography>

        <Divider />

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          7. Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph>
          We are not liable for any damages that may occur from using our services. Use the platform at your own risk.
        </Typography>

        <Divider />

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          8. Changes to Terms
        </Typography>
        <Typography variant="body1" paragraph>
          We may update these terms from time to time. You will be notified of any changes, and continued use of the platform means you accept the new terms.
        </Typography>

        <Divider />

        <Typography variant="body1" paragraph sx={{ mt: 3 }}>
          If you have any questions, please contact us at <Button type="error">support@workHub.com</Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default CustomTermsAndConditions;
