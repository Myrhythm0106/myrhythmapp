
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, Trash2 } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="h-6 w-6 text-blue-600" />
              Privacy Policy
            </CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                What Information We Collect
              </h2>
              <div className="space-y-2 text-sm">
                <p><strong>Account Information:</strong> Name, email address, and encrypted password</p>
                <p><strong>Health Data:</strong> Mood entries, gratitude notes, daily actions, and assessment responses</p>
                <p><strong>Usage Data:</strong> How you interact with the app to improve your experience</p>
                <p><strong>Technical Data:</strong> Device information and IP address for security purposes</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                How We Protect Your Data
              </h2>
              <div className="space-y-2 text-sm">
                <p>• <strong>Encryption:</strong> All data is encrypted in transit and at rest</p>
                <p>• <strong>Secure Storage:</strong> Data stored in SOC 2 compliant cloud infrastructure</p>
                <p>• <strong>Access Control:</strong> Only you can access your personal health data</p>
                <p>• <strong>Regular Security Audits:</strong> We continuously monitor for security threats</p>
                <p>• <strong>No Third-Party Sharing:</strong> We never sell or share your personal data</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Legal Compliance</h2>
              <div className="space-y-2 text-sm">
                <p>• <strong>GDPR Compliance:</strong> Full compliance with European data protection regulations</p>
                <p>• <strong>HIPAA Considerations:</strong> Healthcare-grade security practices</p>
                <p>• <strong>Data Minimization:</strong> We only collect data necessary for app functionality</p>
                <p>• <strong>Consent Management:</strong> Clear consent for all data collection and processing</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                Your Rights
              </h2>
              <div className="space-y-2 text-sm">
                <p>• <strong>Access:</strong> Request a copy of all your data</p>
                <p>• <strong>Correction:</strong> Update or correct your information</p>
                <p>• <strong>Deletion:</strong> Delete your account and all associated data</p>
                <p>• <strong>Portability:</strong> Export your data in a readable format</p>
                <p>• <strong>Withdrawal:</strong> Withdraw consent for data processing at any time</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Data Retention</h2>
              <div className="space-y-2 text-sm">
                <p>• Account data is retained while your account is active</p>
                <p>• You can delete your account and all data at any time from settings</p>
                <p>• Backup data is automatically deleted within 30 days of account deletion</p>
                <p>• Anonymous usage statistics may be retained for product improvement</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <div className="space-y-2 text-sm">
                <p>For privacy questions or to exercise your rights:</p>
                <p>Email: privacy@myrhythm.app</p>
                <p>Response time: Within 72 hours for all privacy requests</p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Your data, your control.</strong> MyRhythm is designed with privacy by design principles. 
                We believe your health data belongs to you, and we're committed to keeping it secure and private.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
