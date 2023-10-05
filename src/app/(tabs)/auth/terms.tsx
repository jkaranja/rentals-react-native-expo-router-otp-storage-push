import { View, Text, ScrollView } from "react-native";
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Terms = () => {
  return (
    <KeyboardAwareScrollView className="flex-1 p-4 gap-y-3 ">
      <Text className="font-semibold">Last Updated: September 1, 2023</Text>
      <Text>
        These Terms of Service ("Terms") govern your use of our platform, and by
        accessing or using the Site, you agree to be bound by these Terms.
        Please read them carefully.
      </Text>
      <Text>
        1. Acceptance of Terms By accessing or using our Site, you agree to
        comply with and be bound by these Terms. If you do not agree with these
        Terms, please refrain from using the Site.
      </Text>
      <Text>
        2. User Eligibility You must be at least 18 years old to use our
        services. By using the Site, you confirm that you are of legal age.
      </Text>
      <Text>3. Listing and Posting Guidelines</Text>
      <Text>
        a. Property Listings: When you post a property listing on our Site, you
        agree to provide accurate and up-to-date information about the property.
      </Text>
      <Text>
        b. Prohibited Content: You may not post or promote any content that is
        illegal, fraudulent, misleading, discriminatory, or violates any
        applicable laws or regulations.
      </Text>
      <Text>
        4. Privacy Our Privacy Policy governs the collection, use, and sharing
        of your personal information. By using the Site, you consent to our
        Privacy Policy.
      </Text>
      <Text>5. User Conduct </Text>
      <Text>
        a. You agree to use the Site in a lawful and respectful manner.
      </Text>
      <Text>
        b. You may not engage in any activity that disrupts or interferes with
        the proper functioning of the Site.
      </Text>
      <Text>
        6. Intellectual Property All content and materials on the Site,
        including logos, trademarks, and text, are protected by intellectual
        property laws. You may not use, reproduce, or distribute these materials
        without our written consent.
      </Text>
      <Text>
        7. Liability a. We are not responsible for the accuracy of property
        listings or the actions of users on the Site. b. You use the Site at
        your own risk. We do not guarantee the availability, security, or
        reliability of the Site.
      </Text>
      <Text>
        8. Termination We reserve the right to terminate or suspend your access
        to the Site at our discretion, with or without notice, if you violate
        these Terms.
      </Text>

      <Text>
        9. Modifications to Terms We may update or change these Terms at any
        time without prior notice. Your continued use of the Site after changes
        have been made constitutes acceptance of the revised Terms. Terms
      </Text>
    </KeyboardAwareScrollView>
  );
}

export default Terms