/**
 * ============================================================
 * DWO VOICE — BAKERY DEPARTMENT DATA MODULE (v2)
 * Rebuilt from on-screen content — Compliance + Staffing
 * ============================================================
 *
 * SOURCE OF TRUTH: Screenshot of Insights panel, Bakery
 * One real-time compliance alert, Saturday 8am–4pm shift:
 *
 *   Card: "Employee missed meal break window"
 *         Maria Garcia — passed meal break window, never clocked out
 *         Tags: Meal break · Bakery
 *         Time: 11:05am — Expires: 11:35am (30 min to act)
 *         Body: "Maria Garcia has passed their required meal break window
 *                without clocking out for a break. A waiver or immediate
 *                break is required to stay compliant."
 *         Employee: Maria: Saturday 8a–4p Bakery / Baker
 *         Actions: Accept · Dismiss
 *
 * TWO COMPLIANCE PATHS:
 *   Accept  → Process a meal period waiver. Premium pay is issued
 *              automatically. The violation is recorded.
 *   Dismiss → You are disputing the alert, or you are sending
 *              Maria on an immediate break right now. If she
 *              takes a break before the legal deadline (1:00pm),
 *              no violation is recorded. If not, it auto-logs.
 *
 * DESIGN PRINCIPLE — PROGRESSIVE DISCLOSURE:
 *   Level 1 — What's happening right now
 *   Level 2 — Has this happened before (history)
 *   Level 3 — The pattern (when, why, how often)
 *   Level 4 — Policy (what the law says, what waiver means)
 *   Level 5 — Action (what Accept and Dismiss each do)
 *   Level 6 — Risk (what happens if alert expires without action)
 *
 * HOW TO IMPORT:
 *   import { data, voiceQueries, matchVoiceQuery }
 *     from './dwo-voice-data.js'
 *
 * ============================================================
 */

// ─────────────────────────────────────────────────────────────
// LIVE INSIGHT CARD
// Mirrors exactly what is shown on screen
// ─────────────────────────────────────────────────────────────

export const data = {

  meta: {
    department: "Bakery",
    currentShift: "Saturday 8:00am – 4:00pm",
    alertTime: "11:05am",
    expiresAt: "11:35am",
    expiresInMinutes: 30,
    legalBreakDeadline: "1:00pm",
    legalBreakDeadlineNote: "5 hours from 8:00am clock-in. Maria must begin her break before 1:00pm to stay legally compliant."
  },

  // ── THE ON-SCREEN CARD ───────────────────────────────────────

  insightCards: [
    {
      id: "card_maria_missed_break",
      title: "Employee missed meal break window",
      tags: ["Meal break", "Bakery"],
      time: "11:05am",
      expires: "11:35am",
      expiresInMinutes: 30,
      urgency: "high",
      body: "Maria Garcia has passed their required meal break window without clocking out for a break. A waiver or immediate break is required to stay compliant.",
      employeeName: "Maria Garcia",
      employeeLabel: "Maria: Saturday 8a–4p Bakery / Baker",
      shift: "Saturday 8:00am – 4:00pm",
      role: "Baker",
      department: "Bakery",
      actions: ["accept", "dismiss"],
      secondaryActions: ["edit"],
      currentStatus: "Passed scheduled meal break window without clocking out",
      twoCompliancePaths: {
        accept: "Process a meal period waiver. Premium pay is issued automatically. Violation is recorded on Maria's compliance record.",
        dismiss: "You are either sending Maria on an immediate break right now, or disputing that the violation occurred. If Maria takes her break before 1:00pm today, no formal violation is recorded. If she does not, the violation auto-logs at the legal deadline."
      }
    }
  ],

  // ── EMPLOYEE ─────────────────────────────────────────────────

  employees: [
    {
      id: "emp_maria_garcia",
      name: "Maria Garcia",
      role: "Baker",
      department: "Bakery",
      type: "Full-Time",
      shift: "Saturday 8:00am – 4:00pm",
      scheduledBreakTime: "11:00am",
      legalBreakDeadline: "1:00pm",
      hourlyRate: 18.50,
      tenure: "1 year 9 months",
      isMinor: false,
      avatar: "MG",
      currentIssueCardId: "card_maria_missed_break",

      history: {
        missedMealBreakWindow30Days: 4,
        missedMealBreakWindow60Days: 7,
        missedMealBreakWindow90Days: 9,
        trend: "worsening",
        lastViolationDate: "2026-03-22",
        priorAcceptances: 3,
        priorDismissals: 0,
        priorFormalActions: 0,

        pattern: "All violations occur on morning shifts (8am–4pm), specifically during the 10:30am–11:30am window. That window coincides with the bread oven's first pull cycle — Maria monitors the oven during that time and delays her break to avoid leaving the oven unattended. There is no designated relief baker to cover oven duties during her break.",

        commonDays: ["Saturday", "Tuesday", "Wednesday"],
        commonWindowStart: "10:30am",
        commonWindowEnd: "11:30am",
        rootCause: "The bread oven first-pull cycle runs from approximately 10:45am to 11:15am on morning shifts. Maria is the only baker on duty certified for oven monitoring at that time. She delays her break rather than leave the oven unattended. No relief coverage is assigned.",
        averageMinutesPastWindow: 42
      },

      complianceScore: 61,
      attendanceScore: 79,
      attritionRisk: "medium",
      attritionProbability: "29%",
      managerNotes: "Strong baker, reliable on quality and oven operations. Break adherence is the only compliance concern. Has not been formally coached.",

      financialImpact: {
        premiumPayPerViolation: 18.50,
        violations30Days: 4,
        cost30Days: 74.00,
        projectedAnnualCost: 888.00
      }
    },

    {
      id: "emp_james_okafor",
      name: "James Okafor",
      role: "Bakery Lead",
      department: "Bakery",
      type: "Full-Time",
      shift: "Saturday 8:00am – 4:00pm",
      hourlyRate: 22.75,
      tenure: "5 years 1 month",
      isMinor: false,
      avatar: "JO",
      certifications: ["Oven Operations", "Lead Certified", "Allergen Awareness"],
      attendanceScore: 91,
      complianceScore: 88,
      attritionRisk: "low",
      attritionProbability: "8%",
      currentWeekHours: 35,
      saturdayScheduledHours: 8,
      saturdayProjectedTotal: 43,
      overtimeThreshold: 40,
      overtimeProjected: 3,
      notes: "James is the only other oven-certified baker on today's shift. He is qualified to relieve Maria during her break — but is not currently scheduled to do so."
    },

    {
      id: "emp_priya_nair",
      name: "Priya Nair",
      role: "Baker",
      department: "Bakery",
      type: "Full-Time",
      shift: "Saturday 8:00am – 1:00pm",
      hourlyRate: 17.25,
      tenure: "1 year 2 months",
      isMinor: false,
      avatar: "PN",
      certifications: ["Food Handler"],
      attendanceScore: 85,
      complianceScore: 83,
      attritionRisk: "low",
      currentWeekHours: 28,
      saturdayScheduledHours: 5,
      saturdayProjectedTotal: 33,
      notes: "Priya is on shift until 1:00pm today. She is not oven-certified — cannot relieve Maria for oven monitoring duties. Available for other coverage tasks."
    },

    {
      id: "emp_kenji_tanaka",
      name: "Kenji Tanaka",
      role: "Baker",
      department: "Bakery",
      type: "Full-Time",
      shift: "Saturday 12:00pm – 8:00pm",
      hourlyRate: 19.00,
      tenure: "3 years 7 months",
      isMinor: false,
      avatar: "KT",
      certifications: ["Food Handler", "Allergen Awareness"],
      attendanceScore: 88,
      complianceScore: 81,
      attritionRisk: "low",
      currentWeekHours: 32,
      notes: "Kenji starts at noon today. Not yet on shift at 11:05am. Could come in early if authorized."
    },

    {
      id: "emp_sofia_reyes",
      name: "Sofia Reyes",
      role: "Bakery Supervisor",
      department: "Bakery",
      type: "Full-Time",
      shift: "Saturday 7:00am – 3:00pm",
      hourlyRate: 28.00,
      tenure: "6 years 5 months",
      isMinor: false,
      avatar: "SR",
      certifications: ["Oven Operations", "Lead Certified", "Allergen Awareness", "Supervisor"],
      attendanceScore: 96,
      complianceScore: 94,
      attritionRisk: "low",
      notes: "Sofia is on shift and oven-certified. She is the most direct option to relieve Maria for a break right now. She is aware of Maria's pattern — has not yet initiated formal coaching."
    }
  ],

  // ── POLICIES ─────────────────────────────────────────────────

  policies: {

    meal_break_ca: {
      id: "meal_break_ca",
      name: "Meal Break Policy — California",
      legalBasis: "CA Labor Code §512 and §226.7",
      plain: "Any employee working more than 5 hours must receive a 30-minute unpaid meal break. The break must BEGIN before the end of the 5th hour of work — calculated from actual clock-in time.",
      forMariaToday: "Maria clocked in at 8:00am. Her legal break deadline is 1:00pm (end of hour 5). The system flagged her at 11:05am because she passed her scheduled break window (11:00am) without clocking out. She still has time to take an immediate break before the 1:00pm legal cutoff.",

      waiver: {
        whatItIs: "A meal period waiver is a formal acknowledgement that the employee did not receive a compliant meal break. The employer pays the employee one additional hour of pay at their regular rate as a 'meal period premium.' This satisfies the legal obligation and closes the violation.",
        whenToUse: "Use a waiver when: the employee has already passed the window and cannot take a break at this point, OR when both the employee and employer agree the break was not feasible and premium pay is the resolution.",
        doesNotEraseViolation: "Accepting a waiver records the violation on the compliance log. The premium pay compensates the employee, but the incident remains in the record.",
        cannotBeForced: "An employee cannot be forced to waive their meal break. The waiver must be voluntary. If the employee wants their break, they must be given one."
      },

      immediateBreak: {
        whatItMeans: "If Maria takes her break now — before 1:00pm — she is technically compliant with the legal window even though she passed the scheduled window. The alert can be dismissed if you are actively sending her on break.",
        requirement: "She must clock out for the break, take a full 30 minutes away from duties, and clock back in. Partial breaks do not satisfy the requirement."
      },

      acceptAction: "Accepting processes the meal period waiver. Maria's timecard is flagged for premium pay — 1 hour at her regular rate ($18.50) — issued in the next payroll cycle. The violation is recorded on her compliance record. The alert is resolved.",

      dismissAction: "Dismissing closes the alert without processing a waiver. Use this ONLY if you are sending Maria on break immediately right now. If she takes a compliant break before 1:00pm, no formal violation is recorded. If she does not take a break and the legal deadline passes, the violation auto-logs and premium pay is still owed — but you won't receive another alert.",

      penalty: "1 additional hour of pay at the employee's regular rate — per missed or late meal period.",
      legalDeadlineForMaria: "1:00pm today (5 hours from her 8:00am clock-in)",
      alertExpiresAt: "11:35am — 30 minutes from the alert time",

      riskOfInaction: "If the alert expires at 11:35am without Accept or Dismiss, the system does not auto-resolve. The violation window remains open until 1:00pm. If Maria has not taken a break by 1:00pm, the violation is automatically logged and premium pay is owed regardless. Not acting on the alert doesn't prevent the violation — it just removes the manager's opportunity to choose the resolution path.",

      bestPractice: "If Maria can take her break right now: Dismiss the alert and send her immediately. If the oven cycle makes an immediate break impossible: Accept the waiver, pay the premium, and fix the coverage problem so this doesn't repeat."
    }
  },

  // ── INSIGHTS (progressive disclosure layers) ─────────────────

  insights: {

    maria: {
      level1: "Maria Garcia has passed her scheduled meal break window without clocking out for a break. She's on the Saturday 8am–4pm baker shift. A waiver or immediate break is required. The alert expires at 11:35am — you have 30 minutes to choose a path.",

      level2_context: "This is not her first time. Maria has missed her meal break window 4 times in the last 30 days and 7 times in the past 60 days. She has 3 accepted waivers on record from prior incidents this period.",

      level3_pattern: "All 4 violations in the past 30 days occurred on morning shifts — Saturday, Tuesday, and Wednesday — between 10:30am and 11:30am. That's when the bread oven's first pull cycle runs. Maria stays at the oven rather than leave it unattended. No one is scheduled to relieve her. She is the only oven-certified baker on duty at that time.",

      level4_policy_waiver: "A meal period waiver formally acknowledges the break was missed. The store pays Maria 1 additional hour at her regular rate — $18.50 — in the next payroll cycle. This satisfies the legal obligation. The violation is still recorded on her compliance log.",

      level4_policy_immediate_break: "Her legal break deadline is 1:00pm today — 5 hours from her 8:00am clock-in. If she takes a full 30-minute break before 1:00pm, she is legally compliant even though she passed her scheduled window. Dismissing the alert is the right move if you're sending her now.",

      level5_action_accept: "Tap Accept to process the waiver. $18.50 premium pay is flagged in payroll. The alert resolves. Maria stays on the oven. You'll need to address the coverage issue to prevent the next violation.",

      level5_action_dismiss: "Tap Dismiss if you are sending Maria on her break right now. Tell Sofia Reyes or James Okafor to cover the oven while Maria is on break — both are oven-certified and on shift. Maria must clock out, take 30 full minutes, and clock back in before 1:00pm.",

      level6_risk: "If the alert expires at 11:35am and Maria hasn't taken a break or had a waiver accepted, the violation window stays open until the 1:00pm legal deadline. After 1:00pm, the violation auto-logs and premium pay is owed regardless. A pattern of 4 violations in 30 days — with 3 already accepted — is approaching the threshold where a wage claim becomes a realistic risk. Each ignored violation also strengthens any future claim.",

      financialSummary: {
        premiumPayIfAccepted: 18.50,
        violations30Days: 4,
        cost30Days: 74.00,
        projectedAnnualCost: 888.00,
        costOfDoingNothing: "Same $18.50 owed — plus legal exposure increases with each unresolved incident."
      },

      recommendations: [
        {
          rank: 1,
          action: "Dismiss and send Maria on break immediately",
          urgency: "now",
          rationale: "Ask Sofia Reyes to cover the oven — she's on shift, oven-certified, and available. Maria clocks out now, takes 30 minutes, back by 11:35am–11:45am. No violation recorded.",
          condition: "Best option if Sofia or James can cover the oven right now."
        },
        {
          rank: 2,
          action: "Accept the waiver if oven coverage is not possible",
          urgency: "now",
          rationale: "If neither Sofia nor James can take over the oven at this moment, accepting the waiver closes the alert compliantly. $18.50 premium pay is issued. The violation is recorded.",
          condition: "Use this if an immediate break isn't operationally feasible."
        },
        {
          rank: 3,
          action: "Schedule a coaching conversation with Maria after the shift",
          urgency: "today",
          rationale: "4 violations in 30 days needs to be formally documented. Coaching protects both parties — it shows the employer is addressing the pattern, and it gives Maria clarity on expectations."
        },
        {
          rank: 4,
          action: "Add a formal oven relief rotation to the Saturday morning schedule",
          urgency: "this week",
          rationale: "The root cause is structural — Maria has no one to hand off to. Designating Sofia or James as her break relief on the schedule eliminates the conflict entirely. This is the only action that breaks the pattern."
        }
      ]
    }
  },

  // ── STAFFING INTELLIGENCE ─────────────────────────────────────
  // Context: If Maria accepts a waiver, she stays on oven — no coverage gap.
  // If Maria takes an immediate break, the oven needs 30-min coverage now.
  // Saturday 8a–4p shift. James and Sofia are both oven-certified and on shift.

  staffing: {

    currentShift: {
      date: "Saturday, April 5, 2026",
      shift: "8:00am – 4:00pm",
      department: "Bakery",
      currentTime: "11:05am",
      hoursRemaining: 4.9,
      currentHeadcount: 3,
      onShiftNow: ["emp_sofia_reyes", "emp_james_okafor", "emp_priya_nair"],
      arrivingLater: ["emp_kenji_tanaka"],
      coverageStatus: "Adequate overall — gap only if Maria takes immediate break",
      ovenCoverageGap: {
        exists: true,
        reason: "If Maria goes on break now, no one is designated to monitor the oven. Sofia and James are both certified — neither is scheduled for oven relief.",
        duration: "30 minutes (Maria's break window)",
        impact: "Oven unmonitored during first pull cycle if no action taken"
      }
    },

    immediateBreakCoverage: {
      context: "If manager selects Dismiss and sends Maria on break now, oven coverage is needed for 30 minutes (approx 11:05am–11:35am).",
      options: [
        {
          id: "coverage_sofia",
          employeeId: "emp_sofia_reyes",
          name: "Sofia Reyes",
          role: "Bakery Supervisor",
          recommendation: "Best option",
          rationale: "Sofia is oven-certified, on shift, and available. As supervisor she has the authority and skill to take over immediately. No schedule change needed — she simply covers the station while Maria is on break.",
          action: "Ask Sofia to cover the oven from 11:05am to 11:35am.",
          cost: 0,
          overtimeRisk: "None"
        },
        {
          id: "coverage_james",
          employeeId: "emp_james_okafor",
          name: "James Okafor",
          role: "Bakery Lead",
          recommendation: "Good backup",
          rationale: "James is oven-certified and on shift. He can cover while Maria is on break. He is currently at 35 weekly hours — a 30-minute coverage task does not affect overtime.",
          action: "Ask James to monitor the oven from 11:05am to 11:35am.",
          cost: 0,
          overtimeRisk: "None for 30 minutes"
        }
      ]
    },

    saturdayShiftAdjustments: [
      {
        id: "adj_james_overtime",
        employeeId: "emp_james_okafor",
        employeeName: "James Okafor",
        type: "shift_shortening",
        action: "Shorten James Okafor's Saturday shift by 3 hours to prevent overtime",
        currentShift: "8:00am – 7:00pm (11 hrs)",
        adjustedShift: "8:00am – 4:00pm (8 hrs)",
        hoursRemoved: 3,
        weeklyHoursBefore: 43,
        weeklyHoursAfter: 40,
        overtimePrevented: 3,
        overtimeCostSaved: 102.38,
        rationale: "James has 35 hours Mon–Fri this week. His full Saturday shift puts him at 43 hours — 3 hours of overtime at $34.13/hr. Capping at 4pm keeps him at exactly 40 hours. His most critical coverage — oven monitoring during the morning rush — is already covered by his current on-shift hours.",
        tradeoff: "James is no longer available for evening oven monitoring. Kenji Tanaka arrives at noon and can cover the afternoon.",
        employeeImpact: "James loses 3 hours of income. Offer voluntary OT next week if James wants to make it up."
      },
      {
        id: "adj_kenji_early",
        employeeId: "emp_kenji_tanaka",
        employeeName: "Kenji Tanaka",
        type: "early_start",
        action: "Bring Kenji Tanaka in 2 hours early to fill afternoon coverage",
        currentShift: "12:00pm – 8:00pm (8 hrs)",
        adjustedShift: "10:00am – 8:00pm (10 hrs)",
        hoursAdded: 2,
        weeklyHoursBefore: 32,
        weeklyHoursAfter: 34,
        additionalCost: 38.00,
        overtimeRisk: "None — stays under 40 hours",
        rationale: "If James's shift is shortened to 4pm, a 2-hour gap opens in the 10am–12pm window. Kenji arriving at 10am instead of noon fills that gap. Kenji is not oven-certified, so he covers non-oven duties while Maria or Sofia handles the oven.",
        tradeoff: "Adds $38 in labor cost. Kenji is not oven-certified — doesn't directly solve the oven relief problem but covers general bakery tasks.",
        employeeImpact: "Kenji gains 2 hours of income — typically well received."
      },
      {
        id: "adj_priya_extension",
        employeeId: "emp_priya_nair",
        employeeName: "Priya Nair",
        type: "shift_extension",
        action: "Extend Priya Nair's shift by 1 hour to cover afternoon bagging and packaging",
        currentShift: "8:00am – 1:00pm (5 hrs)",
        adjustedShift: "8:00am – 2:00pm (6 hrs)",
        hoursAdded: 1,
        weeklyHoursBefore: 33,
        weeklyHoursAfter: 34,
        additionalCost: 17.25,
        overtimeRisk: "None",
        rationale: "Priya's 1pm exit leaves a packaging gap in the early afternoon. Adding 1 hour keeps non-oven bakery tasks covered and reduces pressure on Sofia and James during the 1pm–2pm handoff period.",
        tradeoff: "Priya is not oven-certified — this covers packaging and prep only.",
        employeeImpact: "Gains 1 hour of regular pay."
      }
    ],

    netResult: {
      overtimePrevented: 3,
      overtimeCostSaved: 102.38,
      additionalLaborCost: 55.25,
      netSavings: 47.13,
      coverageGapsClosed: true,
      summary: "Shortening James's shift prevents $102 in overtime. Bringing Kenji in early and extending Priya covers the resulting gaps for $55. Net saving: $47. All shifts remain staffed through the end of the day."
    },

    ovenCertificationGap: {
      issue: "Only Maria Garcia, James Okafor, and Sofia Reyes are oven-certified on today's shift. Kenji and Priya are not.",
      risk: "If Maria is unavailable (break, illness, early departure) and Sofia is otherwise engaged, only James can step in. No depth beyond that.",
      recommendation: "Certify Kenji Tanaka for oven operations. He has the tenure (3+ years) and aptitude. This creates the redundancy needed to give Maria a compliant break without operational risk."
    }
  }
};

// ─────────────────────────────────────────────────────────────
// VOICE QUERY LIBRARY — BAKERY
// 27 queries across 6 disclosure levels.
// Each answers ONE question at the right depth.
// ─────────────────────────────────────────────────────────────

export const voiceQueries = [

  // ─── OVERVIEW ─────────────────────────────────────────────

  {
    id: "bk_001",
    session: "Compliance",
    level: 1,
    phrases: [
      "show me bakery issues",
      "bakery compliance",
      "what's happening in bakery",
      "show me all issues in bakery",
      "bakery alerts"
    ],
    filterTarget: { department: "Bakery" },
    responseType: "card_list",
    ccpPattern: "CCP",
    response: "Looking at Bakery. There's 1 active alert — Maria Garcia has passed her meal break window without clocking out. She's on the Saturday 8am–4pm baker shift. The alert expires at 11:35am, giving you 30 minutes to act. Want me to pull up the details?"
  },

  // ─── MARIA — LEVEL 1 (What's happening) ──────────────────

  {
    id: "bk_002",
    session: "Compliance",
    level: 1,
    phrases: [
      "what's the issue with maria",
      "tell me about maria",
      "maria garcia",
      "maria meal break",
      "show me maria"
    ],
    filterTarget: { employeeId: "emp_maria_garcia" },
    responseType: "card_detail",
    ccpPattern: "CCP",
    response: "Here's Maria's situation. She passed her scheduled meal break window without clocking out — she's been on shift since 8am. You need to either send her on break now or accept a waiver. Alert expires at 11:35am. Want to know if this has happened before, or jump straight to your options?"
  },

  // ─── MARIA — LEVEL 2 (History) ────────────────────────────

  {
    id: "bk_003",
    session: "Compliance",
    level: 2,
    phrases: [
      "is this the first time for maria",
      "has maria done this before",
      "maria history",
      "how often does maria miss her break",
      "maria's break record"
    ],
    filterTarget: { employeeId: "emp_maria_garcia" },
    responseType: "history",
    ccpPattern: "CCP",
    response: "Checking Maria's history. This is her 4th missed meal break window in 30 days and 7th in 60 days — she has 3 accepted waivers already on record from this period. The trend is worsening. Want to see the pattern behind why this keeps happening?"
  },

  // ─── MARIA — LEVEL 3 (Pattern) ────────────────────────────

  {
    id: "bk_004",
    session: "Compliance",
    level: 3,
    phrases: [
      "why does maria keep missing her break",
      "what's causing maria's violations",
      "maria pattern",
      "why is maria always missing her break",
      "what's the pattern with maria"
    ],
    filterTarget: { employeeId: "emp_maria_garcia" },
    responseType: "pattern_insight",
    ccpPattern: "CCP",
    response: "Here's the pattern. All 4 violations happened between 10:30am and 11:30am on morning shifts — when the bread oven's first pull cycle runs. Maria stays at the oven rather than leave it unattended, and she's the only oven-certified baker on duty at that time. No one is scheduled to relieve her. Want to know what your options are right now, or hear what the policy says?"
  },

  // ─── MARIA — LEVEL 4 (Policy — what is a waiver) ─────────

  {
    id: "bk_005",
    session: "Compliance",
    level: 4,
    phrases: [
      "what is a waiver",
      "what does a waiver mean",
      "explain the meal break waiver",
      "what's a meal period waiver"
    ],
    responseType: "policy_detail",
    ccpPattern: "CCP",
    response: "Here's what a meal period waiver means. The store formally acknowledges that Maria's break was missed and pays her 1 additional hour at her regular rate — $18.50 in her next paycheck. The legal obligation is met, but the violation stays on her compliance log. A waiver can't be forced — it has to be voluntary. Want to know when to use a waiver versus sending her on break now?"
  },

  {
    id: "bk_006",
    session: "Compliance",
    level: 4,
    phrases: [
      "what does the meal break policy say",
      "california meal break law",
      "what are the rules for meal breaks",
      "meal break policy"
    ],
    responseType: "policy_detail",
    ccpPattern: "CCP",
    response: "Here's what the policy says. California law requires a 30-minute break before the end of hour 5 — calculated from actual clock-in. Maria clocked in at 8am, so her legal deadline is 1:00pm today. The alert fired at 11:05am because she passed her scheduled window. She still has time for an immediate break if you act now. Want to know what Accept and Dismiss each do?"
  },

  {
    id: "bk_007",
    session: "Compliance",
    level: 4,
    phrases: [
      "what are maria's two options",
      "what are my two options",
      "waiver or break",
      "what does immediate break mean"
    ],
    responseType: "explanation",
    ccpPattern: "CCP",
    response: "Two paths available. One — send Maria on break right now. If she takes a full 30 minutes before 1:00pm, she's legally compliant with no violation recorded. Two — accept a waiver. She stays on the oven, you pay $18.50 premium pay, and the violation is logged. The break option is better for her record; the waiver is better if the oven can't be left. Is oven coverage available right now?"
  },

  // ─── MARIA — LEVEL 5 (Actions — Accept and Dismiss) ──────

  {
    id: "bk_008",
    session: "Compliance",
    level: 5,
    phrases: [
      "what does accepting do",
      "what happens if i accept",
      "accept maria's violation",
      "what does accept mean for maria"
    ],
    responseType: "action_explanation",
    ccpPattern: "CCP+ConfirmGate",
    response: "Here's what accepting does. It processes the meal period waiver — $18.50 premium pay is added to Maria's next paycheck automatically, the alert resolves, and the violation is recorded on her compliance log. Maria stays on the oven. Shall I go ahead and accept?"
  },

  {
    id: "bk_009",
    session: "Compliance",
    level: 5,
    phrases: [
      "what does dismissing do",
      "what happens if i dismiss",
      "dismiss maria's alert",
      "what does dismiss mean for maria",
      "should i dismiss"
    ],
    responseType: "action_explanation",
    ccpPattern: "CCP+ConfirmGate",
    response: "Here's what dismissing does. It closes the alert without a waiver — you're committing to send Maria on break right now. She must clock out, take a full 30 minutes, and return before 1:00pm. If she does, no violation is recorded. If she doesn't, the violation auto-logs at 1:00pm and premium pay is still owed — with no second alert. Ready to dismiss and send her now?"
  },

  {
    id: "bk_010",
    session: "Compliance",
    level: 5,
    phrases: [
      "what should i do about maria",
      "recommended action for maria",
      "how do i handle maria's alert",
      "what's the best action for maria"
    ],
    filterTarget: { employeeId: "emp_maria_garcia" },
    responseType: "recommendation",
    ccpPattern: "CCP+ConfirmGate",
    response: "Here's the recommended action. If Sofia or James can cover the oven right now — dismiss and send Maria on break immediately. She needs to be back before 1:00pm. If oven coverage isn't available — accept the waiver. Either way, after the shift, set up a break relief rotation so this stops repeating. Can Sofia or James cover the oven right now?"
  },

  // ─── MARIA — LEVEL 6 (Risk) ───────────────────────────────

  {
    id: "bk_011",
    session: "Compliance",
    level: 6,
    phrases: [
      "what happens if i don't act",
      "what if the alert expires",
      "risk of ignoring maria's alert",
      "what if i do nothing"
    ],
    responseType: "risk",
    ccpPattern: "CCP",
    response: "Here's the risk of not acting. The alert expires at 11:35am, but the violation window stays open until 1:00pm. If Maria hasn't taken a break by then, the violation auto-logs and premium pay is owed regardless — and you won't get another alert. With 4 violations in 30 days, the pattern also increases wage claim exposure. Want to accept the waiver now, or send Maria on break?"
  },

  {
    id: "bk_012",
    session: "Compliance",
    level: 6,
    phrases: [
      "how much is this costing",
      "what is the financial impact",
      "maria compliance cost",
      "how much are maria's violations costing"
    ],
    responseType: "financial_summary",
    ccpPattern: "CCP",
    response: "Here's the cost picture. Maria's 4 violations this month total $74 in premium pay. At this rate, that's $888 projected for the year — direct cost only, not including any wage claim exposure. Want to see what the long-term fix looks like?"
  },

  // ─── COVERAGE — WHO CAN COVER OVEN ────────────────────────

  {
    id: "bk_013",
    session: "Compliance",
    level: 5,
    phrases: [
      "who can cover the oven",
      "who covers the oven while maria is on break",
      "oven coverage",
      "who is oven certified today"
    ],
    responseType: "skill_coverage",
    ccpPattern: "CCP+ConfirmGate",
    response: "Checking oven-certified staff on shift right now. Two options: Sofia Reyes is the best — she's oven-certified, on shift as supervisor, and available. James Okafor is the backup. Either can cover while Maria takes her 30-minute break. Want to dismiss the alert and send Maria now?"
  },

  {
    id: "bk_014",
    session: "Compliance",
    level: 3,
    phrases: [
      "why is there no oven coverage",
      "why isn't someone covering for maria",
      "why does maria have no relief"
    ],
    responseType: "root_cause",
    ccpPattern: "CCP",
    response: "Here's why there's no coverage assigned. The Saturday morning schedule doesn't designate a break relief for the oven station. Both Sofia and James are certified and on shift — they could cover — but neither is scheduled to. Maria defaults to staying rather than leaving the oven unattended. This is a scheduling gap, not a conduct issue. Want to see what a permanent fix would look like?"
  },

  // ─── STAFFING INTELLIGENCE ────────────────────────────────

  {
    id: "bk_015",
    session: "Staffing Intelligence",
    level: 1,
    phrases: [
      "how is bakery staffed today",
      "bakery saturday coverage",
      "who is on shift in bakery",
      "bakery staffing"
    ],
    responseType: "coverage_dashboard",
    ccpPattern: "CCP",
    response: "Here's today's Bakery coverage. Three bakers are on shift now — Maria, James, and Priya — plus Sofia as supervisor. Kenji starts at noon. Coverage is adequate overall, but James is projected to hit overtime if his full shift runs and only three people are oven-certified. Want to see the recommended schedule adjustments?"
  },

  {
    id: "bk_016",
    session: "Staffing Intelligence",
    level: 2,
    phrases: [
      "what adjustments do you recommend",
      "bakery staffing adjustments",
      "how do i optimize today's schedule"
    ],
    responseType: "recommendation",
    ccpPattern: "CCP+ConfirmGate",
    response: "Here are the three recommended adjustments. Shorten James's shift by 3 hours to prevent overtime — saves $102. Bring Kenji in 2 hours early to cover the resulting gap. Extend Priya by 1 hour to cover the 1pm handoff. Net saving: $47. Want me to apply these to the schedule?"
  },

  {
    id: "bk_017",
    session: "Staffing Intelligence",
    level: 3,
    phrases: [
      "why shorten james",
      "james overtime",
      "james okafor shift"
    ],
    filterTarget: { employeeId: "emp_james_okafor" },
    responseType: "explanation",
    ccpPattern: "CCP",
    response: "Here's why James's shift needs shortening. He has 35 hours Mon–Fri and an 11-hour Saturday scheduled — 43 hours total, with 3 hours of overtime at $34.13/hr. Capping him at 4pm keeps him at exactly 40 hours and saves $102. His critical morning oven coverage is already complete by then. Want to see how the gap gets covered?"
  },

  {
    id: "bk_018",
    session: "Staffing Intelligence",
    level: 3,
    phrases: [
      "why bring kenji in early",
      "kenji early start",
      "kenji coverage"
    ],
    filterTarget: { employeeId: "emp_kenji_tanaka" },
    responseType: "explanation",
    ccpPattern: "CCP",
    response: "Here's the reason for Kenji's early start. If James exits at 4pm, a gap opens from 10am to noon. Kenji arriving at 10am instead of noon fills that gap for $38. He's not oven-certified, so he covers prep and packaging — freeing Maria and Sofia for oven duties. Want to see how Priya's extension completes the plan?"
  },

  {
    id: "bk_019",
    session: "Staffing Intelligence",
    level: 3,
    phrases: [
      "why extend priya",
      "priya nair shift",
      "priya coverage"
    ],
    filterTarget: { employeeId: "emp_priya_nair" },
    responseType: "explanation",
    ccpPattern: "CCP",
    response: "Here's why Priya gets an extra hour. Her 1pm exit creates a packaging gap in early afternoon. Adding 1 hour for $17.25 keeps non-oven tasks covered through the 1pm–2pm handoff while Kenji and the afternoon crew settle in. Want to see the total cost and savings for all three changes?"
  },

  {
    id: "bk_020",
    session: "Staffing Intelligence",
    level: 4,
    phrases: [
      "what do these adjustments save",
      "net savings",
      "cost of bakery adjustments",
      "total savings today"
    ],
    responseType: "financial_summary",
    ccpPattern: "CCP+ConfirmGate",
    response: "Here's the full picture. Shortening James prevents $102 in overtime. Kenji's early start and Priya's extension add $55. Net saving: $47 — all shifts covered through end of day with no overtime. Want me to apply these changes to the schedule?"
  },

  {
    id: "bk_021",
    session: "Staffing Intelligence",
    level: 3,
    phrases: [
      "oven certification gap",
      "who is oven certified",
      "oven skill gap",
      "oven coverage risk"
    ],
    responseType: "skill_gap_analysis",
    ccpPattern: "CCP",
    response: "Here's the oven certification picture. Only three people today are certified: Maria, James, and Sofia. Kenji and Priya are not. If Maria is on break and Sofia is occupied, only James can step in — no backup beyond that. Certifying Kenji is the highest-leverage long-term fix. Want to know how to set that up?"
  },

  {
    id: "bk_022",
    session: "Staffing Intelligence",
    level: 2,
    phrases: [
      "what happens to coverage if maria takes her break now",
      "coverage if maria goes on break",
      "oven coverage during maria's break"
    ],
    responseType: "coverage_gap",
    ccpPattern: "CCP+ConfirmGate",
    response: "If Maria goes on break now, the oven needs 30 minutes of coverage. Sofia Reyes is the best option — certified, available, and on shift as supervisor. James Okafor is the backup. Want to dismiss the alert and send Maria now with Sofia covering?"
  },

  {
    id: "bk_023",
    session: "Staffing Intelligence",
    level: 2,
    phrases: [
      "who might leave bakery",
      "bakery attrition",
      "attrition risk bakery"
    ],
    responseType: "attrition_forecast",
    ccpPattern: "CCP",
    response: "Checking Bakery attrition risk. No high-risk employees right now. Maria is at medium risk — 29% — mainly because unresolved compliance violations could lead to corrective action. Fixing the scheduling coverage issue is the most effective retention action for her. All others are low risk. Want to see what the long-term scheduling fix looks like?"
  },

  {
    id: "bk_024",
    session: "Staffing Intelligence",
    level: 3,
    phrases: [
      "how do i fix maria's break problem long term",
      "long term fix for maria",
      "how do i prevent this from recurring",
      "what's the permanent fix"
    ],
    responseType: "recommendation",
    ccpPattern: "CCP+ConfirmGate",
    response: "Here's the long-term fix. Two structural changes: add a formal oven relief rotation to Saturday morning schedules — designate Sofia or James to cover during Maria's break window. And certify Kenji Tanaka for oven operations to build permanent redundancy. Once Kenji is certified, there's always a backup available. Want me to flag Kenji for oven certification in the system?"
  },

  {
    id: "bk_025",
    session: "Compliance",
    level: 5,
    phrases: [
      "what do i do after resolving this",
      "next steps after maria's alert",
      "follow up actions for maria"
    ],
    responseType: "follow_up",
    ccpPattern: "CCP",
    response: "Here are the follow-up steps. Three things after resolving today: have a coaching conversation with Maria — 4 violations in 30 days needs documentation. Add a break relief rotation to Saturday morning schedules. And flag Kenji Tanaka for oven certification training. Want me to create a task for any of these?"
  }
];

// ─────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Match a voice transcript to a Bakery query.
 * @param {string} transcript
 * @returns {object|null}
 */
export function matchVoiceQuery(transcript) {
  const normalized = transcript.toLowerCase().trim();
  return voiceQueries.find(q =>
    q.phrases.some(phrase => normalized.includes(phrase))
  ) || null;
}

/**
 * Get an employee record by ID.
 * @param {string} id
 * @returns {object|null}
 */
export function getEmployeeById(id) {
  return data.employees.find(e => e.id === id) || null;
}

/**
 * Get the active insight card.
 * @param {string} cardId
 * @returns {object|null}
 */
export function getCard(cardId) {
  return data.insightCards.find(c => c.id === cardId) || null;
}

/**
 * Get pending insight cards only.
 * @returns {array}
 */
export function getPendingCards() {
  return data.insightCards.filter(c => !c.resolved);
}

/**
 * Resolve a dot-notation path against the data object.
 * @param {string} keyPath - e.g. "insights.maria.level3_pattern"
 * @returns {any}
 */
export function resolveDetail(keyPath) {
  return keyPath.split(".").reduce((obj, key) => obj?.[key], data) ?? null;
}
