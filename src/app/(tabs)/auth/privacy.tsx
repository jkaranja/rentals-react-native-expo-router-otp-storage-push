import { View, Text } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Privacy = () => {
  return (
    <KeyboardAwareScrollView className="flex-1 p-4 gap-y-3 ">
      <Text className="font-semibold">Last Updated: September 1, 2023</Text>
      <Text>
        This Privacy Policy outlines how we collect, use, and protect your
        personal information. By using our Site, you consent to the practices
        described herein.
      </Text>
      <Text>1. Information We Collect </Text>
      <Text>
        a. User-Provided Information: When you create an account or list a
        property on our Site, we collect personal information such as your name,
        email address, phone number, and property details.
      </Text>
      <Text>
        b. Automatically Collected Information: We may collect information about
        your device and browsing activity, such as IP address, browser type, and
        pages visited, to improve our services and for analytics purposes.
      </Text>
      <Text>2. Use of Your Information</Text>
      <Text>
        a. Property Listings: We use your information to display property
        listings, connect buyers and sellers, and facilitate property-related
        transactions.
      </Text>
      <Text>
        b. Communication: We may use your contact information to send you
        transactional messages, updates, and promotional offers related to our
        services.
      </Text>
      <Text>
        
        c. Improvement and Analysis: We use collected data to analyze user
        behavior, improve our Site's functionality, and enhance user experience.
      </Text>
      <Text>3. Sharing Your Information</Text>
      <Text>
        a. Property Listings: Your property information, including contact
        details, may be shared with potential buyers or renters.
      </Text>
      <Text>
        b. Service Providers: We may share your information with third-party
        service providers who assist in running our Site and services. These
        providers are bound by confidentiality agreements.
      </Text>
      <Text>
        
        c. Legal Compliance: We may disclose your information when required by
        law, such as in response to legal requests or to protect our rights and
        interests.
      </Text>
      <Text>
        4. Security We implement security measures to safeguard your
        information; however, no method is 100% secure. We cannot guarantee the
        absolute security of your data.
      </Text>
      <Text>5. Your Choices</Text>
      <Text>
        a. Account Information: You can review and update your account
        information at any time.
      </Text>
      <Text>
        
        b. Marketing Communications: You can opt-out of receiving marketing
        communications from us by following the instructions in the
        communication.
      </Text>
      <Text>
        6. Third-Party Links Our Site may contain links to third-party websites.
        We are not responsible for the privacy practices or content on these
        external sites.
      </Text>
      <Text>
        7. Changes to this Privacy Policy We may update this Privacy Policy to
        reflect changes in our practices or legal requirements.
      </Text>
     

    
      <Text>
        By using our site, you acknowledge that you have read, understood, and
        consent to the practices outlined in this Privacy Policy. Thank you for
        using our services!
      </Text>
    </KeyboardAwareScrollView>
  );
};

export default Privacy;
