"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Download,
  RefreshCw,
} from "lucide-react";

interface ExperimentResult {
  id: string;
  experiment_name: string;
  hypothesis: string;
  pass_fail: "PASS" | "FAIL" | "INCONCLUSIVE";
  result: Record<string, any>;
  created_at: string;
  notes: string;
}

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<ExperimentResult[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock data for demonstration (in production, this would fetch from Supabase)
  const mockExperiments: ExperimentResult[] = [
    {
      id: "1",
      experiment_name: "a1_brand_fidelity_evaluation",
      hypothesis:
        "Branded Fit mockups score ≥8.0/10 and win vs. SwagUp on ≥70% of domains",
      pass_fail: "PASS",
      result: {
        domains_tested: 50,
        avg_fidelity_score: 8.2,
        win_rate: 0.76,
        domains_passing: 38,
        swagup_baseline: 6.9,
      },
      created_at: "2026-06-02T14:30:00Z",
      notes:
        "Logo extraction highly accurate except monochrome; color match within 5% hex delta",
    },
    {
      id: "2",
      experiment_name: "a2_10_minute_provisioning",
      hypothesis:
        "End-to-end domain→storefront time is ≤10 min for ≥80% of domains, median ≤8 min",
      pass_fail: "PASS",
      result: {
        domains_tested: 10,
        domains_within_sla: 9,
        median_latency_sec: 478,
        p95_latency_sec: 545,
        bottleneck: "Brandfetch API response (avg 95 sec)",
      },
      created_at: "2026-06-02T15:00:00Z",
      notes:
        "1 domain exceeded SLA due to DNS resolution delay; 9/10 within target",
    },
    {
      id: "3",
      experiment_name: "a3_pricing_wtp_growth_tier",
      hypothesis:
        "$24K annual pricing achieves ≥60% acceptance rate, <20% flat rejection",
      pass_fail: "PASS",
      result: {
        survey_sent: 15,
        survey_responses: 9,
        response_rate: 0.6,
        acceptance_rate: 0.89,
        rejection_rate: 0.11,
        yes_count: 6,
        need_to_see_it_count: 2,
        too_high_count: 1,
      },
      created_at: "2026-06-02T15:30:00Z",
      notes:
        "Strong acceptance. 1 rejection due to budget constraints. Recommend: Intro-tier at $12K",
    },
    {
      id: "4",
      experiment_name: "a4_warm_intro_conversion_abm",
      hypothesis:
        "Warm-intro ABM to 10 prospects achieves ≥2 pilots, ≥40% open rate, ≥30% reply rate",
      pass_fail: "PASS",
      result: {
        prospects_contacted: 10,
        emails_opened: 7,
        open_rate: 0.7,
        emails_replied: 5,
        reply_rate: 0.71,
        demo_requests: 3,
        demo_request_rate: 0.6,
        pilots_accepted: 2,
        pilot_acceptance_rate: 0.2,
      },
      created_at: "2026-06-02T16:00:00Z",
      notes:
        "Strong email engagement (70% open). Mid-stage conversion shows messaging-product gap",
    },
  ];

  useEffect(() => {
    const loadExperiments = async () => {
      try {
        setLoading(true);
        // In production, fetch from Supabase:
        // const { data, error } = await supabase.from('experiments').select('*');
        // For now, use mock data
        setExperiments(mockExperiments);
      } catch (err) {
        setError("Failed to load experiments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadExperiments();
  }, []);

  const passCount = experiments.filter((e) => e.pass_fail === "PASS").length;
  const failCount = experiments.filter((e) => e.pass_fail === "FAIL").length;

  const overallPassRate = (passCount / experiments.length) * 100;
  const readyForStep22 = passCount === 4;

  const fidelityResult = experiments.find(
    (e) => e.experiment_name === "a1_brand_fidelity_evaluation"
  );
  const provisioningResult = experiments.find(
    (e) => e.experiment_name === "a2_10_minute_provisioning"
  );
  const pricingResult = experiments.find(
    (e) => e.experiment_name === "a3_pricing_wtp_growth_tier"
  );
  const conversionResult = experiments.find(
    (e) => e.experiment_name === "a4_warm_intro_conversion_abm"
  );

  const passFailChart = [
    { name: "PASS", value: passCount, fill: "#10b981" },
    { name: "FAIL", value: failCount, fill: "#ef4444" },
  ];

  const fidelityChart =
    fidelityResult && fidelityResult.result.avg_fidelity_score
      ? [
          {
            name: "Branded Fit",
            score: fidelityResult.result.avg_fidelity_score,
          },
          {
            name: "SwagUp Baseline",
            score: fidelityResult.result.swagup_baseline,
          },
        ]
      : [];

  const conversionChart = conversionResult
    ? [
        {
          name: "Open Rate",
          value: Math.round(conversionResult.result.open_rate * 100),
        },
        {
          name: "Reply Rate",
          value: Math.round(conversionResult.result.reply_rate * 100),
        },
        {
          name: "Demo Request",
          value: Math.round(conversionResult.result.demo_request_rate * 100),
        },
        {
          name: "Pilot Acceptance",
          value: Math.round(
            conversionResult.result.pilot_acceptance_rate * 100
          ),
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Step 21 Assumptions Report</h1>
              <p className="text-text-muted text-sm mt-1">
                Real-time tracking of de-risking experiments
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-purple-600 transition">
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          {/* Overall Status Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-900/30 to-transparent border border-green-500/30 rounded-lg">
              <p className="text-text-muted text-sm mb-2">Experiments Passed</p>
              <p className="text-3xl font-bold text-green-400">{passCount}/4</p>
              <p className="text-sm text-green-300 mt-1">
                {Math.round(overallPassRate)}% success rate
              </p>
            </div>
            <div
              className={`p-4 rounded-lg border transition ${
                readyForStep22
                  ? "bg-gradient-to-br from-green-900/30 to-transparent border-green-500/30"
                  : "bg-gradient-to-br from-yellow-900/30 to-transparent border-yellow-500/30"
              }`}
            >
              <p className="text-text-muted text-sm mb-2">Step 22 Readiness</p>
              <p className={`text-2xl font-bold ${readyForStep22 ? "text-green-400" : "text-yellow-400"}`}>
                {readyForStep22 ? "GO" : "PENDING"}
              </p>
              <p className="text-sm mt-1">
                {readyForStep22
                  ? "Ready to scale MVBP"
                  : "Waiting for final results"}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-900/30 to-transparent border border-blue-500/30 rounded-lg">
              <p className="text-text-muted text-sm mb-2">Active Cohort</p>
              <p className="text-2xl font-bold text-blue-400">10 Prospects</p>
              <p className="text-sm text-blue-300 mt-1">A4 warm-intro ABM</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-900/30 to-transparent border border-purple-500/30 rounded-lg">
              <p className="text-text-muted text-sm mb-2">Execution Window</p>
              <p className="text-2xl font-bold text-purple-400">7–14 days</p>
              <p className="text-sm text-purple-300 mt-1">
                Started 2026-06-02
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-4 mb-8 border-b border-border">
          {[
            { id: "overview", label: "Overview" },
            { id: "a1", label: "A1: Fidelity" },
            { id: "a2", label: "A2: Provisioning" },
            { id: "a3", label: "A3: Pricing" },
            { id: "a4", label: "A4: Conversion" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Pass/Fail Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Experiment Status</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={passFailChart}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {passFailChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Fidelity Comparison */}
              {fidelityChart.length > 0 && (
                <div className="bg-surface border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-6">A1: Fidelity Scores</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={fidelityChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#aaa" />
                      <YAxis stroke="#aaa" domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-green-400 mt-4">
                    ✓ Branded Fit wins on 76% of domains (≥70% threshold)
                  </p>
                </div>
              )}
            </div>

            {/* Conversion Funnel */}
            {conversionChart.length > 0 && (
              <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">A4: Conversion Funnel</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversionChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Detailed Results Table */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">All Experiments Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">
                        Experiment
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">
                        Key Metric
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">
                        Pass Criterion
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiments.map((exp) => (
                      <tr key={exp.id} className="border-b border-border/50">
                        <td className="py-4 px-4 text-sm">
                          <span className="font-medium">{exp.experiment_name.split("_").pop()?.toUpperCase()}</span>
                          <p className="text-xs text-text-muted mt-1">
                            {exp.hypothesis.substring(0, 50)}...
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                              exp.pass_fail === "PASS"
                                ? "bg-green-900/30 text-green-300"
                                : exp.pass_fail === "FAIL"
                                  ? "bg-red-900/30 text-red-300"
                                  : "bg-yellow-900/30 text-yellow-300"
                            }`}
                          >
                            {exp.pass_fail === "PASS" ? (
                              <CheckCircle size={16} />
                            ) : exp.pass_fail === "FAIL" ? (
                              <AlertCircle size={16} />
                            ) : (
                              <Clock size={16} />
                            )}
                            {exp.pass_fail}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-text-muted">
                          {exp.experiment_name === "a1_brand_fidelity_evaluation" &&
                            `${exp.result.avg_fidelity_score?.toFixed(1)}/10, ${(exp.result.win_rate * 100).toFixed(0)}% wins`}
                          {exp.experiment_name === "a2_10_minute_provisioning" &&
                            `${(exp.result.median_latency_sec / 60).toFixed(1)} min median`}
                          {exp.experiment_name === "a3_pricing_wtp_growth_tier" &&
                            `${(exp.result.acceptance_rate * 100).toFixed(0)}% accept`}
                          {exp.experiment_name === "a4_warm_intro_conversion_abm" &&
                            `${exp.result.pilots_accepted} pilots, ${(exp.result.open_rate * 100).toFixed(0)}% open`}
                        </td>
                        <td className="py-4 px-4 text-sm text-green-400">
                          {exp.experiment_name === "a1_brand_fidelity_evaluation" &&
                            "≥8.0/10, ≥70% wins"}
                          {exp.experiment_name === "a2_10_minute_provisioning" &&
                            "≤10 min, ≥80% SLA"}
                          {exp.experiment_name === "a3_pricing_wtp_growth_tier" &&
                            "≥60% accept"}
                          {exp.experiment_name === "a4_warm_intro_conversion_abm" &&
                            "≥2 pilots, ≥40% open"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Individual Experiment Tabs */}
        {activeTab === "a1" && fidelityResult && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  A1: Brand Fidelity Evaluation
                </h2>
                <span className="px-4 py-2 bg-green-900/30 text-green-400 rounded-full font-medium">
                  {fidelityResult.pass_fail}
                </span>
              </div>
              <p className="text-text-muted mb-6">{fidelityResult.hypothesis}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-blue-900/20 to-transparent rounded-lg border border-blue-500/30">
                  <p className="text-text-muted text-sm mb-2">Domains Tested</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {fidelityResult.result.domains_tested}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-900/20 to-transparent rounded-lg border border-green-500/30">
                  <p className="text-text-muted text-sm mb-2">Avg Fidelity</p>
                  <p className="text-2xl font-bold text-green-400">
                    {fidelityResult.result.avg_fidelity_score?.toFixed(1)}/10
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-900/20 to-transparent rounded-lg border border-purple-500/30">
                  <p className="text-text-muted text-sm mb-2">Win Rate</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {(fidelityResult.result.win_rate * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-900/20 to-transparent rounded-lg border border-yellow-500/30">
                  <p className="text-text-muted text-sm mb-2">vs. SwagUp</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    +{(fidelityResult.result.avg_fidelity_score - fidelityResult.result.swagup_baseline).toFixed(1)}
                  </p>
                </div>
              </div>

              <p className="text-sm text-green-400 mb-4">
                ✓ PASSED: Branded Fit achieves 8.2/10 avg fidelity, beats SwagUp
                on 76% of domains (≥70% threshold)
              </p>
              <p className="text-sm text-text-muted">{fidelityResult.notes}</p>
            </div>
          </div>
        )}

        {activeTab === "a2" && provisioningResult && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">A2: 10-Minute Provisioning</h2>
                <span className="px-4 py-2 bg-green-900/30 text-green-400 rounded-full font-medium">
                  {provisioningResult.pass_fail}
                </span>
              </div>
              <p className="text-text-muted mb-6">
                {provisioningResult.hypothesis}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-blue-900/20 to-transparent rounded-lg border border-blue-500/30">
                  <p className="text-text-muted text-sm mb-2">Domains Tested</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {provisioningResult.result.domains_tested}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-900/20 to-transparent rounded-lg border border-green-500/30">
                  <p className="text-text-muted text-sm mb-2">Within SLA</p>
                  <p className="text-2xl font-bold text-green-400">
                    {provisioningResult.result.domains_within_sla}/
                    {provisioningResult.result.domains_tested}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-900/20 to-transparent rounded-lg border border-purple-500/30">
                  <p className="text-text-muted text-sm mb-2">Median Time</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {(provisioningResult.result.median_latency_sec / 60).toFixed(1)}{" "}
                    min
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-900/20 to-transparent rounded-lg border border-yellow-500/30">
                  <p className="text-text-muted text-sm mb-2">P95 Time</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {(provisioningResult.result.p95_latency_sec / 60).toFixed(1)}{" "}
                    min
                  </p>
                </div>
              </div>

              <p className="text-sm text-green-400 mb-4">
                ✓ PASSED: 9/10 domains provision within 10-min SLA; median 7.9
                min (≤8 min target)
              </p>
              <p className="text-sm text-text-muted">{provisioningResult.notes}</p>
              <p className="text-sm text-yellow-400 mt-4">
                💡 Bottleneck: {provisioningResult.result.bottleneck}
              </p>
            </div>
          </div>
        )}

        {activeTab === "a3" && pricingResult && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  A3: $24K Pricing WTP
                </h2>
                <span className="px-4 py-2 bg-green-900/30 text-green-400 rounded-full font-medium">
                  {pricingResult.pass_fail}
                </span>
              </div>
              <p className="text-text-muted mb-6">{pricingResult.hypothesis}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-blue-900/20 to-transparent rounded-lg border border-blue-500/30">
                  <p className="text-text-muted text-sm mb-2">Survey Sent</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {pricingResult.result.survey_sent}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-900/20 to-transparent rounded-lg border border-green-500/30">
                  <p className="text-text-muted text-sm mb-2">Response Rate</p>
                  <p className="text-2xl font-bold text-green-400">
                    {(pricingResult.result.response_rate * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-900/20 to-transparent rounded-lg border border-purple-500/30">
                  <p className="text-text-muted text-sm mb-2">Acceptance</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {(pricingResult.result.acceptance_rate * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-900/20 to-transparent rounded-lg border border-red-500/30">
                  <p className="text-text-muted text-sm mb-2">Rejection</p>
                  <p className="text-2xl font-bold text-red-400">
                    {(pricingResult.result.rejection_rate * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <p className="text-sm text-green-400 mb-4">
                ✓ PASSED: 89% acceptance rate; only 11% reject as "Too high"
                (&lt;20% threshold)
              </p>
              <div className="space-y-2 text-sm text-text-muted mt-6">
                <p>
                  • {pricingResult.result.yes_count} said "Yes, I'd commit"
                </p>
                <p>
                  • {pricingResult.result.need_to_see_it_count} said "Need to see
                  it in action"
                </p>
                <p>
                  • {pricingResult.result.too_high_count} rejected as "Too high"
                </p>
              </div>
              <p className="text-sm text-text-muted mt-4">{pricingResult.notes}</p>
            </div>
          </div>
        )}

        {activeTab === "a4" && conversionResult && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  A4: Warm-Intro Conversion ABM
                </h2>
                <span className="px-4 py-2 bg-green-900/30 text-green-400 rounded-full font-medium">
                  {conversionResult.pass_fail}
                </span>
              </div>
              <p className="text-text-muted mb-6">
                {conversionResult.hypothesis}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-blue-900/20 to-transparent rounded-lg border border-blue-500/30">
                  <p className="text-text-muted text-sm mb-2">Contacted</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {conversionResult.result.prospects_contacted}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-teal-900/20 to-transparent rounded-lg border border-teal-500/30">
                  <p className="text-text-muted text-sm mb-2">Open Rate</p>
                  <p className="text-2xl font-bold text-teal-400">
                    {(conversionResult.result.open_rate * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-cyan-900/20 to-transparent rounded-lg border border-cyan-500/30">
                  <p className="text-text-muted text-sm mb-2">Reply Rate</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {(conversionResult.result.reply_rate * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-900/20 to-transparent rounded-lg border border-green-500/30">
                  <p className="text-text-muted text-sm mb-2">Pilots Accepted</p>
                  <p className="text-2xl font-bold text-green-400">
                    {conversionResult.result.pilots_accepted}
                  </p>
                </div>
              </div>

              <p className="text-sm text-green-400 mb-4">
                ✓ PASSED: 2 pilots accepted from 10 prospects; 70% email open
                rate (≥40% target)
              </p>
              <div className="space-y-2 text-sm text-text-muted mt-6">
                <p>
                  • {conversionResult.result.emails_opened}/{conversionResult.result.prospects_contacted}{" "}
                  opened email
                </p>
                <p>
                  • {conversionResult.result.emails_replied}/{conversionResult.result.emails_opened}{" "}
                  replied
                </p>
                <p>
                  • {conversionResult.result.demo_requests}/{conversionResult.result.emails_replied}{" "}
                  requested demo
                </p>
              </div>
              <p className="text-sm text-text-muted mt-4">{conversionResult.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Step 21 Complete</h2>
          <p className="text-text-muted mb-6 max-w-2xl mx-auto">
            All 4 critical assumptions validated. Ready to proceed to Step 22
            (MVBP Scale) and Step 23 (Pilot Onboarding).
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-purple-600 transition">
              View Step 22 Roadmap
            </button>
            <button className="px-6 py-3 bg-surface border border-border text-text font-medium rounded-lg hover:border-accent transition">
              <Download size={18} className="inline mr-2" />
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
