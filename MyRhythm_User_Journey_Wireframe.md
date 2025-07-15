
# MyRhythm User Journey Wireframe & Role-Based Features

## Overview
This document outlines the complete user journey for MyRhythm, including role-based access, subscription tiers, and feature availability across different user types.

---

## User Roles & Subscription Tiers

### 1. **Free User (Starter Plan)**
- **Monthly Cost:** Free (7-day trial of premium features)
- **Target Audience:** Individuals exploring cognitive wellness
- **Access Level:** Basic features with limitations

### 2. **Premium User (Pro Plan)**
- **Monthly Cost:** £9.99/month
- **Target Audience:** Committed individuals seeking comprehensive cognitive wellness
- **Access Level:** Full personal features with advanced analytics

### 3. **Care Team User (Care Team Plan)**
- **Monthly Cost:** £15.99/month
- **Target Audience:** Individuals with family/caregiver support needs
- **Access Level:** Premium features + family collaboration tools

### 4. **Medical Professional (Clinical Plan)**
- **Monthly Cost:** £99-£599/month (based on practice size)
- **Target Audience:** Healthcare providers, therapists, clinics
- **Access Level:** Clinical tools + patient management + reporting

---

## User Journey Flow

```
Landing Page → Registration/Login → Onboarding → Dashboard → Features
     ↓              ↓                  ↓           ↓         ↓
 Marketing    Authentication    Initial Setup   Hub Page   Tools
   Content      & Billing       & Assessment              & Activities
```

### **Phase 1: Discovery (Landing Page)**
**Route:** `/`
- **All Users:** Marketing content, pricing, founder story
- **Call to Action:** Register/Login buttons
- **Key Elements:**
  - Hero section with value proposition
  - Feature overview
  - Pricing tiers
  - Testimonials/social proof
  - Contact information

### **Phase 2: Authentication**
**Routes:** `/onboarding` (includes auth gate)
- **All Users:** Sign up/Login flow
- **Subscription Selection:** Choose plan during registration
- **Account Creation:** Email verification (disabled for immediate access)
- **Security:** Password requirements, optional MFA

### **Phase 3: Onboarding**
**Route:** `/onboarding` (post-authentication)
- **All Users:** Welcome flow and initial setup
- **Personalization:** Basic preferences and goals
- **Initial Assessment:** Cognitive baseline (varies by tier)
- **Tutorial:** Feature walkthrough based on subscription

### **Phase 4: Main Application**
**Route:** `/dashboard` (protected)
- **Hub:** Personalized dashboard based on user role
- **Navigation:** Sidebar with role-appropriate features
- **Quick Actions:** Most-used features prominently displayed

---

## Feature Access Matrix

| Feature Category | Free User | Premium User | Care Team | Medical Professional |
|------------------|-----------|--------------|-----------|---------------------|
| **Authentication & Profile** | ✅ | ✅ | ✅ | ✅ |
| **Dashboard** | Basic | Full | Full + Family | Clinical Dashboard |
| **Assessments** | 1 basic | Unlimited | Unlimited | Clinical-grade |
| **Calendar** | Basic | Full | Shared | Patient scheduling |
| **Gratitude Journal** | ✅ | ✅ | ✅ | ✅ |
| **Brain Games** | 2 games | All games | All games | Therapeutic games |
| **Mood Tracking** | Basic | Advanced | Family view | Clinical reporting |
| **Accountability** | Self only | ✅ | Family alerts | Clinical monitoring |
| **Community** | Read-only | Full access | Family groups | Professional network |
| **Notes** | Limited | Unlimited | Shared notes | Clinical notes |
| **Strategy Planning** | Templates | Custom | Family plans | Treatment plans |
| **Analytics** | Basic | Advanced | Family insights | Clinical reports |
| **Goals** | Personal | Advanced | Family goals | Treatment goals |
| **Testing** | ❌ | Beta features | Beta features | Clinical trials |

---

## Detailed User Journeys

### **Free User Journey**
1. **Landing Page** → Learn about MyRhythm
2. **Registration** → Create account (7-day premium trial)
3. **Onboarding** → Basic setup and intro assessment
4. **Dashboard** → Simple overview of available features
5. **Limited Usage** → Access 2 brain games, basic mood tracking
6. **Upgrade Prompts** → Gentle nudges toward premium features
7. **Trial Expiry** → Choice to upgrade or continue with free limitations

### **Premium User Journey**
1. **Landing Page** → Attracted by comprehensive features
2. **Registration** → Select Pro Plan (£9.99/month)
3. **Onboarding** → Full assessment and personalization
4. **Dashboard** → Rich, personalized experience
5. **Full Access** → All personal features unlocked
6. **Progress Tracking** → Advanced analytics and insights
7. **Community Engagement** → Full community participation
8. **Continuous Growth** → Regular feature updates and improvements

### **Care Team User Journey**
1. **Landing Page** → Focus on family/caregiver collaboration
2. **Registration** → Select Care Team Plan (£15.99/month)
3. **Onboarding** → Setup + invite family members
4. **Dashboard** → Family-centered view with shared insights
5. **Collaboration** → Shared goals, notes, and accountability
6. **Family Alerts** → Proactive notifications for care team
7. **Progress Sharing** → Regular updates to family members
8. **Support Network** → Enhanced community for families

### **Medical Professional Journey**
1. **Landing Page** → Clinical features and ROI focus
2. **Registration** → Select Clinical Plan (£99-£599/month)
3. **Onboarding** → Practice setup and compliance training
4. **Dashboard** → Clinical overview with patient management
5. **Patient Onboarding** → Add and manage patient accounts
6. **Clinical Tools** → Assessments, monitoring, reporting
7. **Practice Integration** → EMR connections and workflows
8. **Outcomes Tracking** → Evidence-based progress reporting

---

## Navigation Structure

### **Sidebar Navigation (Role-Based)**

#### **Free Users**
- Dashboard
- Assessment (limited)
- Calendar (basic)
- Gratitude
- Brain Games (2 games)
- Mood Tracking (basic)
- Profile
- *Upgrade prompts throughout*

#### **Premium Users**
- Dashboard
- Assessment
- Calendar
- Gratitude
- Brain Games
- Mood Tracking
- Accountability
- Community
- Notes
- Strategy
- Analytics
- Goals
- Profile

#### **Care Team Users**
- Dashboard (family view)
- Assessment
- Calendar (shared)
- Gratitude
- Brain Games
- Mood Tracking (family insights)
- Accountability (family alerts)
- Community (family groups)
- Notes (shared)
- Strategy (family plans)
- Analytics (family progress)
- Goals (family goals)
- Profile

#### **Medical Professionals**
- Clinical Dashboard
- Patient Management
- Clinical Assessments
- Appointment Calendar
- Progress Monitoring
- Clinical Notes
- Treatment Plans
- Outcomes Analytics
- Professional Community
- Practice Settings
- Compliance Reports

---

## Mobile Experience

### **Responsive Design Priorities**
1. **Mobile-First:** All features accessible on mobile
2. **Touch-Friendly:** Large buttons and easy navigation
3. **Offline Capability:** Core features work without internet
4. **Push Notifications:** Reminders and alerts
5. **Quick Actions:** Most common tasks easily accessible

### **Mobile-Specific Features**
- **Voice Notes:** Easy recording and transcription
- **Photo Journal:** Visual mood and progress tracking
- **GPS Integration:** Location-based reminders
- **Biometric Integration:** Heart rate, step counting
- **Emergency Contacts:** Quick access for care team users

---

## Success Metrics by Role

### **Free Users**
- **Engagement:** Daily app opens, feature usage
- **Conversion:** Trial-to-paid conversion rate
- **Retention:** 7-day, 30-day active users

### **Premium Users**
- **Engagement:** Feature usage depth, session duration
- **Progress:** Assessment score improvements
- **Satisfaction:** NPS scores, feature ratings
- **Retention:** Monthly churn rate

### **Care Team Users**
- **Collaboration:** Family member engagement
- **Communication:** Alert response rates
- **Outcomes:** Shared goal completion
- **Satisfaction:** Family satisfaction scores

### **Medical Professionals**
- **Patient Outcomes:** Clinical improvement metrics
- **Practice Efficiency:** Time savings, workflow improvements
- **ROI:** Revenue per patient, cost reductions
- **Compliance:** Regulatory adherence, documentation quality

---

## Technical Considerations

### **Authentication & Security**
- **Role-Based Access Control (RBAC):** Enforce feature permissions
- **Data Encryption:** All sensitive data encrypted at rest and in transit
- **Audit Trails:** Complete logging for clinical users
- **Compliance:** HIPAA, GDPR compliance for applicable users

### **Scalability**
- **Database Design:** Efficient queries for different user types
- **Caching Strategy:** Role-specific data caching
- **API Rate Limiting:** Fair usage policies by tier
- **Performance Monitoring:** Role-specific performance metrics

### **Integration Capabilities**
- **EMR Systems:** For medical professionals
- **Wearable Devices:** For all user types
- **Calendar Systems:** For scheduling and reminders
- **Communication Platforms:** For care team coordination

---

This wireframe provides a comprehensive overview of the MyRhythm user experience across all roles and subscription tiers, ensuring each user type receives appropriate value and functionality for their specific needs and investment level.
