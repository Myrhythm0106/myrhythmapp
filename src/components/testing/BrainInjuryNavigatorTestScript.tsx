import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Download, Monitor, Smartphone, Tablet, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface TestCase {
  id: string;
  category: string;
  testStep: string;
  action: string;
  expectedResult: string;
  actualResult: string;
  status: 'Not Run' | 'Passed' | 'Failed' | 'Blocked';
  device: 'PC' | 'Phone' | 'Tablet';
  tester: string;
  dateTested: string;
  notes: string;
}

const initialTestCases: TestCase[] = [
  // PC DESKTOP TESTS - Registration (BIN-PC-001 to BIN-PC-010)
  { id: 'BIN-PC-001', category: 'Registration', testStep: 'Navigate to landing page', action: 'Open /launch in browser', expectedResult: 'Landing page loads with hero section and "Start Your Journey" button', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-002', category: 'Registration', testStep: 'Click primary CTA', action: 'Click "Start Your Journey" button', expectedResult: 'Navigates to /launch/register page', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-003', category: 'Registration', testStep: 'View registration form', action: 'Observe form fields', expectedResult: 'Email and password fields visible with validation indicators', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-004', category: 'Registration', testStep: 'Enter invalid email', action: 'Type "notanemail" in email field', expectedResult: 'Email validation error shown', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-005', category: 'Registration', testStep: 'Enter weak password', action: 'Type "123" in password field', expectedResult: 'Password strength indicator shows weak', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-006', category: 'Registration', testStep: 'Enter valid credentials', action: 'Enter valid email and strong password', expectedResult: 'Both fields show valid state, continue button enabled', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-007', category: 'Registration', testStep: 'Submit registration', action: 'Click "Create Account" button', expectedResult: 'Account created, redirected to user type selection', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-008', category: 'Registration', testStep: 'Select Brain Injury Navigator', action: 'Click "Brain Injury Navigator" user type card', expectedResult: 'Card highlighted, user type saved', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-009', category: 'Registration', testStep: 'Complete user type selection', action: 'Click "Continue" after selecting user type', expectedResult: 'Navigates to onboarding or assessment', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-010', category: 'Registration', testStep: 'Sign in existing user', action: 'Navigate to /launch/signin, enter credentials', expectedResult: 'Successfully signed in, redirected to dashboard', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },

  // PC DESKTOP TESTS - Assessment (BIN-PC-011 to BIN-PC-020)
  { id: 'BIN-PC-011', category: 'Assessment', testStep: 'Start assessment', action: 'Click "Start Assessment" on assessment page', expectedResult: 'Multi-step assessment wizard loads with progress bar', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-012', category: 'Assessment', testStep: 'Complete step 1', action: 'Answer all questions in step 1', expectedResult: 'Progress bar shows 1/5 complete, Next enabled', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-013', category: 'Assessment', testStep: 'Navigate back', action: 'Click "Previous" button', expectedResult: 'Returns to previous step, answers preserved', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-014', category: 'Assessment', testStep: 'Complete step 2', action: 'Answer lifestyle questions', expectedResult: 'Progress updates to 2/5', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-015', category: 'Assessment', testStep: 'Complete step 3', action: 'Answer cognitive function questions', expectedResult: 'Progress updates to 3/5', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-016', category: 'Assessment', testStep: 'Complete step 4', action: 'Answer support needs questions', expectedResult: 'Progress updates to 4/5', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-017', category: 'Assessment', testStep: 'Complete step 5', action: 'Answer final questions and submit', expectedResult: 'Assessment complete, results screen shown', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-018', category: 'Assessment', testStep: 'View assessment results', action: 'Observe results page', expectedResult: 'Personalized recommendations displayed based on answers', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-019', category: 'Assessment', testStep: 'Save assessment results', action: 'Click "Save Results" or continue', expectedResult: 'Results saved to database, can be viewed later', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-020', category: 'Assessment', testStep: 'Navigate to dashboard', action: 'Click "Go to Dashboard"', expectedResult: 'Redirected to main dashboard with personalized content', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },

  // PC DESKTOP TESTS - Dashboard (BIN-PC-021 to BIN-PC-030)
  { id: 'BIN-PC-021', category: 'Dashboard', testStep: 'View dashboard layout', action: 'Observe dashboard page', expectedResult: 'Dashboard shows welcome message, quick actions, and widgets', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-022', category: 'Dashboard', testStep: 'Check daily actions widget', action: 'View daily actions section', expectedResult: 'Today\'s actions listed with completion status', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-023', category: 'Dashboard', testStep: 'Check calendar widget', action: 'View calendar mini-view', expectedResult: 'Current date highlighted, upcoming events visible', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-024', category: 'Dashboard', testStep: 'Check support circle widget', action: 'View support circle preview', expectedResult: 'Support circle members shown with status indicators', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-025', category: 'Dashboard', testStep: 'Quick action - Memory Bridge', action: 'Click Memory Bridge quick action', expectedResult: 'Navigates to Memory Bridge recording interface', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-026', category: 'Dashboard', testStep: 'Navigation menu', action: 'Click hamburger menu or sidebar', expectedResult: 'Full navigation menu expands with all sections', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-027', category: 'Dashboard', testStep: 'Navigate to Calendar', action: 'Click "Calendar" in navigation', expectedResult: 'Calendar page loads with monthly view', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-028', category: 'Dashboard', testStep: 'Navigate to Brain Games', action: 'Click "Brain Games" in navigation', expectedResult: 'Brain Games page loads with available games', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-029', category: 'Dashboard', testStep: 'Navigate to Gratitude', action: 'Click "Gratitude" in navigation', expectedResult: 'Gratitude journal page loads', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-030', category: 'Dashboard', testStep: 'Navigate to Profile', action: 'Click "Profile" in navigation', expectedResult: 'Profile page loads with user information', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },

  // PC DESKTOP TESTS - Memory Bridge (BIN-PC-031 to BIN-PC-045)
  { id: 'BIN-PC-031', category: 'Memory Bridge', testStep: 'Access Memory Bridge', action: 'Navigate to /launch/memory-bridge', expectedResult: 'Recording interface loads with microphone prompt', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-032', category: 'Memory Bridge', testStep: 'Grant microphone permission', action: 'Click "Allow" on browser permission prompt', expectedResult: 'Permission granted, mic indicator becomes active', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-033', category: 'Memory Bridge', testStep: 'Start recording', action: 'Click "Start Recording" button', expectedResult: 'Recording starts, timer visible, waveform animating', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-034', category: 'Memory Bridge', testStep: 'Pause recording', action: 'Click "Pause" during recording', expectedResult: 'Recording paused, timer stops, can resume', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-035', category: 'Memory Bridge', testStep: 'Resume recording', action: 'Click "Resume" after pause', expectedResult: 'Recording continues from pause point', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-036', category: 'Memory Bridge', testStep: 'Stop recording', action: 'Click "Stop" after 30+ seconds', expectedResult: 'Recording stops, processing begins', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-037', category: 'Memory Bridge', testStep: 'AI processing indicator', action: 'Observe during processing', expectedResult: 'Loading/processing animation shown', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-038', category: 'Memory Bridge', testStep: 'View extracted actions', action: 'Wait for processing to complete', expectedResult: 'Actions extracted from speech displayed in list', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-039', category: 'Memory Bridge', testStep: 'Edit extracted action', action: 'Click edit icon on an action', expectedResult: 'Action becomes editable, can modify text', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-040', category: 'Memory Bridge', testStep: 'Delete extracted action', action: 'Click delete icon on an action', expectedResult: 'Action removed from list', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-041', category: 'Memory Bridge', testStep: 'Confirm action', action: 'Click confirm/checkmark on action', expectedResult: 'Action marked as confirmed, added to tasks', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-042', category: 'Memory Bridge', testStep: 'Schedule action', action: 'Click schedule icon, select date/time', expectedResult: 'Date picker opens, action scheduled to calendar', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-043', category: 'Memory Bridge', testStep: 'View recording history', action: 'Scroll to previous recordings section', expectedResult: 'List of past recordings with dates shown', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-044', category: 'Memory Bridge', testStep: 'Playback past recording', action: 'Click play on a past recording', expectedResult: 'Audio playback starts', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-045', category: 'Memory Bridge', testStep: 'Save recording session', action: 'Click "Save" or "Done"', expectedResult: 'Recording and actions saved to database', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },

  // PC DESKTOP TESTS - Support Circle (BIN-PC-046 to BIN-PC-058)
  { id: 'BIN-PC-046', category: 'Support Circle', testStep: 'Access Support Circle', action: 'Navigate to /launch/support', expectedResult: 'Support Circle page loads with member list', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-047', category: 'Support Circle', testStep: 'View existing members', action: 'Observe member list', expectedResult: 'All support circle members displayed with roles', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-048', category: 'Support Circle', testStep: 'Click Add Member', action: 'Click "Add Member" button', expectedResult: 'Add member form or modal opens', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-049', category: 'Support Circle', testStep: 'Enter member name', action: 'Type name in name field', expectedResult: 'Name accepted, field validated', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-050', category: 'Support Circle', testStep: 'Enter member email', action: 'Type email in email field', expectedResult: 'Email validated with proper format', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-051', category: 'Support Circle', testStep: 'Select relationship type', action: 'Choose from relationship dropdown', expectedResult: 'Options: Family, Friend, Caregiver, Medical, Other', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-052', category: 'Support Circle', testStep: 'Set permissions', action: 'Toggle permission checkboxes', expectedResult: 'Can set: View calendar, Send reminders, View progress', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-053', category: 'Support Circle', testStep: 'Send invitation', action: 'Click "Send Invitation"', expectedResult: 'Invitation sent, member added with "Pending" status', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-054', category: 'Support Circle', testStep: 'Verify pending status', action: 'Check member card', expectedResult: 'Shows "Pending" badge until invitation accepted', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-055', category: 'Support Circle', testStep: 'Edit member', action: 'Click edit on existing member', expectedResult: 'Edit form opens with current details', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-056', category: 'Support Circle', testStep: 'Update permissions', action: 'Change permission settings and save', expectedResult: 'Permissions updated, toast confirmation shown', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-057', category: 'Support Circle', testStep: 'Remove member', action: 'Click remove/delete on member', expectedResult: 'Confirmation dialog, then member removed', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-058', category: 'Support Circle', testStep: 'Resend invitation', action: 'Click resend on pending member', expectedResult: 'New invitation email sent', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },

  // PC DESKTOP TESTS - Calendar (BIN-PC-059 to BIN-PC-068)
  { id: 'BIN-PC-059', category: 'Calendar', testStep: 'Access Calendar', action: 'Navigate to /launch/calendar', expectedResult: 'Calendar page loads with monthly view', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-060', category: 'Calendar', testStep: 'View current month', action: 'Observe calendar', expectedResult: 'Current month displayed, today highlighted', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-061', category: 'Calendar', testStep: 'Navigate to next month', action: 'Click next month arrow', expectedResult: 'Next month displayed', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-062', category: 'Calendar', testStep: 'Navigate to previous month', action: 'Click previous month arrow', expectedResult: 'Previous month displayed', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-063', category: 'Calendar', testStep: 'Add new event', action: 'Click on a date or "Add Event"', expectedResult: 'Event creation form opens', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-064', category: 'Calendar', testStep: 'Fill event details', action: 'Enter title, time, description', expectedResult: 'All fields accept input correctly', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-065', category: 'Calendar', testStep: 'Save event', action: 'Click "Save" on event form', expectedResult: 'Event saved, visible on calendar date', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-066', category: 'Calendar', testStep: 'View event details', action: 'Click on saved event', expectedResult: 'Event details popup/modal opens', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-067', category: 'Calendar', testStep: 'Edit event', action: 'Click edit on event details', expectedResult: 'Edit form opens with current details', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-068', category: 'Calendar', testStep: 'Delete event', action: 'Click delete on event', expectedResult: 'Confirmation shown, event removed from calendar', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },

  // PC DESKTOP TESTS - Brain Games & Gratitude (BIN-PC-069 to BIN-PC-076)
  { id: 'BIN-PC-069', category: 'Brain Games', testStep: 'Access Brain Games', action: 'Navigate to /launch/brain-games', expectedResult: 'Brain Games page loads with game options', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-070', category: 'Brain Games', testStep: 'View available games', action: 'Observe game list', expectedResult: 'Multiple cognitive games displayed with descriptions', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-071', category: 'Brain Games', testStep: 'Start a game', action: 'Click on a game card', expectedResult: 'Game loads and starts', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-072', category: 'Brain Games', testStep: 'Complete game', action: 'Play through game to completion', expectedResult: 'Score displayed, progress saved', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-073', category: 'Gratitude', testStep: 'Access Gratitude Journal', action: 'Navigate to /launch/gratitude', expectedResult: 'Gratitude journal page loads', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-074', category: 'Gratitude', testStep: 'Add gratitude entry', action: 'Type in gratitude text field', expectedResult: 'Text entered, save button enabled', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-075', category: 'Gratitude', testStep: 'Save gratitude entry', action: 'Click save/submit', expectedResult: 'Entry saved, confirmation shown', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-PC-076', category: 'Gratitude', testStep: 'View past entries', action: 'Scroll to history section', expectedResult: 'Previous gratitude entries listed by date', actualResult: '', status: 'Not Run', device: 'PC', tester: '', dateTested: '', notes: '' },

  // SMARTPHONE TESTS (BIN-MOB-001 to BIN-MOB-015)
  { id: 'BIN-MOB-001', category: 'Mobile Navigation', testStep: 'Open on smartphone', action: 'Load /launch on mobile browser', expectedResult: 'Mobile-responsive layout, hamburger menu visible', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-002', category: 'Mobile Navigation', testStep: 'Open navigation menu', action: 'Tap hamburger menu icon', expectedResult: 'Navigation drawer slides in from side', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-003', category: 'Mobile Navigation', testStep: 'Close navigation menu', action: 'Tap outside menu or X button', expectedResult: 'Menu closes smoothly', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-004', category: 'Mobile Navigation', testStep: 'Bottom navigation bar', action: 'Observe bottom of screen', expectedResult: 'Bottom nav with Home, Calendar, Record, Profile icons', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-005', category: 'Mobile Recording', testStep: 'Access Memory Bridge mobile', action: 'Tap Record in bottom nav', expectedResult: 'Recording interface loads, optimized for mobile', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-006', category: 'Mobile Recording', testStep: 'Start mobile recording', action: 'Tap large record button', expectedResult: 'Recording starts, timer visible, haptic feedback', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-007', category: 'Mobile Recording', testStep: 'Stop mobile recording', action: 'Tap stop button', expectedResult: 'Recording stops, processing begins', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-008', category: 'Mobile Calendar', testStep: 'View calendar on mobile', action: 'Navigate to calendar', expectedResult: 'Mobile-optimized calendar view, scrollable', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-009', category: 'Mobile Calendar', testStep: 'Swipe calendar navigation', action: 'Swipe left/right on calendar', expectedResult: 'Navigate between months with swipe gesture', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-010', category: 'Mobile Forms', testStep: 'Mobile form input', action: 'Tap on input fields', expectedResult: 'Mobile keyboard appears, field focused', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-011', category: 'Mobile Forms', testStep: 'Mobile dropdown/select', action: 'Tap on dropdown field', expectedResult: 'Native mobile picker or custom dropdown appears', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-012', category: 'Mobile Support Circle', testStep: 'View Support Circle mobile', action: 'Navigate to Support Circle', expectedResult: 'Member cards stack vertically, touch-friendly', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-013', category: 'Mobile Support Circle', testStep: 'Add member mobile', action: 'Tap Add Member, fill form', expectedResult: 'Form works correctly with mobile keyboard', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-014', category: 'Mobile Orientation', testStep: 'Portrait mode', action: 'Hold phone vertically', expectedResult: 'Layout optimized for portrait', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-MOB-015', category: 'Mobile Orientation', testStep: 'Landscape mode', action: 'Rotate phone horizontally', expectedResult: 'Layout adapts to landscape, no overflow', actualResult: '', status: 'Not Run', device: 'Phone', tester: '', dateTested: '', notes: '' },

  // TABLET/IPAD TESTS (BIN-TAB-001 to BIN-TAB-010)
  { id: 'BIN-TAB-001', category: 'Tablet Layout', testStep: 'Open on iPad/tablet', action: 'Load /launch on tablet browser', expectedResult: 'Tablet-optimized layout, larger touch targets', actualResult: '', status: 'Not Run', device: 'Tablet', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-TAB-002', category: 'Tablet Layout', testStep: 'View dashboard tablet', action: 'Navigate to dashboard', expectedResult: 'Two-column or grid layout for widgets', actualResult: '', status: 'Not Run', device: 'Tablet', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-TAB-003', category: 'Tablet Navigation', testStep: 'Navigation style', action: 'Observe navigation', expectedResult: 'Sidebar or top nav visible (not hamburger only)', actualResult: '', status: 'Not Run', device: 'Tablet', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-TAB-004', category: 'Tablet Calendar', testStep: 'Calendar on tablet', action: 'Navigate to calendar', expectedResult: 'Full monthly view, events clearly visible', actualResult: '', status: 'Not Run', device: 'Tablet', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-TAB-005', category: 'Tablet Recording', testStep: 'Memory Bridge tablet', action: 'Access recording interface', expectedResult: 'Larger waveform, touch-friendly controls', actualResult: '', status: 'Not Run', device: 'Tablet', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-TAB-006', category: 'Tablet Support Circle', testStep: 'Support Circle tablet', action: 'View Support Circle', expectedResult: 'Grid layout for members, not single column', actualResult: '', status: 'Not Run', device: 'Tablet', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-TAB-007', category: 'Tablet Orientation', testStep: 'Tablet portrait', action: 'Hold tablet vertically', expectedResult: 'Layout adjusts, no horizontal scroll', actualResult: '', status: 'Not Run', device: 'Tablet', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-TAB-008', category: 'Tablet Orientation', testStep: 'Tablet landscape', action: 'Hold tablet horizontally', expectedResult: 'Uses full width, sidebar may appear', actualResult: '', status: 'Not Run', device: 'Tablet', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-TAB-009', category: 'Tablet Forms', testStep: 'Form input tablet', action: 'Fill out forms on tablet', expectedResult: 'Virtual keyboard or external keyboard works', actualResult: '', status: 'Not Run', device: 'Tablet', tester: '', dateTested: '', notes: '' },
  { id: 'BIN-TAB-010', category: 'Tablet Touch', testStep: 'Multi-touch gestures', action: 'Pinch to zoom on calendar', expectedResult: 'Zoom gesture works if implemented', actualResult: '', status: 'Not Run', device: 'Tablet', tester: '', dateTested: '', notes: '' },
];

const statusColors = {
  'Not Run': 'bg-muted text-muted-foreground',
  'Passed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'Blocked': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

const statusIcons = {
  'Not Run': Clock,
  'Passed': CheckCircle2,
  'Failed': XCircle,
  'Blocked': AlertCircle,
};

export function BrainInjuryNavigatorTestScript() {
  const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases);
  const [globalTester, setGlobalTester] = useState('');
  const [globalDate, setGlobalDate] = useState(new Date().toISOString().split('T')[0]);

  const updateTestCase = (id: string, field: keyof TestCase, value: string) => {
    setTestCases(prev => prev.map(tc => 
      tc.id === id ? { ...tc, [field]: value } : tc
    ));
  };

  const applyGlobalTesterDate = () => {
    setTestCases(prev => prev.map(tc => ({
      ...tc,
      tester: globalTester || tc.tester,
      dateTested: globalDate || tc.dateTested,
    })));
    toast.success('Applied tester name and date to all test cases');
  };

  const stats = useMemo(() => {
    const total = testCases.length;
    const passed = testCases.filter(tc => tc.status === 'Passed').length;
    const failed = testCases.filter(tc => tc.status === 'Failed').length;
    const blocked = testCases.filter(tc => tc.status === 'Blocked').length;
    const notRun = testCases.filter(tc => tc.status === 'Not Run').length;
    const passRate = total > 0 ? ((passed / (total - notRun)) * 100) || 0 : 0;
    return { total, passed, failed, blocked, notRun, passRate };
  }, [testCases]);

  const deviceStats = useMemo(() => ({
    PC: testCases.filter(tc => tc.device === 'PC'),
    Phone: testCases.filter(tc => tc.device === 'Phone'),
    Tablet: testCases.filter(tc => tc.device === 'Tablet'),
  }), [testCases]);

  const exportToCSV = () => {
    const headers = ['Test ID', 'Category', 'Test Step', 'Action', 'Expected Result', 'Actual Result', 'Status', 'Device', 'Tester', 'Date Tested', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...testCases.map(tc => [
        tc.id,
        `"${tc.category}"`,
        `"${tc.testStep}"`,
        `"${tc.action}"`,
        `"${tc.expectedResult}"`,
        `"${tc.actualResult}"`,
        tc.status,
        tc.device,
        `"${tc.tester}"`,
        tc.dateTested,
        `"${tc.notes}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `BrainInjuryNavigator_TestScript_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Test script exported to CSV!');
  };

  const renderTestTable = (cases: TestCase[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="border p-2 text-left font-medium">Test ID</th>
            <th className="border p-2 text-left font-medium">Category</th>
            <th className="border p-2 text-left font-medium">Test Step</th>
            <th className="border p-2 text-left font-medium">Action</th>
            <th className="border p-2 text-left font-medium min-w-[200px]">Expected Result</th>
            <th className="border p-2 text-left font-medium min-w-[150px]">Actual Result</th>
            <th className="border p-2 text-left font-medium">Status</th>
            <th className="border p-2 text-left font-medium">Tester</th>
            <th className="border p-2 text-left font-medium">Date</th>
            <th className="border p-2 text-left font-medium min-w-[120px]">Notes</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((tc) => {
            const StatusIcon = statusIcons[tc.status];
            return (
              <tr key={tc.id} className="hover:bg-muted/50">
                <td className="border p-2 font-mono text-xs">{tc.id}</td>
                <td className="border p-2">
                  <Badge variant="outline" className="text-xs">{tc.category}</Badge>
                </td>
                <td className="border p-2">{tc.testStep}</td>
                <td className="border p-2 text-muted-foreground">{tc.action}</td>
                <td className="border p-2 text-xs">{tc.expectedResult}</td>
                <td className="border p-2">
                  <Input
                    value={tc.actualResult}
                    onChange={(e) => updateTestCase(tc.id, 'actualResult', e.target.value)}
                    placeholder="Enter actual result..."
                    className="h-8 text-xs"
                  />
                </td>
                <td className="border p-2">
                  <Select
                    value={tc.status}
                    onValueChange={(value) => updateTestCase(tc.id, 'status', value)}
                  >
                    <SelectTrigger className={`h-8 w-28 text-xs ${statusColors[tc.status]}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Run">Not Run</SelectItem>
                      <SelectItem value="Passed">Passed</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="border p-2">
                  <Input
                    value={tc.tester}
                    onChange={(e) => updateTestCase(tc.id, 'tester', e.target.value)}
                    placeholder="Name"
                    className="h-8 w-24 text-xs"
                  />
                </td>
                <td className="border p-2">
                  <Input
                    type="date"
                    value={tc.dateTested}
                    onChange={(e) => updateTestCase(tc.id, 'dateTested', e.target.value)}
                    className="h-8 w-32 text-xs"
                  />
                </td>
                <td className="border p-2">
                  <Input
                    value={tc.notes}
                    onChange={(e) => updateTestCase(tc.id, 'notes', e.target.value)}
                    placeholder="Bug ID..."
                    className="h-8 text-xs"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Brain Injury Navigator Test Script</h1>
          <p className="text-muted-foreground">Complete test cases for PC, Smartphone, and Tablet</p>
        </div>
        <Button onClick={exportToCSV} className="gap-2">
          <Download className="w-4 h-4" />
          Export to CSV (Google Sheets)
        </Button>
      </div>

      {/* Summary Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Test Summary Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Tests</div>
            </div>
            <div className="text-center p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.passed}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Passed</div>
            </div>
            <div className="text-center p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.failed}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Failed</div>
            </div>
            <div className="text-center p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.blocked}</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400">Blocked</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{stats.notRun}</div>
              <div className="text-xs text-muted-foreground">Not Run</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.passRate.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Pass Rate</div>
            </div>
          </div>

          {/* Global Tester/Date */}
          <div className="flex flex-wrap items-end gap-4 pt-4 border-t">
            <div>
              <label className="text-xs text-muted-foreground">Global Tester Name</label>
              <Input
                value={globalTester}
                onChange={(e) => setGlobalTester(e.target.value)}
                placeholder="Enter tester name..."
                className="w-48"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Global Test Date</label>
              <Input
                type="date"
                value={globalDate}
                onChange={(e) => setGlobalDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button variant="outline" onClick={applyGlobalTesterDate}>
              Apply to All Tests
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Device Tabs */}
      <Tabs defaultValue="pc" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pc" className="gap-2">
            <Monitor className="w-4 h-4" />
            PC ({deviceStats.PC.length})
          </TabsTrigger>
          <TabsTrigger value="phone" className="gap-2">
            <Smartphone className="w-4 h-4" />
            Smartphone ({deviceStats.Phone.length})
          </TabsTrigger>
          <TabsTrigger value="tablet" className="gap-2">
            <Tablet className="w-4 h-4" />
            Tablet ({deviceStats.Tablet.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pc" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                PC Desktop Tests ({deviceStats.PC.length} cases)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTestTable(deviceStats.PC)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phone" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Smartphone Tests ({deviceStats.Phone.length} cases)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTestTable(deviceStats.Phone)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tablet" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tablet className="w-5 h-5" />
                Tablet/iPad Tests ({deviceStats.Tablet.length} cases)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTestTable(deviceStats.Tablet)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
