/**
 * ============================================================
 * DWO VOICE — FRONTEND DEPARTMENT DATA MODULE (v2)
 * Rebuilt from on-screen content — Compliance + Staffing
 * ============================================================
 *
 * SOURCE OF TRUTH: Screenshot of Insights panel, Frontend (3)
 * Three real-time compliance alerts, Saturday 7am–3pm shift:
 *
 *   Card 1: "Late for meal break"
 *           Eliza Thompson — 15m late for meal break, send now
 *           Tags: Meal break · Frontend
 *           Expires: 11:08am | Action: Acknowledge
 *
 *   Card 2: "Scheduled break is no longer compliant"
 *           Tom Jones — started shift 5 min early, break window shifted
 *           Tags: Meal break · Frontend
 *           Expires: 11:22am | Actions: Accept · Dismiss
 *
 *   Card 3: "Minor working beyond legal hours"
 *           Sam Adams (minor) — working past permitted hours
 *           Tags: Minor · Frontend
 *           Expires: 11:28am | Action: Acknowledge
 *
 * All three: Saturday 7a–3p · Frontend / Bagger
 *
 * DESIGN PRINCIPLE — PROGRESSIVE DISCLOSURE:
 *   Every voice query answers ONE question at the right depth.
 *   The manager hears a summary first. They dig deeper by asking.
 *   Do NOT surface all levels in one response.
 *
 *   Level 1 — What's happening right now (the card)
 *   Level 2 — Context and history (has this happened before?)
 *   Level 3 — Pattern (when, why, how often)
 *   Level 4 — Policy (what the rules say, legal consequences)
 *   Level 5 — Action (what to do, what each button does)
 *   Level 6 — Risk (what happens if you don't act)
 *
 * HOW TO IMPORT:
 *   import { frontendData, frontendVoiceQueries, matchFrontendQuery }
 *     from './dwo-voice-data-frontend.js'
 *
 * ============================================================
 */

// ─────────────────────────────────────────────────────────────
// LIVE INSIGHT CARDS
// These mirror exactly what is shown on screen
// ─────────────────────────────────────────────────────────────

export const frontendData = {

  meta: {
    department: "Frontend",
    currentShift: "Saturday 7:00am – 3:00pm",
    alertTime: "11:05am",
    totalInsights: 7,
    frontendInsights: 3,
    role: "Bagger"
  },

  // ── THE THREE ON-SCREEN CARDS ────────────────────────────────

  insightCards: [
    {
      id: "card_eliza_meal_break",
      title: "Late for meal break",
      tags: ["Meal break", "Frontend"],
      time: "11:05 am",
      expires: "11:08 am",
      expiresInMinutes: 3,
      urgency: "high",
      body: "Eliza Thompson is 15m late for their meal break, send them now",
      employeeName: "Eliza Thompson",
      employeeLabel: "Eliza: Saturday 7a–3p Frontend / Bagger",
      shift: "Saturday 7:00am – 3:00pm",
      role: "Bagger",
      department: "Frontend",
      actions: ["acknowledge"],
      secondaryActions: ["snooze", "edit"],
      currentStatus: "meal break overdue by 15 minutes",
      immediateAction: "Send Eliza on her meal break immediately"
    },
    {
      id: "card_tom_break_compliant",
      title: "Scheduled break is no longer compliant",
      tags: ["Meal break", "Frontend"],
      time: "11:05 am",
      expires: "11:22 am",
      expiresInMinutes: 17,
      urgency: "medium",
      body: "Tom Jones had started their shift 5 minutes earlier than scheduled. Their scheduled break is no longer compliant and it needs to be adjusted",
      employeeName: "Tom Jones",
      employeeLabel: "Tom: Saturday 7a–3p Frontend / Bagger",
      shift: "Saturday 7:00am – 3:00pm",
      role: "Bagger",
      department: "Frontend",
      actions: ["accept", "dismiss"],
      secondaryActions: ["edit"],
      currentStatus: "break window shifted due to early clock-in",
      immediateAction: "Accept the adjusted break time or dismiss if coverage allows"
    },
    {
      id: "card_sam_minor_hours",
      title: "Minor working beyond legal hours",
      tags: ["Minor", "Frontend"],
      time: "11:05 am",
      expires: "11:28 am",
      expiresInMinutes: 23,
      urgency: "high",
      body: "Sam Adams (minor) is currently working past permitted hours. Send them home to remain compliant.",
      employeeName: "Sam Adams",
      employeeLabel: "Sam: Saturday 7a–3p Frontend / Bagger",
      shift: "Saturday 7:00am – 3:00pm",
      role: "Bagger",
      department: "Frontend",
      isMinor: true,
      actions: ["acknowledge"],
      secondaryActions: ["edit"],
      currentStatus: "working past legally permitted hours for a minor",
      immediateAction: "Send Sam Adams home immediately"
    }
  ],

  // ── EMPLOYEES ────────────────────────────────────────────────

  employees: [
    {
      id: "emp_eliza_thompson",
      name: "Eliza Thompson",
      role: "Bagger",
      department: "Frontend",
      type: "Full-Time",
      shift: "Saturday 7:00am – 3:00pm",
      hourlyRate: 17.75,
      tenure: "2 years 3 months",
      isMinor: false,
      avatar: "ET",
      currentIssueCardId: "card_eliza_meal_break",
      history: {
        mealBreakViolations30Days: 4,
        mealBreakViolations60Days: 6,
        mealBreakViolations90Days: 9,
        violationDates90Days: [
          "2026-01-11", "2026-01-26",
          "2026-02-09", "2026-02-23",
          "2026-03-08", "2026-03-15", "2026-03-22", "2026-03-30",
          "2026-04-06"
        ],
        trend: "worsening",
        lastViolationDate: "2026-04-06",
        pattern: "Violations consistently happen on Saturday and Monday shifts between 10:30am–11:15am. Peak bagging volume with no break relief assigned. Eliza delays her break to finish clearing the queue — no one covers her station.",
        averageMinutesLate: 18,
        mostCommonDays: ["Saturday", "Monday"],
        violationTimeWindow: "10:30am – 11:15am",
        rootCause: "Self-checkout and bagging surges during 10am–11am peak. No break relief rotation exists for Frontend baggers during this window. Eliza cannot leave without coverage — she waits until the queue clears.",
        overtimeViolations90Days: 0,
        overtimeNote: "Covered 2 hrs on Feb 1 for a colleague — manager-approved, paid at 1.5x. No policy breach.",
        premiumPayCost30Days: 71.00,
        premiumPayCost90Days: 159.75,
        priorAcknowledgements: 3,
        priorFormalActions: 0
      },
      complianceScore: 64,
      attendanceScore: 79,
      attritionRisk: "medium",
      attritionProbability: "33%"
    },
    {
      id: "emp_tom_jones",
      name: "Tom Jones",
      role: "Bagger",
      department: "Frontend",
      type: "Full-Time",
      shift: "Saturday 7:00am – 3:00pm",
      scheduledClockIn: "7:00am",
      actualClockIn: "6:55am",
      earlyStartMinutes: 5,
      originalBreakTime: "11:00am",
      adjustedCompliantBreakTime: "10:55am",
      hourlyRate: 18.25,
      tenure: "3 years 8 months",
      isMinor: false,
      avatar: "TJ",
      currentIssueCardId: "card_tom_break_compliant",
      history: {
        earlyClockInCount30Days: 6,
        earlyClockInCount60Days: 9,
        trend: "stable",
        pattern: "Tom regularly arrives 5–10 minutes early and clocks in immediately. He is not aware this shifts his compliant meal break window. This has triggered a break non-compliance alert 3 times in the past 60 days.",
        breakNonComplianceCount30Days: 2,
        rootCause: "Tom clocks in early out of habit. The system calculates meal break windows from actual clock-in, not scheduled time. Tom doesn't know this — no one has told him.",
        priorAcceptances: 2,
        priorFormalActions: 0
      },
      complianceScore: 74,
      attendanceScore: 88,
      attritionRisk: "low",
      attritionProbability: "11%"
    },
    {
      id: "emp_sam_adams",
      name: "Sam Adams",
      role: "Bagger",
      department: "Frontend",
      type: "Part-Time",
      shift: "Saturday 7:00am – 3:00pm",
      isMinor: true,
      minorAge: 16,
      hourlyRate: 14.50,
      tenure: "4 months",
      avatar: "SA",
      currentIssueCardId: "card_sam_minor_hours",
      minorWorkPermit: {
        hasPermit: true,
        permitNumber: "WP-2025-4421",
        maxHoursSchoolDay: 3,
        maxHoursNonSchoolDay: 8,
        maxHoursPerWeek: 48,
        latestPermittedEndTimeSaturday: "10:00pm",
        currentDayType: "Non-school day (Saturday)",
        scheduledHoursToday: 8,
        hoursWorkedSoFar: 4.08,
        currentTime: "11:05am",
        permittedDailyMax: 8,
        flagReason: "Daily hours are within limit but cumulative weekly hours have crossed the permitted weekly threshold as of this morning's shift."
      },
      history: {
        minorHoursViolations30Days: 1,
        minorHoursViolations60Days: 1,
        trend: "new_hire",
        pattern: "Sam is a new hire (4 months). This is his first hours violation. He is an enthusiastic worker and has been picking up extra shifts. The weekly accumulation was not caught by the scheduling system in time.",
        weeklyHoursThisWeek: 49,
        weeklyMaxPermitted: 48,
        hoursOverLimit: 1,
        rootCause: "Sam picked up a 4-hour Monday shift in addition to his regular Saturday 8-hour shift. Combined with other days, his weekly total hit 49 hours — 1 hour over the minor weekly cap. The system flagged it this morning."
      },
      complianceScore: 91,
      attendanceScore: 95,
      attritionRisk: "low",
      attritionProbability: "9%"
    }
  ],

  // ── POLICIES ─────────────────────────────────────────────────

  policies: {

    meal_break_ca: {
      id: "meal_break_ca",
      name: "Meal Break Policy — California",
      legalBasis: "CA Labor Code §512 and §226.7",
      plain: "Any employee working more than 5 hours must receive a 30-minute unpaid meal break. That break must begin no later than the end of the 5th hour of work. The clock starts from actual clock-in time — not scheduled start time.",
      window: "Break must start before the 5-hour mark from actual clock-in.",
      penalty: "1 additional hour of pay at the employee's regular rate per missed or late meal period.",
      employerObligation: "The employer must provide and ensure the break happens on time. 'I forgot to send them' is not a defense.",
      whenBreakWindowShifts: "If an employee clocks in earlier than scheduled, the 5-hour window starts from actual clock-in. A break scheduled at 11:00am for a 7:00am shift becomes non-compliant if the employee clocked in at 6:55am — because hour 5 is now 11:55am if counted wrong, or the break must occur before 11:55am. The system recalculates automatically.",
      acknowledgeAction: "Acknowledging confirms you've seen the alert and are sending the employee on their break. The timestamp is recorded. If the employee goes on break within the expiry window, no violation is recorded.",
      riskIfIgnored: "If the alert expires without action and the employee has not taken their break, a meal period violation is automatically logged. Premium pay is triggered. Repeat ignored alerts build a pattern that increases legal exposure."
    },

    minor_work_hours_ca: {
      id: "minor_work_hours_ca",
      name: "Minor Work Hours — California",
      legalBasis: "CA Labor Code §1285–1312; Education Code §49112",
      plain: "California sets strict limits on how many hours a minor (under 18) can work per day and per week. These limits vary based on age, school status, and whether a work permit is on file.",
      limitsAge16to17: {
        schoolDay: "Maximum 4 hours per day",
        nonSchoolDay: "Maximum 8 hours per day",
        schoolWeek: "Maximum 4 hours on any school day, 48 hours per week",
        nonSchoolWeek: "Maximum 48 hours per week"
      },
      limitsAge14to15: {
        schoolDay: "Maximum 3 hours per day",
        nonSchoolDay: "Maximum 8 hours per day",
        schoolWeek: "Maximum 18 hours per week",
        nonSchoolWeek: "Maximum 40 hours per week"
      },
      requiredDocumentation: "A valid work permit (Statement of Intent to Employ a Minor) must be on file before the minor begins work. Permits expire and must be renewed.",
      penaltyForViolation: "Employer is subject to civil penalties per occurrence. Repeat violations can trigger a DLSE investigation. In severe cases, the business can lose the right to employ minors.",
      managerObligation: "When the system flags a minor working beyond permitted hours, the manager must act immediately. Continuing to allow the minor to work after the alert is willful non-compliance.",
      acknowledgeAction: "Acknowledging this alert logs that you received it and will act. You must then send the employee home. If you acknowledge but do not release the employee within a reasonable window, the violation is still recorded.",
      riskIfIgnored: "Knowingly allowing a minor to work beyond legal hours is a misdemeanor under CA Labor Code. The store, the manager, and corporate can each face liability."
    },

    early_clock_in_break_adjustment: {
      id: "early_clock_in_break_adjustment",
      name: "Early Clock-In & Break Compliance",
      plain: "When an employee clocks in before their scheduled start time, the system recalculates their meal break window from the actual clock-in time. If their previously scheduled break now falls outside the compliant 5-hour window, a break compliance alert is generated.",
      acceptAction: "Accepting confirms the adjusted break time. The system updates Tom's break to the new compliant window. His original scheduled break time is replaced. No violation is recorded.",
      dismissAction: "Dismissing means you believe the original break time is still acceptable — usually because you have operational context the system doesn't. If the employee does not take a compliant break within the legal window after dismissal, a violation is recorded automatically.",
      recommendation: "In most cases: Accept. The system's calculation is correct. Dismissing is appropriate only if the employee is already on break or you have confirmed the timing works.",
      riskOfDismissing: "If you dismiss and Tom's break ends up falling outside the compliant window, the employer owes premium pay. A dismissed alert does not remove the legal obligation — it only removes the system prompt."
    }
  },

  // ── INSIGHTS (progressive disclosure layers) ─────────────────

  insights: {

    eliza: {
      level1: "Eliza Thompson is 15 minutes late for her meal break right now. Her break expires in 3 minutes — she needs to go now.",

      level2_context: "This is not her first time. Eliza has missed or been late to her meal break 4 times in the last 30 days. Today's is the most urgent because she's already 15 minutes over.",

      level3_pattern: "The pattern is consistent — all her violations happen on Saturday and Monday morning shifts, between 10:30am and 11:15am. That's peak bagging volume. She delays her break to finish clearing the queue. No one is assigned to cover her station when she leaves.",

      level4_policy: "Under California law, her meal break must start before the 5-hour mark from clock-in. She clocked in at 7:00am, so her break window closed at 12:00pm. She is already 15 minutes past that. If she doesn't go now and the alert expires, a meal period violation is logged automatically — the store owes her 1 hour of premium pay at $17.75.",

      level5_action: "Acknowledge the alert and send Eliza on her break immediately. Assign someone to cover her bagging station for 30 minutes. After the shift, review whether a designated break relief rotation would prevent this from repeating.",

      level6_risk: "If this alert expires without action, a meal break violation is recorded. With 4 violations in 30 days, the store is approaching the threshold where a DLSE audit or wage claim becomes a realistic risk. The premium pay adds up — 4 violations this month alone is $71 in unplanned cost.",

      financialImpact: {
        premiumPayPerViolation: 17.75,
        violations30Days: 4,
        cost30Days: 71.00,
        violations90Days: 9,
        cost90Days: 159.75,
        projectedAnnualCost: 852.00
      },

      recommendations: [
        { rank: 1, action: "Send Eliza on break immediately", urgency: "now", rationale: "3 minutes before alert expires. Every second counts." },
        { rank: 2, action: "Assign a break relief rotation for bagging station on Saturday mornings", urgency: "today", rationale: "Root cause is no coverage. Fixing coverage eliminates the violation pattern." },
        { rank: 3, action: "Have a coaching conversation with Eliza after the shift", urgency: "this week", rationale: "4 violations in 30 days warrants documentation and a conversation about break adherence." }
      ]
    },

    tom: {
      level1: "Tom Jones clocked in 5 minutes early today. That shifted his compliant meal break window earlier. His originally scheduled 11:00am break is now out of compliance — the system needs you to accept the adjusted time.",

      level2_context: "Tom doesn't know this is happening. He clocks in early out of habit — 6 times in the last 30 days — not realizing that early clock-ins recalculate his break window. This alert has triggered twice before in the past 60 days.",

      level3_pattern: "Tom consistently arrives 5–10 minutes before his scheduled start. He clocks in immediately rather than waiting. The scheduling system calculates his meal break window from actual clock-in time, so his 11:00am break becomes non-compliant at 5 hours after 6:55am check-in. He's never been told this is how the system works.",

      level4_policy: "The meal break window is calculated from actual clock-in, not scheduled start. Tom clocked in at 6:55am. His 5-hour window closes at 11:55am. His break is currently scheduled at 11:00am — which is still within compliance — but if the adjusted time is not accepted, the system can't confirm the break is properly tracked. Accepting updates the record to match actual timing.",

      level5_action_accept: "Accepting confirms the adjusted break time for today. Tom's break is updated from 11:00am to the recalculated window. No violation is recorded. Tom takes his break as normal — the only difference is the system now has the correct timestamp.",

      level5_action_dismiss: "Dismissing tells the system you're aware but don't want to adjust the scheduled time. Use this only if Tom has already started his break or if you have confirmed the original time still works. If you dismiss and Tom's break falls outside the compliant window, a violation is logged automatically — you won't get a second alert.",

      level6_risk: "If dismissed without action and Tom's break is late, the store owes him 1 hour of premium pay at $18.25. Two of these in the past 60 days have already been accepted — a third could prompt a review of early clock-in patterns.",

      recommendations: [
        { rank: 1, action: "Accept the adjusted break time", urgency: "now", rationale: "The calculation is correct. Accepting takes 1 tap and prevents a violation." },
        { rank: 2, action: "Tell Tom about the clock-in / break window relationship after the shift", urgency: "today", rationale: "Tom doesn't know early clock-ins shift his break window. One conversation prevents future alerts." },
        { rank: 3, action: "Consider a policy reminder to all Frontend baggers about clock-in timing", urgency: "this week", rationale: "If Tom is doing this, others may be too." }
      ]
    },

    sam: {
      level1: "Sam Adams is a 16-year-old minor and is currently working past his legally permitted weekly hours. California law requires you to send him home immediately to remain compliant.",

      level2_context: "Sam is a new hire — 4 months in. This is his first hours violation. He picked up an extra Monday shift this week, which pushed his weekly total to 49 hours — 1 hour over the 48-hour weekly cap for minors on non-school weeks.",

      level3_pattern: "Sam is enthusiastic and has been picking up extra shifts. The scheduling system did not flag the weekly hour accumulation before today's shift was confirmed. This is a scheduling oversight, not misconduct on Sam's part. He has a valid work permit on file.",

      level4_policy: "California Labor Code restricts 16–17-year-olds to a maximum of 48 hours per week during non-school weeks. Sam is currently at 49 hours this week — 1 hour over. The law does not allow this to be waived. The employer's obligation is immediate: release Sam from work now. Continuing to allow him to work after this alert is willful non-compliance — a misdemeanor under CA law.",

      level5_action: "Acknowledge the alert and send Sam home now. Document the time he left. Review this week's schedule to identify where the extra hours accumulated. Update the scheduling rules to hard-block minors at their weekly hour cap before the shift is confirmed.",

      level6_risk: "Every minute Sam continues working past the alert is willful non-compliance. Civil penalties apply per occurrence. Repeat violations can trigger a DLSE investigation and cost the store the right to employ minors. The reputational and financial exposure is significant — far exceeding the cost of one bagger's lost shift hours.",

      coverageImpact: "Sending Sam home at 11:05am leaves approximately 4 hours of his bagging shift uncovered (through 3:00pm). See Staffing Intelligence for coverage options.",

      recommendations: [
        { rank: 1, action: "Send Sam home now — acknowledge and release", urgency: "immediately", rationale: "Legal obligation. No exceptions. Every minute of delay increases liability." },
        { rank: 2, action: "Document Sam's departure time and the alert acknowledgement", urgency: "now", rationale: "Documentation protects the store if the incident is ever reviewed." },
        { rank: 3, action: "Fix the scheduling system to hard-block minor weekly hours at the cap", urgency: "this week", rationale: "This violation happened because the system allowed the extra Monday shift to be confirmed. A scheduling rule prevents recurrence." },
        { rank: 4, action: "Cover Sam's remaining shift hours", urgency: "now", rationale: "4 hours of bagging coverage needed through 3pm. Check Staffing Intelligence for options." }
      ]
    },

    departmentOverview: {
      totalAlerts: 3,
      urgencyRanking: ["card_eliza_meal_break", "card_sam_minor_hours", "card_tom_break_compliant"],
      mostUrgent: "Eliza's alert expires in 3 minutes. Act on that first.",
      summary: "You have 3 Frontend compliance alerts, all on the Saturday 7a–3p bagger shift. Eliza's meal break is expiring in minutes. Sam must be sent home — he's a minor over his weekly hour limit. Tom's break window shifted due to early clock-in and needs your acceptance.",
      totalPremiumPayRisk: 50.50,
      breakdown: {
        elizaPremiumPayIfExpired: 17.75,
        tomPremiumPayIfDismissedAndLate: 18.25,
        samPenaltyIfIgnored: "Civil penalty — amount varies, not a simple premium pay calculation"
      }
    }
  },

  // ── STAFFING INTELLIGENCE ─────────────────────────────────────
  // Context: Sam Adams is being sent home early (4 hours of coverage lost).
  // Saturday 7a–3p shift. Following adjustments address the gap.

  staffing: {
    currentShift: {
      date: "Saturday, April 5, 2026",
      shift: "7:00am – 3:00pm",
      department: "Frontend",
      role: "Bagger",
      scheduledHeadcount: 4,
      currentTime: "11:05am",
      hoursRemaining: 3.9,
      coverageGap: {
        reason: "Sam Adams (minor) being sent home at 11:05am per compliance requirement",
        hoursUncovered: 3.9,
        impact: "Reduced bagging capacity during Saturday midday and early afternoon peak"
      }
    },

    adjustments: [
      {
        id: "adj_jordan",
        employeeId: "emp_fe_jordan",
        employeeName: "Jordan",
        role: "Head Cashier / cross-trained Bagger",
        type: "shift_shortening",
        action: "Shorten Jordan's Saturday shift by 3 hours to prevent overtime",
        currentShift: "7:00am – 6:00pm (11 hrs)",
        adjustedShift: "7:00am – 3:00pm (8 hrs)",
        hoursRemoved: 3,
        weeklyHoursBefore: 43,
        weeklyHoursAfter: 40,
        overtimePrevented: 3,
        overtimeCostSaved: 86.63,
        rationale: "Jordan has 35 hours Mon–Fri this week and a full 11-hour Saturday scheduled. Without adjustment, Jordan hits 43 hours this week — 3 hours of overtime at $28.88/hr. Capping at 3pm keeps Jordan at exactly 40 hours with no overtime penalty. Jordan's coverage is most valuable during the morning rush (7am–12pm), which they've already worked.",
        tradeoff: "Jordan leaves at 3pm rather than 6pm. Afternoon coverage is reduced but manageable.",
        employeeImpact: "Jordan loses 3 hours of income at regular rate. Offer voluntary OT next week if Jordan wants to make it up."
      },
      {
        id: "adj_sam_rivera",
        employeeId: "emp_fe_sam_rivera",
        employeeName: "Sam Rivera",
        role: "Cashier / Bagger",
        type: "shift_extension",
        action: "Extend Sam Rivera's Saturday shift by 2 hours to fill part of the uncovered workload",
        currentShift: "11:00am – 3:00pm (4 hrs)",
        adjustedShift: "11:00am – 5:00pm (6 hrs)",
        hoursAdded: 2,
        weeklyHoursBefore: 22,
        weeklyHoursAfter: 24,
        overtimeRisk: "None — well below 40-hour threshold",
        additionalCost: 33.50,
        rationale: "Sam Rivera is already on shift and has confirmed availability through 5pm. Adding 2 hours covers the midday peak left by Sam Adams's early departure. No overtime triggered. Sam Rivera is cross-trained as a bagger — direct replacement for the gap.",
        tradeoff: "Adds $33.50 to labor cost. No coverage drawback.",
        employeeImpact: "Sam Rivera gains 2 hours of income — typically well received."
      },
      {
        id: "adj_ava_johnson",
        employeeId: "emp_fe_ava_johnson",
        employeeName: "Ava Johnson",
        role: "Cashier",
        type: "shift_extension",
        action: "Add a 1-hour extension to Ava Johnson's shift to cover remaining demand without triggering overtime",
        currentShift: "9:00am – 3:00pm (6 hrs)",
        adjustedShift: "9:00am – 4:00pm (7 hrs)",
        hoursAdded: 1,
        weeklyHoursBefore: 37,
        weeklyHoursAfter: 38,
        overtimeRisk: "None — stays under 40 hours",
        additionalCost: 17.50,
        rationale: "Ava has 37 hours this week. Adding 1 hour brings her to 38 — safely under the overtime threshold. She covers the 3pm–4pm window where Jordan has exited and the shift is thinnest. $17.50 is the lowest-cost coverage option available.",
        tradeoff: "Covers only 1 hour. Not a full replacement for Sam Adams.",
        employeeImpact: "1 additional hour of regular pay. Minimal ask."
      },
      {
        id: "adj_alex_park",
        employeeId: "emp_fe_alex_park",
        employeeName: "Alex Park",
        role: "Cashier — cross-trained in Frontend and Grocery",
        type: "cross_department_move",
        action: "Move Alex Park from Front-End to Grocery for the last hour of the shift to maintain adequate skill coverage",
        currentShift: "10:00am – 4:00pm — all Frontend",
        adjustedShift: "10:00am – 3:00pm Frontend / 3:00pm – 4:00pm Grocery",
        hoursMoved: 1,
        weeklyTotalImpact: "None — same hours, different department",
        additionalCost: 0,
        rationale: "By 3pm on Saturdays, Frontend bagging volume drops while Grocery needs restocking and evening prep coverage. Alex Park is cross-certified in both departments. Moving Alex for the last hour maintains skill coverage in both areas at zero additional cost — same total pay, better distribution.",
        tradeoff: "Frontend loses one certified bagger for the final hour. Offset by Sam Rivera's extended shift.",
        employeeImpact: "Alex works the same hours — just the last hour in a different department. Confirm with Alex before the shift change."
      }
    ],

    netResult: {
      coverageGapHours: 3.9,
      coverageRestoredHours: 3.9,
      gapFullyCovered: true,
      overtimePrevented: 3,
      overtimeCostSaved: 86.63,
      additionalLaborCost: 51.00,
      netSavings: 35.63,
      summary: "Four adjustments fully cover the gap left by Sam Adams's early departure, prevent $87 in Jordan's overtime, and cost only $51 in added shift extensions. Net saving: $36. No new headcount needed."
    },

    coverageTimeline: [
      { time: "11:05am", event: "Sam Adams sent home — coverage gap opens" },
      { time: "11:05am – 3:00pm", event: "Sam Rivera (extended) covers bagging through 5pm" },
      { time: "11:05am – 3:00pm", event: "Jordan covers until 3pm (adjusted end time)" },
      { time: "3:00pm – 4:00pm", event: "Ava Johnson extended 1 hour covers 3pm–4pm" },
      { time: "3:00pm – 4:00pm", event: "Alex Park moves to Grocery — Frontend fully covered by Ava" }
    ]
  }
};

// ─────────────────────────────────────────────────────────────
// VOICE QUERY LIBRARY — FRONTEND
// Ordered by natural manager conversation flow.
// Each entry answers ONE question at the right level.
// ─────────────────────────────────────────────────────────────

export const frontendVoiceQueries = [

  // ─── OVERVIEW ─────────────────────────────────────────────

  {
    id: "fe_001",
    session: "Compliance",
    level: 1,
    phrases: [
      "show me frontend issues",
      "what are the frontend alerts",
      "frontend compliance",
      "what's happening in frontend",
      "show me all issues in frontend"
    ],
    filterTarget: { department: "Frontend" },
    responseType: "card_list",
    ccpPattern: "CCP",
    response: "Looking at Frontend. You have 3 active alerts on the Saturday 7am–3pm bagger shift. Eliza Thompson is 15 minutes late for her meal break — alert expires in 3 minutes. Sam Adams is a minor over his weekly hour limit — he needs to go home now. Tom Jones clocked in early and his break window shifted — that one just needs a quick accept. Want to start with the most urgent?"
  },

  {
    id: "fe_002",
    session: "Compliance",
    level: 1,
    phrases: [
      "which one is most urgent",
      "what do i do first",
      "where do i start",
      "most urgent issue",
      "priority"
    ],
    responseType: "priority_action",
    ccpPattern: "CCP",
    response: "Here's your priority order. Start with Eliza — her alert expires in 3 minutes, send her on break now. Then Sam Adams — he's a minor over his legal hour limit, he can't keep working. Tom's alert doesn't expire for another 17 minutes and just needs a one-tap accept. Want me to pull up Eliza's alert?"
  },

  // ─── ELIZA THOMPSON ───────────────────────────────────────

  {
    id: "fe_003",
    session: "Compliance",
    level: 1,
    phrases: [
      "what's the issue with eliza",
      "tell me about eliza",
      "eliza thompson",
      "eliza meal break",
      "what's going on with eliza",
      "eliza's alert",
      "eliza's situation"
    ],
    filterTarget: { employeeId: "emp_eliza_thompson" },
    responseType: "card_detail",
    ccpPattern: "CCP",
    response: "Here's Eliza's situation: she's 15 minutes past her meal break window, and the alert will expire at 11:08 AM. Tapping \"Acknowledge\" confirms you're aware and commits you to sending her now. Would you like to proceed?"
  },
  {
    id: "fe_004",
    session: "Compliance",
    level: 2,
    phrases: [
      "is this the first time for eliza",
      "has eliza done this before",
      "eliza history",
      "first time",
      "is this her first time",
      "has this happened before",
      "has this happened before with eliza"
    ],
    filterTarget: { employeeId: "emp_eliza_thompson" },
    responseType: "history",
    ccpPattern: "CCP",
    response: "Here's her record. This is Eliza's 4th missed meal break in 30 days — and her 9th in the past 3 months. Every one of them falls on a Saturday or Monday morning. Want to know why it keeps happening?"
  },
  {
    id: "fe_004b",
    session: "Compliance",
    level: 2,
    phrases: [
      "how often does this happen",
      "how often does eliza miss her break",
      "how many times has eliza been late",
      "how many times has eliza missed her break",
      "how frequently does this happen"
    ],
    filterTarget: { employeeId: "emp_eliza_thompson" },
    responseType: "history",
    ccpPattern: "CCP",
    response: "Checking Eliza's history. She's missed her break window 4 times this month — March 8, 15, 22, and today. All four are Saturday shifts. Want to see the pattern behind it?"
  },
  {
    id: "fe_030",
    session: "Compliance",
    level: 2,
    phrases: [
      "has eliza had any overtime issues",
      "eliza overtime",
      "any overtime issues",
      "overtime issues for eliza",
      "does eliza have overtime problems"
    ],
    filterTarget: { employeeId: "emp_eliza_thompson" },
    responseType: "history",
    ccpPattern: "CCP",
    response: "Checking her overtime record. No violations in the past 3 months. She picked up 2 extra hours on February 1st to cover a colleague — manager-approved, paid at 1.5x, no breach. Meal breaks are the only pattern. Want to dig into that?"
  },
  {
    id: "fe_030b",
    session: "Compliance",
    level: 2,
    phrases: [
      "any other issues for eliza",
      "any other issues in the past 3 months",
      "eliza issues past 3 months",
      "any other problems with eliza",
      "anything else on eliza's record"
    ],
    filterTarget: { employeeId: "emp_eliza_thompson" },
    responseType: "history",
    ccpPattern: "CCP",
    response: "Here's Eliza's last 90 days. 9 meal break violations, $159.75 in premium pay — no overtime issues, no attendance problems. It's a single pattern, not a broad conduct issue. Want to understand what's driving it?"
  },
  {
    id: "fe_005",
    session: "Compliance",
    level: 3,
    phrases: [
      "why does eliza keep missing her break",
      "what's causing eliza's violations",
      "eliza pattern",
      "why is eliza always late for her break",
      "why does this keep happening",
      "what's driving this",
      "why does she keep missing her break",
      "scheduling gap"
    ],
    filterTarget: { employeeId: "emp_eliza_thompson" },
    responseType: "pattern_insight",
    ccpPattern: "CCP",
    response: "Here's the pattern. Every violation falls between 10:30 and 11:15am on Saturdays and Mondays — peak floor traffic with no break relief assigned for Frontend baggers. This is a scheduling gap, not Eliza. Want to know what the policy says?"
  },
  {
    id: "fe_031",
    session: "Compliance",
    level: 3,
    phrases: [
      "when does this usually happen",
      "when does this usually happen for eliza",
      "when does eliza miss her break",
      "eliza violation timing",
      "what time does eliza's violations happen",
      "what time do the violations happen"
    ],
    filterTarget: { employeeId: "emp_eliza_thompson" },
    responseType: "pattern_insight",
    ccpPattern: "CCP",
    response: "Here's the timing. All 9 violations hit between 10:30 and 11:15am — always on her Saturday or Monday shifts. Never on her weekday afternoons. Want to know what's happening in that window?"
  },
  {
    id: "fe_006",
    session: "Compliance",
    level: 4,
    phrases: [
      "what's the policy on meal breaks",
      "meal break policy",
      "what does the policy say for eliza",
      "eliza meal break policy",
      "what are the rules for eliza's break",
      "what does california say about meal breaks",
      "how do meal breaks work",
      "meal break rules"
    ],
    responseType: "policy_detail",
    ccpPattern: "CCP",
    response: "Here's what California law requires. Employees must take a 30-minute unpaid break within 5 hours of clocking in. Work through it and the company owes one extra hour at their regular rate — $17.75 for Eliza today. Want to know what Acknowledge does?"
  },
  {
    id: "fe_034",
    session: "Compliance",
    level: 4,
    phrases: [
      "what's the policy on overtime",
      "overtime policy",
      "what does california say about overtime",
      "overtime rules",
      "how does overtime work",
      "what does the policy say about overtime"
    ],
    responseType: "policy_detail",
    ccpPattern: "CCP",
    response: "Here's the overtime rule. California requires 1.5x pay for anything over 8 hours in a day, 2x over 12. Weekly, it kicks in after 40 hours. Eliza's at 7.5 hours today — she's fine if she leaves at 3pm. Want to check anyone else in Frontend?"
  },
  {
    id: "fe_035",
    session: "Compliance",
    level: 4,
    phrases: [
      "what are the rules for minors",
      "minor rules",
      "minor work rules",
      "what does california say about minors",
      "minor labor laws",
      "minor hour limits"
    ],
    responseType: "policy_detail",
    ccpPattern: "CCP",
    response: "Here's what California says about minors. Employees 16–17 can work up to 48 hours in a non-school week and can't go past 10pm on school nights. Employees 14–15 are capped at 3 hours on school days, 18 hours in a school week. Is there a specific employee you're checking on?"
  },
  {
    id: "fe_040",
    session: "Compliance",
    level: 5,
    phrases: [
      "yes acknowledge",
      "yes go ahead",
      "yes proceed",
      "go ahead and acknowledge",
      "acknowledge it",
      "yes please acknowledge",
      "acknowledge the alert",
      "acknowledge eliza's alert",
      "yes acknowledge eliza",
      "proceed with acknowledge"
    ],
    action: "acknowledge:Eliza",
    responseType: "action_confirmation",
    ccpPattern: "CCP+ConfirmGate",
    response: "Done. Eliza's meal break alert has been acknowledged. She needs to be on break before 11:08am — the record is now logged."
  },
  {
    id: "fe_041",
    session: "Compliance",
    level: 5,
    phrases: [
      "would you like to proceed",
      "yes i would like to proceed",
      "yes please",
      "go ahead",
      "yes"
    ],
    action: "acknowledge:Eliza",
    responseType: "action_confirmation",
    ccpPattern: "CCP+ConfirmGate",
    response: "Done. Eliza's meal break alert has been acknowledged. She needs to be on break before 11:08am — the record is now logged."
  },
  {
    id: "fe_008",
    session: "Compliance",
    level: 5,
    phrases: [
      "what does acknowledge do",
      "what does acknowledging do",
      "what does acknowledging eliza's alert do",
      "what happens when i acknowledge",
      "what happens when i acknowledge eliza",
      "acknowledge eliza",
      "what happens if i tap acknowledge"
    ],
    responseType: "action_explanation",
    ccpPattern: "CCP+ConfirmGate",
    response: "Here's what Acknowledge does. It logs that you're aware and commits you to sending Eliza on break right now. If she takes her break before 11:30am, no violation is recorded — if she doesn't, the violation logs automatically and $17.75 premium pay is owed. Ready to go ahead?"
  },
  {
    id: "fe_007",
    session: "Compliance",
    level: 5,
    phrases: [
      "what should i do about eliza",
      "what's the recommended action for eliza",
      "how do i handle eliza's break",
      "what do i do about eliza",
      "what's the call on eliza"
    ],
    filterTarget: { employeeId: "emp_eliza_thompson" },
    responseType: "recommendation",
    ccpPattern: "CCP+ConfirmGate",
    response: "Here's the call. Send Eliza on break now and tap Acknowledge — you have 3 minutes before the window closes at 11:08am. She goes now, no violation recorded. She doesn't, it auto-logs and $17.75 premium pay kicks in. Want to Acknowledge now?"
  },
  {
    id: "fe_009",
    session: "Compliance",
    level: 6,
    phrases: [
      "what happens if i don't act",
      "what happens if i don't act on eliza",
      "what if eliza's alert expires",
      "risk of ignoring eliza's alert",
      "what if i do nothing for eliza",
      "what if i do nothing",
      "what happens if i ignore this"
    ],
    responseType: "risk",
    ccpPattern: "CCP",
    response: "Here's what happens at 11:08am. The alert closes — no second alert, no reminder. The violation logs on Eliza's record, $17.75 hits her next paycheck, and she's at 4 violations in 30 days. That pattern can flag the store for a labor audit. Want to Acknowledge before the window closes?"
  },
  {
    id: "fe_032",
    session: "Compliance",
    level: 6,
    phrases: [
      "how much has this cost",
      "how much has this cost so far",
      "how much has eliza's violations cost",
      "what's the total cost for eliza",
      "eliza premium pay",
      "total cost of eliza's violations",
      "how much is this costing"
    ],
    filterTarget: { employeeId: "emp_eliza_thompson" },
    responseType: "financial_summary",
    ccpPattern: "CCP",
    response: "Here's the cost picture. Eliza's 9 violations over 3 months have run $159.75 in premium pay — about $640 projected annually. With 3 active Frontend alerts today, you're looking at another $53.25 this morning if none are resolved. Want to know how to fix the scheduling gap behind it?"
  },

  // ─── TOM JONES ────────────────────────────────────────────

  {
    id: "fe_010",
    session: "Compliance",
    level: 1,
    phrases: [
      "what's the issue with tom",
      "tell me about tom jones",
      "tom jones",
      "tom break alert"
    ],
    filterTarget: { employeeId: "emp_tom_jones" },
    responseType: "card_detail",
    ccpPattern: "CCP",
    response: "Here's Tom's situation. He clocked in 5 minutes early today — at 6:55am instead of 7:00am. That shifted his compliant meal break window earlier, and his 11:00am break is now flagged as non-compliant. It just needs to be accepted. Want to know why an early clock-in causes this, or go straight to what the buttons do?"
  },
  {
    id: "fe_011",
    session: "Compliance",
    level: 2,
    phrases: [
      "why does an early clock-in affect tom's break",
      "why does starting early change his break",
      "how does clocking in early cause a compliance issue"
    ],
    responseType: "explanation",
    ccpPattern: "CCP",
    response: "Here's why it matters. California law calculates the 5-hour break window from actual clock-in time — not scheduled start. Tom clocked in at 6:55am, so the system recalculates his window from then. His 11:00am break still works, but the record needs the correct clock-in reflected to stay properly tracked. Want to know if Tom has done this before?"
  },
  {
    id: "fe_012",
    session: "Compliance",
    level: 2,
    phrases: [
      "has tom done this before",
      "is this the first time for tom",
      "tom clock-in history",
      "how often does tom clock in early"
    ],
    filterTarget: { employeeId: "emp_tom_jones" },
    responseType: "history",
    ccpPattern: "CCP",
    response: "Checking Tom's history. He's clocked in early 6 times in the last 30 days, and this alert has fired twice before in 60 days — both were accepted. Tom doesn't know that early clock-ins shift his break window. No one has told him. Want to know what accepting does, or what to tell Tom after the shift?"
  },
  {
    id: "fe_013",
    session: "Compliance",
    level: 5,
    phrases: [
      "what happens if i accept tom's alert",
      "what does accepting do for tom",
      "accept tom's break"
    ],
    responseType: "action_explanation",
    ccpPattern: "CCP+ConfirmGate",
    response: "Here's what accepting does. It updates Tom's break record to match his actual 6:55am clock-in. The system confirms his break is compliant, no violation is recorded, and Tom takes his break as normal. One tap — done. Want me to accept this now?"
  },
  {
    id: "fe_014",
    session: "Compliance",
    level: 5,
    phrases: [
      "what happens if i dismiss tom's alert",
      "what does dismissing do",
      "should i dismiss tom"
    ],
    responseType: "action_explanation",
    ccpPattern: "CCP",
    response: "Here's what dismissing does. It tells the system you're not adjusting the break time. Use this only if Tom is already on his break or you've confirmed the original timing is fine. If you dismiss and his break ends up late, a violation auto-logs — no second alert. Want to accept instead, or do you have a reason to dismiss?"
  },
  {
    id: "fe_015",
    session: "Compliance",
    level: 5,
    phrases: [
      "what should i do about tom",
      "recommended action for tom",
      "how do i handle tom's alert"
    ],
    filterTarget: { employeeId: "emp_tom_jones" },
    responseType: "recommendation",
    ccpPattern: "CCP+ConfirmGate",
    response: "Here's the recommended action. Accept the alert — one tap, no violation recorded. Then after the shift, have a quick conversation with Tom about how early clock-ins shift his break window. He's not doing anything wrong — he just doesn't know. That one conversation will likely prevent this from recurring. Want me to accept Tom's alert now?"
  },

  // ─── SAM ADAMS (MINOR) ────────────────────────────────────

  {
    id: "fe_016",
    session: "Compliance",
    level: 1,
    phrases: [
      "what's the issue with sam",
      "tell me about sam adams",
      "sam adams alert",
      "minor working beyond legal hours"
    ],
    filterTarget: { employeeId: "emp_sam_adams" },
    responseType: "card_detail",
    ccpPattern: "CCP",
    response: "Here's Sam's situation. He's 16 years old and has exceeded his legal weekly hour limit — currently at 49 hours this week, and California caps 16 and 17-year-olds at 48 hours on non-school weeks. He needs to be sent home immediately. Want to know how he got over the limit, or what the legal consequences are?"
  },
  {
    id: "fe_017",
    session: "Compliance",
    level: 2,
    phrases: [
      "why is sam over his hours",
      "how did sam get over the limit",
      "what happened with sam's schedule"
    ],
    filterTarget: { employeeId: "emp_sam_adams" },
    responseType: "explanation",
    ccpPattern: "CCP",
    response: "Here's how Sam reached the limit. He picked up an extra Monday shift this week, which pushed his total to 49 hours — 1 hour over the cap. The scheduling system confirmed the shift without catching the accumulation. This is a scheduling oversight, not something Sam did wrong. Want to know what the law says about minor work hours?"
  },
  {
    id: "fe_018",
    session: "Compliance",
    level: 4,
    phrases: [
      "what are the rules for minors",
      "minor work hour policy",
      "what does california say about minor hours",
      "minor hour limits california"
    ],
    responseType: "policy_detail",
    ccpPattern: "CCP",
    response: "Here's what California law says. 16 and 17-year-olds are capped at 48 hours per week on non-school weeks. Sam is at 49 — no exceptions allowed. The employer must act immediately. Continuing to let Sam work after this alert is willful non-compliance — a misdemeanor under the California Labor Code. Want to know the consequences if Sam keeps working?"
  },
  {
    id: "fe_019",
    session: "Compliance",
    level: 6,
    phrases: [
      "what happens if i don't send sam home",
      "what's the risk of ignoring sam's alert",
      "what if sam keeps working",
      "consequences of sam working over hours"
    ],
    responseType: "risk",
    ccpPattern: "CCP",
    response: "Here's the legal risk. Knowingly allowing a minor to work beyond their hour limit is a misdemeanor under California law. Civil penalties apply per occurrence, and repeat violations can cost the store the right to employ minors entirely. This isn't a premium pay issue — it's a criminal liability issue. Want to acknowledge the alert and send Sam home now?"
  },
  {
    id: "fe_020",
    session: "Compliance",
    level: 5,
    phrases: [
      "what should i do about sam",
      "recommended action for sam",
      "how do i handle sam's alert",
      "what do i do with sam"
    ],
    filterTarget: { employeeId: "emp_sam_adams" },
    responseType: "recommendation",
    ccpPattern: "CCP+ConfirmGate",
    response: "Here's what to do. Send Sam home now and acknowledge the alert — document the time he leaves. Then fix the scheduling system to hard-block minors at their weekly cap before shifts are confirmed. Sam's early departure leaves about 4 hours of coverage uncovered — Staffing Intelligence has options for that. Want me to acknowledge Sam's alert now?"
  },
  {
    id: "fe_021",
    session: "Compliance",
    level: 2,
    phrases: [
      "has sam had violations before",
      "is this sam's first time",
      "sam adams history"
    ],
    filterTarget: { employeeId: "emp_sam_adams" },
    responseType: "history",
    ccpPattern: "CCP",
    response: "Checking Sam's history. This is his first violation — he's only been here 4 months and has a 91 compliance score. This happened because of a scheduling gap, not misconduct. No corrective action needed for Sam. The fix is in the scheduling system. Want to see the Staffing Intelligence options for covering his remaining shift?"
  },

  // ─── ACCEPT ALL ───────────────────────────────────────────

  {
    id: "fe_022",
    session: "Compliance",
    level: 1,
    phrases: [
      "accept all",
      "accept all insights",
      "resolve all"
    ],
    responseType: "confirmation_needed",
    ccpPattern: "CCP+ConfirmGate",
    response: "Before you accept all — Sam and Eliza's alerts require physical action. Sam must be sent home and Eliza must be sent on break; you can't resolve those with a button alone. Accepting all will acknowledge both and accept Tom's break adjustment, but you still need to act in person for Sam and Eliza. Shall I go ahead and accept all three?"
  },

  // ─── STAFFING INTELLIGENCE ────────────────────────────────

  {
    id: "fe_023",
    session: "Staffing Intelligence",
    level: 1,
    phrases: [
      "who covers sam's shift",
      "how do i cover sam's hours",
      "coverage after sending sam home",
      "sam's shift coverage",
      "staffing gap"
    ],
    responseType: "coverage_gap",
    ccpPattern: "CCP",
    response: "Here's the coverage impact. Sending Sam home at 11am leaves about 4 hours of bagger coverage uncovered through 3pm. I have 4 adjustments that fully close the gap without triggering overtime or adding new headcount. Want to see them?"
  },
  {
    id: "fe_024",
    session: "Staffing Intelligence",
    level: 2,
    phrases: [
      "what adjustments do you recommend",
      "what are the staffing adjustments",
      "how do i cover the gap",
      "staffing recommendations"
    ],
    responseType: "recommendation",
    ccpPattern: "CCP+ConfirmGate",
    response: "Here are the 4 recommended adjustments. Shorten Jordan's shift by 3 hours to prevent overtime. Extend Sam Rivera by 2 hours to cover the core gap. Add 1 hour to Ava Johnson for the late afternoon window. Move Alex Park to Grocery for the last hour — they're cross-trained and that's where coverage is needed after 3pm. Want me to apply these?"
  },
  {
    id: "fe_025",
    session: "Staffing Intelligence",
    level: 3,
    phrases: [
      "why shorten jordan",
      "why is jordan getting shortened",
      "jordan shift adjustment"
    ],
    filterTarget: { employeeId: "emp_fe_jordan" },
    responseType: "explanation",
    ccpPattern: "CCP",
    response: "Here's why Jordan's shift is being shortened. Jordan has 35 hours Mon–Fri and an 11-hour Saturday scheduled — 43 hours total, with 3 hours of overtime at $28.88/hr. Capping at 3pm keeps Jordan at exactly 40 hours and saves $87. Jordan's morning coverage window is already complete. Want to see how Sam Rivera fills the gap?"
  },
  {
    id: "fe_026",
    session: "Staffing Intelligence",
    level: 3,
    phrases: [
      "why extend sam rivera",
      "sam rivera shift",
      "can sam rivera cover"
    ],
    filterTarget: { employeeId: "emp_fe_sam_rivera" },
    responseType: "explanation",
    ccpPattern: "CCP",
    response: "Here's Sam Rivera's situation. Already on shift and available through 5pm. Adding 2 hours costs $33.50 and covers the midday bagging gap from Sam Adams's early departure. No overtime risk — Sam Rivera is only at 24 hours this week. Want to see how Ava Johnson fits into the coverage plan?"
  },
  {
    id: "fe_027",
    session: "Staffing Intelligence",
    level: 3,
    phrases: [
      "why extend ava",
      "ava johnson shift",
      "ava coverage"
    ],
    filterTarget: { employeeId: "emp_fe_ava_johnson" },
    responseType: "explanation",
    ccpPattern: "CCP",
    response: "Here's Ava Johnson's role. She has 37 hours this week — adding 1 hour brings her to 38, safely under the overtime threshold. She covers the 3pm–4pm window at $17.50, the most cost-efficient option available. Want to see how Alex Park completes the plan?"
  },
  {
    id: "fe_028",
    session: "Staffing Intelligence",
    level: 3,
    phrases: [
      "why move alex park",
      "alex park grocery",
      "cross department move alex"
    ],
    filterTarget: { employeeId: "emp_fe_alex_park" },
    responseType: "explanation",
    ccpPattern: "CCP",
    response: "Here's the reason for moving Alex Park. They're certified in both Frontend and Grocery. By 3pm on Saturdays, Frontend volume drops and Grocery needs restocking coverage. Moving Alex for the last hour puts their cross-training to use at zero additional cost — same hours, better distribution. Want to see the total cost and savings for all 4 changes?"
  },
  {
    id: "fe_029",
    session: "Staffing Intelligence",
    level: 4,
    phrases: [
      "what does this all cost",
      "what are the savings",
      "net cost of these adjustments",
      "how much do these changes save"
    ],
    responseType: "financial_summary",
    ccpPattern: "CCP+ConfirmGate",
    response: "Here's the full picture. These 4 adjustments prevent $87 in Jordan's overtime and add $51 in shift extensions — net saving: $36. The coverage gap is fully closed and no new headcount is needed. Want me to apply these adjustments to the schedule?"
  }
];

// ─────────────────────────────────────────────────────────────
// UTILITY FUNCTION
// ─────────────────────────────────────────────────────────────

/**
 * Match a voice transcript to a Frontend query.
 * Merge with matchVoiceQuery() from dwo-voice-data.js.
 *
 * @param {string} transcript
 * @returns {object|null}
 */
export function matchFrontendQuery(transcript) {
  const normalized = transcript.toLowerCase().trim();
  return frontendVoiceQueries.find(q =>
    q.phrases.some(phrase => normalized.includes(phrase))
  ) || null;
}
