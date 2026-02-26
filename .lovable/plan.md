

## Add References Slide (Slide 19) to Clinical Deck

### 1. Fix citation on Slide 12 (line 462)
Update the sources line to use correct journal attributions:
- `"Sources: Dewan et al., J Neurosurg 2019; GBD 2019 / Feigin et al., Lancet Neurology 2021; AARP/NAC 2020; Grand View Research 2023"`

### 2. Add Slide 19 — References (after Slide 18, before the renderer)
A clean, typeset bibliography slide with section label "References" and the following verified citations:

1. **Dewan MC et al.** "Estimating the global incidence of traumatic brain injury." *Journal of Neurosurgery*, 2019; 130(4): 1080–1097.
2. **Feigin VL et al.** "Global, regional, and national burden of stroke and its risk factors, 1990–2019: a systematic analysis for the Global Burden of Disease Study 2019." *Lancet Neurology*, 2021; 20(10): 795–820.
3. **World Stroke Organization.** Global Stroke Fact Sheet, 2022.
4. **AARP & National Alliance for Caregiving.** "Caregiving in the U.S." 2020.
5. **Grand View Research.** "Cognitive Assessment & Training in Healthcare Market Report." 2023.
6. **Rabinowitz AR, Levin HS.** "Cognitive Sequelae of Traumatic Brain Injury." *Psychiatr Clin North Am*, 2014; 37(1): 1–11.

### 3. Update slides array (line 728)
Append `Slide19` to the array.

### File changed
- `src/components/investor/InvestorSlides.tsx` — fix line 462, add Slide19 component, update slides array

