
import { ResourceItem } from "@/components/resources/ResourceCard";

export const resourcesData: ResourceItem[] = [
  {
    id: "1",
    title: "Understanding Traumatic Brain Injury",
    description: "Comprehensive guide to understanding the effects and recovery process for TBI, including common symptoms, treatment options, and long-term outlook.",
    url: "https://www.braininjuryalliance.org/education",
    categories: ["Education", "TBI"],
    source: "Brain Injury Alliance of America",
    relevantFor: ["tbi", "caregiver"],
  },
  {
    id: "2",
    title: "Cognitive Rehabilitation Exercises",
    description: "Collection of evidence-based exercises to help improve memory, attention, and cognitive function after a brain injury.",
    url: "https://www.neuroskills.com/resources/",
    categories: ["Self-Help", "Rehabilitation", "TBI", "ABI"],
    source: "Centre for Neuro Skills",
    relevantFor: ["tbi", "abi", "caregiver"],
  },
  {
    id: "3",
    title: "Dallas Support Groups Directory",
    description: "Comprehensive list of support groups in Dallas for brain injury survivors, their families, and caregivers.",
    url: "https://www.braininjurytexas.org/support-groups",
    categories: ["Community", "Support", "Dallas"],
    source: "Brain Injury Association of Texas",
    relevantFor: ["tbi", "abi", "mental-health", "caregiver"],
  },
  {
    id: "4",
    title: "Managing Depression After Brain Injury",
    description: "Strategies and information about managing depression that commonly occurs after brain injuries.",
    url: "https://www.biausa.org/brain-injury/about-brain-injury/living-with-brain-injury/emotional-issues-after-brain-injury",
    categories: ["Mental Health", "TBI", "ABI"],
    source: "Brain Injury Association of America",
    relevantFor: ["tbi", "abi", "mental-health", "caregiver"],
  },
  {
    id: "5",
    title: "Caregiver's Guide to Brain Injuries",
    description: "Comprehensive resource for caregivers of individuals with brain injuries, covering daily care, emotional support, and self-care.",
    url: "https://www.caregiver.org/resource/caregiving-someone-traumatic-brain-injury/",
    categories: ["Caregivers", "Support"],
    source: "Family Caregiver Alliance",
    relevantFor: ["caregiver"],
  },
  {
    id: "6",
    title: "Schizophrenia: Understanding and Treatment",
    description: "Information about schizophrenia, including symptoms, diagnosis, treatment options, and strategies for daily living.",
    url: "https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Schizophrenia",
    categories: ["Mental Health", "Education"],
    source: "National Alliance on Mental Illness",
    relevantFor: ["mental-health", "caregiver"],
  },
  {
    id: "7",
    title: "Living with Bipolar Disorder",
    description: "Guide to understanding and managing bipolar disorder, including medication information, therapy options, and coping strategies.",
    url: "https://www.dbsalliance.org/education/bipolar-disorder/",
    categories: ["Mental Health", "Education"],
    source: "Depression and Bipolar Support Alliance",
    relevantFor: ["mental-health", "caregiver"],
  },
  {
    id: "8",
    title: "Stroke Recovery Guide",
    description: "Comprehensive information for stroke survivors and caregivers on the recovery journey, rehabilitation options, and adaptation strategies.",
    url: "https://www.stroke.org/en/help-and-support/for-family-caregivers",
    categories: ["ABI", "Rehabilitation"],
    source: "American Stroke Association",
    relevantFor: ["abi", "caregiver"],
  },
];

export const getResourcesByUserType = (userType: string | null) => {
  if (!userType) return resourcesData;
  return resourcesData.filter(resource => resource.relevantFor.includes(userType));
};

export const getResourcesByCategory = (category: string | null) => {
  if (!category) return resourcesData;
  return resourcesData.filter(resource => resource.categories.includes(category));
};
