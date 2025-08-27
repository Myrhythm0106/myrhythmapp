import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Lock, Eye, Database, Users, FileText } from "lucide-react";

interface ConsentDialogProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function ConsentDialog({ open, onAccept, onDecline }: ConsentDialogProps) {
  const [dataConsent, setDataConsent] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);

  const allConsentsGiven = dataConsent && privacyConsent && termsConsent;

  const handleAccept = () => {
    if (allConsentsGiven) {
      onAccept();
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6 text-memory-emerald-600" />
            Data Protection & Privacy
          </DialogTitle>
          <DialogDescription>
            Your privacy and data security are our top priorities. Please review and consent to how we'll protect and use your information.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Data Collection Consent */}
            <div className="border border-memory-emerald-200 rounded-lg p-4 bg-memory-emerald-50/30">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-memory-emerald-600 mt-1 flex-shrink-0" />
                <div className="space-y-3 flex-1">
                  <h3 className="font-semibold text-memory-emerald-800">Data Collection & Processing</h3>
                  <p className="text-sm text-memory-emerald-700">
                    We collect assessment responses, progress data, and usage patterns to personalize your cognitive empowerment journey. 
                    Your data is encrypted, stored securely, and never shared without your explicit consent.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="data-consent" 
                      checked={dataConsent}
                      onCheckedChange={(checked) => setDataConsent(checked === true)}
                    />
                    <label htmlFor="data-consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I consent to the collection and processing of my data as described
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Rights Consent */}
            <div className="border border-brain-health-200 rounded-lg p-4 bg-brain-health-50/30">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-brain-health-600 mt-1 flex-shrink-0" />
                <div className="space-y-3 flex-1">
                  <h3 className="font-semibold text-brain-health-800">Your Privacy Rights (GDPR Compliant)</h3>
                  <div className="text-sm text-brain-health-700 space-y-2">
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Access your personal data</li>
                      <li>Request data correction or deletion</li>
                      <li>Data portability and withdrawal of consent</li>
                      <li>Object to processing for legitimate interests</li>
                    </ul>
                    <p>Contact us at privacy@myrhythm.com to exercise these rights.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="privacy-consent" 
                      checked={privacyConsent}
                      onCheckedChange={(checked) => setPrivacyConsent(checked === true)}
                    />
                    <label htmlFor="privacy-consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I understand my privacy rights and consent to data processing
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms of Service */}
            <div className="border border-clarity-teal-200 rounded-lg p-4 bg-clarity-teal-50/30">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-clarity-teal-600 mt-1 flex-shrink-0" />
                <div className="space-y-3 flex-1">
                  <h3 className="font-semibold text-clarity-teal-800">Terms of Service</h3>
                  <p className="text-sm text-clarity-teal-700">
                    By proceeding, you agree to our Terms of Service and acknowledge that MyRhythm is a cognitive empowerment tool, 
                    not a medical device. Always consult healthcare professionals for medical advice.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms-consent" 
                      checked={termsConsent}
                      onCheckedChange={(checked) => setTermsConsent(checked === true)}
                    />
                    <label htmlFor="terms-consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I agree to the Terms of Service
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50 p-4 rounded-lg border border-memory-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-memory-emerald-600" />
                <span className="text-sm font-semibold text-memory-emerald-800">Security Commitment</span>
              </div>
              <p className="text-xs text-memory-emerald-700">
                Bank-level encryption • SOC 2 compliant • Regular security audits • ISO 27001 certified
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          {!allConsentsGiven && (
            <div className="text-xs text-amber-600 mb-2 text-center">
              Please check all boxes above to continue
            </div>
          )}
          <Button 
            variant="outline" 
            onClick={onDecline}
            className="border-gray-300 text-gray-600 hover:bg-gray-50 w-full sm:w-auto"
          >
            Decline
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={!allConsentsGiven}
            className={`w-full sm:w-auto ${
              allConsentsGiven 
                ? 'bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}