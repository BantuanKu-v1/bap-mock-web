-- Seed only JKM eligibility criteria; retain existing program and application records.
-- Rules are preliminary guidance, not official verification or approval.
-- Missing inputs and unresolved thresholdRef values must evaluate as UNKNOWN.
-- Evaluate ruleMatched dependencies after referenced rules; do not infer no-match from UNKNOWN.
-- Age for BWE uses year of birth per the supplied specification.

-- BWE: 3 documented rules
update jkm_programs
set eligibility_criteria = '{
  "schemaVersion": 1,
  "programCode": "BWE",
  "source": "BantuanKu V1.0 program specification",
  "scope": "preliminary_guidance_only",
  "thresholdNotes": "Hardcore Poor PGK references: RM1,236 household or RM348 per capita (2026 BantuanKu reference).",
  "rules": [
    {
      "ruleCode": "BWE-001",
      "name": "Standard Eligibility",
      "conditions": {
        "all": [
          {"field": "applicant.citizenship", "operator": "eq", "value": "Malaysian"},
          {"field": "applicant.residenceCountry", "operator": "eq", "value": "Malaysia"},
          {"field": "applicant.ageByBirthYear", "operator": "gte", "value": 60},
          {
            "any": [
              {"field": "household.monthlyIncome", "operator": "lte", "value": 1236},
              {"field": "household.monthlyPerCapitaIncome", "operator": "lte", "value": 348}
            ]
          },
          {"field": "applicant.residesInExcludedInstitution", "operator": "eq", "value": false}
        ]
      },
      "result": "preliminary_match",
      "assessmentNotes": "JKM investigation and means-tested assessment remain required."
    },
    {
      "ruleCode": "BWE-002",
      "name": "Elderly Without Children Special Consideration",
      "conditions": {
        "all": [
          {"field": "applicant.citizenship", "operator": "eq", "value": "Malaysian"},
          {"field": "applicant.residenceCountry", "operator": "eq", "value": "Malaysia"},
          {"field": "applicant.ageByBirthYear", "operator": "gte", "value": 60},
          {"field": "applicant.hasChildren", "operator": "eq", "value": false},
          {"field": "applicant.dependsOnFamilyOrCaregiver", "operator": "eq", "value": true},
          {"field": "applicant.familyOrCaregiverIncomeExceedsApplicablePGK", "operator": "eq", "value": true},
          {"field": "applicant.residesInExcludedInstitution", "operator": "eq", "value": false}
        ]
      },
      "result": "further_assessment_required",
      "assessmentNotes": "Special consideration by JKM; PGK assessment must be verified."
    },
    {
      "ruleCode": "BWE-003",
      "name": "No Preliminary Match",
      "conditions": {
        "not": {
          "any": [
            {"ruleMatched": "BWE-001"},
            {"ruleMatched": "BWE-002"}
          ]
        }
      },
      "result": "no_preliminary_match"
    }
  ]
}',
    eligibility_version = 1,
    updated_at = current_timestamp
where code = 'BWE';


-- BA: 3 documented rules
update jkm_programs
set eligibility_criteria = '{
  "schemaVersion": 1,
  "programCode": "BA",
  "source": "BantuanKu V1.0 program specification",
  "scope": "preliminary_guidance_only",
  "thresholdNotes": "Hardcore Poor PGK references: RM1,236 household or RM348 per capita (2026 BantuanKu reference).",
  "rules": [
    {
      "ruleCode": "BA-001",
      "name": "Preliminary Eligibility",
      "conditions": {
        "all": [
          {"field": "applicant.citizenship", "operator": "eq", "value": "Malaysian"},
          {"field": "applicant.residenceState", "operator": "in", "value": ["Kuala Lumpur", "Putrajaya", "Labuan"]},
          {
            "any": [
              {"field": "household.monthlyIncome", "operator": "lte", "value": 1236},
              {"field": "household.monthlyPerCapitaIncome", "operator": "lte", "value": 348}
            ]
          },
          {"field": "applicant.receivesOtherJKMMonthlyAssistance", "operator": "eq", "value": false}
        ]
      },
      "result": "preliminary_match",
      "assessmentNotes": "JKM must verify financial need and existing assistance."
    },
    {
      "ruleCode": "BA-002",
      "name": "Further Assessment Required",
      "conditions": {
        "all": [
          {"ruleMatched": "BA-001"},
          {"field": "assessment.baAdditionalCircumstancesRequireReview", "operator": "eq", "value": true}
        ]
      },
      "result": "further_assessment_required",
      "assessmentNotes": "Economic, health, dependant or other circumstances assessed by JKM."
    },
    {
      "ruleCode": "BA-003",
      "name": "No Preliminary Match",
      "conditions": {
        "not": {"ruleMatched": "BA-001"}
      },
      "result": "no_preliminary_match"
    }
  ]
}',
    eligibility_version = 1,
    updated_at = current_timestamp
where code = 'BA';


-- BAT: 5 documented rules
update jkm_programs
set eligibility_criteria = '{
  "schemaVersion": 1,
  "programCode": "BAT",
  "source": "BantuanKu V1.0 program specification",
  "scope": "preliminary_guidance_only",
  "thresholdNotes": "Poor PGK thresholds differ from Hardcore Poor PGK and are not numerically specified in the supplied BAT document. Unresolved threshold references must yield unknown, not false.",
  "rules": [
    {
      "ruleCode": "BAT-001",
      "name": "Preliminary Eligibility",
      "conditions": {
        "all": [
          {"field": "applicant.citizenship", "operator": "eq", "value": "Malaysian"},
          {"field": "applicant.residenceCountry", "operator": "eq", "value": "Malaysia"},
          {"field": "applicant.isJKMTargetGroup", "operator": "eq", "value": true},
          {
            "any": [
              {
                "field": "household.monthlyIncome",
                "operator": "lte",
                "value": {"thresholdRef": "BAT_POOR_HOUSEHOLD_PGK"}
              },
              {
                "field": "household.monthlyPerCapitaIncome",
                "operator": "lte",
                "value": {"thresholdRef": "BAT_POOR_PER_CAPITA_PGK"}
              }
            ]
          },
          {"field": "application.hasApplicableMedicalOrJKMRecommendation", "operator": "eq", "value": true}
        ]
      },
      "result": "preliminary_match",
      "assessmentNotes": "Resolve applicable Poor PGK thresholds before numeric evaluation; target group and recommendation require assessment."
    },
    {
      "ruleCode": "BAT-002",
      "name": "Further Assessment Required",
      "conditions": {
        "all": [
          {"ruleMatched": "BAT-001"},
          {"field": "assessment.batRecommendationOrEquipmentRequiresReview", "operator": "eq", "value": true}
        ]
      },
      "result": "further_assessment_required",
      "assessmentNotes": "JKM reviews recommendation, equipment suitability, cost and documents."
    },
    {
      "ruleCode": "BAT-003",
      "name": "Higher Approval Required",
      "conditions": {
        "all": [
          {"ruleMatched": "BAT-001"},
          {"field": "application.equipmentCost", "operator": "gt", "value": 10000},
          {"field": "application.equipmentCost", "operator": "lte", "value": 20000}
        ]
      },
      "result": "further_approval_required",
      "assessmentNotes": "Higher-level approval is required; not an eligibility approval."
    },
    {
      "ruleCode": "BAT-004",
      "name": "Special Consideration",
      "conditions": {
        "all": [
          {"not": {"ruleMatched": "BAT-001"}},
          {"field": "assessment.batSpecialConsiderationRequested", "operator": "eq", "value": true}
        ]
      },
      "result": "further_assessment_required",
      "assessmentNotes": "Only flags a case for KPKM consideration; does not decide whether it merits consideration."
    },
    {
      "ruleCode": "BAT-005",
      "name": "No Preliminary Match",
      "conditions": {
        "all": [
          {"not": {"ruleMatched": "BAT-001"}},
          {"not": {"ruleMatched": "BAT-004"}}
        ]
      },
      "result": "no_preliminary_match"
    }
  ]
}',
    eligibility_version = 1,
    updated_at = current_timestamp
where code = 'BAT';


-- BPT: 5 documented rules
update jkm_programs
set eligibility_criteria = '{
  "schemaVersion": 1,
  "programCode": "BPT",
  "source": "BantuanKu V1.0 program specification",
  "scope": "preliminary_guidance_only",
  "thresholdNotes": "Monthly household income maximum RM5,000; patient/caregiver category dependent.",
  "rules": [
    {
      "ruleCode": "BPT-001",
      "name": "Caregiver of Bedridden Patient",
      "conditions": {
        "all": [
          {"field": "applicant.citizenship", "operator": "eq", "value": "Malaysian"},
          {"field": "applicant.residenceCountry", "operator": "eq", "value": "Malaysia"},
          {"field": "applicant.isCaregiverOfPatient", "operator": "eq", "value": true},
          {"field": "patient.isBedridden", "operator": "eq", "value": true},
          {
            "any": [
              {"field": "patient.isOKU", "operator": "eq", "value": true},
              {"field": "patient.hasChronicIllness", "operator": "eq", "value": true}
            ]
          },
          {"field": "caregiver.providesIntensiveCare", "operator": "eq", "value": true},
          {"field": "household.monthlyIncome", "operator": "lte", "value": 5000}
        ]
      },
      "result": "preliminary_match",
      "assessmentNotes": "Caregiver and medical circumstances require JKM assessment."
    },
    {
      "ruleCode": "BPT-002",
      "name": "Non-Bedridden Chronic Patient",
      "conditions": {
        "all": [
          {"field": "applicant.citizenship", "operator": "eq", "value": "Malaysian"},
          {"field": "applicant.residenceCountry", "operator": "eq", "value": "Malaysia"},
          {"field": "applicant.isPatient", "operator": "eq", "value": true},
          {"field": "patient.isBedridden", "operator": "eq", "value": false},
          {"field": "patient.hasChronicIllness", "operator": "eq", "value": true},
          {"field": "patient.requiresContinuousTreatment", "operator": "eq", "value": true},
          {"field": "patient.continuousTreatmentMonths", "operator": "gte", "value": 3},
          {"field": "household.monthlyIncome", "operator": "lte", "value": 5000}
        ]
      },
      "result": "preliminary_match",
      "assessmentNotes": "Medical confirmation and duration require verification."
    },
    {
      "ruleCode": "BPT-003",
      "name": "Bedridden Patient Without Eligible Malaysian Caregiver",
      "conditions": {
        "all": [
          {"field": "patient.citizenship", "operator": "eq", "value": "Malaysian"},
          {"field": "patient.residenceCountry", "operator": "eq", "value": "Malaysia"},
          {"field": "patient.isBedridden", "operator": "eq", "value": true},
          {
            "any": [
              {"field": "patient.isOKU", "operator": "eq", "value": true},
              {"field": "patient.hasChronicIllness", "operator": "eq", "value": true}
            ]
          },
          {
            "any": [
              {"field": "patient.hasCaregiver", "operator": "eq", "value": false},
              {"field": "caregiver.citizenship", "operator": "neq", "value": "Malaysian"}
            ]
          },
          {"field": "household.monthlyIncome", "operator": "lte", "value": 5000}
        ]
      },
      "result": "preliminary_match",
      "assessmentNotes": "Potential match in patient''s own name; caregiver arrangement requires JKM assessment."
    },
    {
      "ruleCode": "BPT-004",
      "name": "Further Assessment Required",
      "conditions": {
        "all": [
          {
            "any": [
              {"ruleMatched": "BPT-001"},
              {"ruleMatched": "BPT-002"},
              {"ruleMatched": "BPT-003"}
            ]
          },
          {"field": "assessment.bptMedicalOrCaregiverReviewRequired", "operator": "eq", "value": true}
        ]
      },
      "result": "further_assessment_required",
      "assessmentNotes": "JKM reviews medical/caregiver evidence."
    },
    {
      "ruleCode": "BPT-005",
      "name": "No Preliminary Match",
      "conditions": {
        "not": {
          "any": [
            {"ruleMatched": "BPT-001"},
            {"ruleMatched": "BPT-002"},
            {"ruleMatched": "BPT-003"}
          ]
        }
      },
      "result": "no_preliminary_match"
    }
  ]
}',
    eligibility_version = 1,
    updated_at = current_timestamp
where code = 'BPT';
