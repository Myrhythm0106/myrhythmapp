
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, AlertTriangle, Users, Gavel } from "lucide-react";

const TermsOfService = () => {
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
              <FileText className="h-6 w-6 text-blue-600" />
              Terms of Service
            </CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Service Description
              </h2>
              <div className="space-y-2 text-sm">
                <p>MyRhythm is a support app designed to help individuals build structure, remember important tasks, and connect with their support network.</p>
                <p>Our services include routine building, memory support, daily task planning, and community connection features.</p>
                <p>The platform is intended for personal support use and is not a medical device or substitute for professional medical advice.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Medical Disclaimer
              </h2>
              <div className="space-y-2 text-sm">
                <p><strong>Important:</strong> MyRhythm is not a medical device or treatment.</p>
                <p>• Our tools are for structure and support purposes only</p>
                <p>• Always consult healthcare professionals for medical advice</p>
                <p>• Do not use our platform to diagnose or treat medical conditions</p>
                <p>• In case of emergencies, contact emergency services immediately</p>
                <p className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate("/legal/disclaimer")}
                    className="text-blue-600"
                  >
                    Read Full Disclaimer
                  </Button>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">User Responsibilities</h2>
              <div className="space-y-2 text-sm">
                <p>• Provide accurate information when creating your account</p>
                <p>• Keep your login credentials secure and confidential</p>
                <p>• Use the platform in accordance with these terms</p>
                <p>• Respect the privacy and rights of other users</p>
                <p>• Do not attempt to hack, reverse engineer, or misuse our services</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Account Management</h2>
              <div className="space-y-2 text-sm">
                <p>• You are responsible for maintaining the security of your account</p>
                <p>• Notify us immediately of any unauthorized access</p>
                <p>• You may delete your account at any time from the settings page</p>
                <p>• We reserve the right to suspend accounts that violate these terms</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Intellectual Property</h2>
              <div className="space-y-2 text-sm">
                <p>• MyRhythm platform and content are protected by copyright and trademark laws</p>
                <p>• You retain ownership of your personal data and content</p>
                <p>• You grant us license to process your data to provide our services</p>
                <p>• Do not copy, distribute, or create derivative works of our platform</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Gavel className="h-5 w-5 text-red-600" />
                Limitation of Liability
              </h2>
              <div className="space-y-2 text-sm">
                <p>MyRhythm is provided "as is" without warranties of any kind.</p>
                <p>• We are not liable for any damages arising from use of our platform</p>
                <p>• Our liability is limited to the amount you paid for our services</p>
                <p>• We do not guarantee uninterrupted or error-free service</p>
                <p>• Users assume responsibility for their wellness decisions</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Service Changes</h2>
              <div className="space-y-2 text-sm">
                <p>• We may modify or discontinue services with notice</p>
                <p>• Terms may be updated periodically with user notification</p>
                <p>• Significant changes will be communicated via email</p>
                <p>• Continued use after changes constitutes acceptance</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
              <div className="space-y-2 text-sm">
                <p>For questions about these terms:</p>
                <p>Email: legal@myrhythm.app</p>
                <p>Response time: Within 5 business days</p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Our Commitment:</strong> We're dedicated to providing a safe, secure, and supportive 
                platform for your cognitive wellness journey. These terms help us maintain a positive 
                environment for all users.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
