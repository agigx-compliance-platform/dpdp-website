import assert from 'node:assert/strict'
import { createEvidence, pageEvidence, snippetEvidence } from '../evidence'
import { computeScores } from '../scoring'
import { generateReport } from '../report'
import { generateCitizenActions } from '../citizen-actions'
import { detectNotice } from '../detectors/notice'
import { detectConsent } from '../detectors/consent'
import { detectSecurity } from '../detectors/security'
import { detectAITransparency } from '../detectors/ai-transparency'
import { detectChildrensPrivacy } from '../detectors/childrens-privacy'
import type { ScanContext, Finding } from '../types'

async function runTests() {
  console.log('🧪 Starting Privacy Pitstop Unit Tests...\n')

  // ── 1. Evidence Builder Tests ──────────────────────────────
  {
    console.log('Testing Evidence Builder...')
    const ev = pageEvidence('https://example.com/privacy', 'scan-123')
    assert.equal(ev.type, 'page_url')
    assert.equal(ev.url, 'https://example.com/privacy')
    assert.equal(ev.scanId, 'scan-123')
    assert.ok(ev.timestamp)

    const snipEv = snippetEvidence('https://example.com', '<div>test</div>', 'scan-123')
    assert.equal(snipEv.type, 'html_snippet')
    assert.equal(snipEv.snippet, '<div>test</div>')
    console.log('✓ Evidence Builder passed\n')
  }

  // ── 2. Mock Scan Context ──────────────────────────────────
  const mockContext: ScanContext = {
    scanId: 'test-scan-001',
    domain: 'example.com',
    siteDomain: 'example.com',
    startedAt: new Date().toISOString(),
    pages: [
      {
        url: 'https://example.com',
        status: 200,
        html: '<html><body><h1>Welcome</h1><a href="/privacy-policy">Privacy Policy</a></body></html>',
        headers: { 'strict-transport-security': 'max-age=31536000' },
        pageClass: 'landing',
      },
      {
        url: 'https://example.com/privacy-policy',
        status: 200,
        html: `<html><body>
          <h1>Privacy Policy</h1>
          <p>Effective date: January 1, 2026</p>
          <p>Data we collect: Name, Email, Address, Financial data.</p>
          <p>We use artificial intelligence and machine learning to process data and perform automated decision-making.</p>
          <p>Parental consent is required for children under 18. Section 9 compliance.</p>
          <p>Contact our Data Protection Officer / Grievance Officer at dpo@example.com.</p>
          <p>Your rights: Right of access, right to deletion, right to correction, right to withdraw consent.</p>
        </body></html>`,
        headers: {},
        pageClass: 'privacy',
      },
      {
        url: 'https://example.com/.well-known/security.txt',
        status: 200,
        html: 'Contact: security@example.com\nExpires: 2027-01-01',
        headers: {},
        pageClass: 'security_txt',
      },
    ],
    successfulPages: [],
  }

  // ── 3. Notice Detector Tests ──────────────────────────────
  {
    console.log('Testing Notice Detector...')
    const findings = detectNotice(mockContext)
    assert.ok(Array.isArray(findings))
    // Should find policy link and policy page, no critical missing page error
    const noPolicyFinding = findings.find(f => f.module === 'policy_page')
    assert.equal(noPolicyFinding, undefined, 'Should find accessible privacy policy page')
    console.log('✓ Notice Detector passed\n')
  }

  // ── 4. Consent Detector Tests ──────────────────────────────
  {
    console.log('Testing Consent Detector...')
    const findings = detectConsent(mockContext)
    assert.ok(Array.isArray(findings))
    const cmpFinding = findings.find(f => f.module === 'cmp_presence')
    assert.ok(cmpFinding, 'Should detect missing CMP')
    console.log('✓ Consent Detector passed\n')
  }

  // ── 5. Security Detector Tests ────────────────────────────
  {
    console.log('Testing Security Detector...')
    const findings = detectSecurity(mockContext)
    assert.ok(Array.isArray(findings))
    const noSecTxt = findings.find(f => f.module === 'no_security_txt')
    assert.equal(noSecTxt, undefined, 'Should detect valid security.txt')
    console.log('✓ Security Detector passed\n')
  }

  // ── 6. AI Transparency Detector Tests ────────────────────
  {
    console.log('Testing AI Transparency Detector...')
    const findings = detectAITransparency(mockContext)
    assert.ok(Array.isArray(findings))
    const noAIDisclosure = findings.find(f => f.module === 'no_ai_disclosure')
    assert.equal(noAIDisclosure, undefined, 'Should detect AI disclosures')
    console.log('✓ AI Transparency Detector passed\n')
  }

  // ── 7. Children\'s Privacy Detector Tests ──────────────────
  {
    console.log('Testing Children\'s Privacy Detector...')
    const findings = detectChildrensPrivacy(mockContext)
    assert.ok(Array.isArray(findings))
    const noChildrenPolicy = findings.find(f => f.module === 'no_children_policy')
    assert.equal(noChildrenPolicy, undefined, 'Should detect children\'s privacy section')
    console.log('✓ Children\'s Privacy Detector passed\n')
  }

  // ── 8. Scoring Engine Tests ────────────────────────────────
  {
    console.log('Testing Scoring Engine...')
    const mockFindings: Finding[] = [
      {
        id: 'f1',
        pillarId: 'P1',
        module: 'policy_link',
        categoryId: 'notice',
        title: 'Missing link',
        description: 'Test',
        severity: 'high',
        confidence: 'high',
        evidence: 'detected',
        evidenceItems: [pageEvidence('https://example.com')],
      },
      {
        id: 'f2',
        pillarId: 'P2',
        module: 'cmp_presence',
        categoryId: 'consent',
        title: 'No CMP',
        description: 'Test',
        severity: 'critical',
        confidence: 'high',
        evidence: 'detected',
        evidenceItems: [pageEvidence('https://example.com')],
      },
    ]

    const scoring = computeScores(mockFindings, 2, 7)
    assert.equal(scoring.categories.length, 7, 'Should produce 7 categories')
    assert.ok(scoring.overallScore >= 0 && scoring.overallScore <= 100)
    assert.equal(scoring.maxSeverity, 'critical')
    console.log('✓ Scoring Engine passed\n')
  }

  // ── 9. Report Generator Tests ──────────────────────────────
  {
    console.log('Testing Report Generator...')
    const mockFindings: Finding[] = [
      {
        id: 'f1',
        pillarId: 'P1',
        module: 'policy_link',
        categoryId: 'notice',
        title: 'Missing link',
        description: 'Test',
        severity: 'high',
        confidence: 'high',
        evidence: 'detected',
        evidenceItems: [pageEvidence('https://example.com')],
        recommendation: 'Add link',
      },
    ]
    const scoring = computeScores(mockFindings, 2, 7)
    const report = generateReport('scan-1', 'example.com', new Date().toISOString(), scoring, mockFindings, 2)
    assert.equal(report.scanId, 'scan-1')
    assert.equal(report.domain, 'example.com')
    assert.ok(report.executiveSummary.includes('example.com'))
    assert.equal(report.recommendations.length, 1)
    assert.equal(report.recommendations[0], 'Add link')
    console.log('✓ Report Generator passed\n')
  }

  // ── 10. Citizen Actions Generator Tests ───────────────────
  {
    console.log('Testing Citizen Actions Generator...')
    const mockFindings: Finding[] = [
      {
        id: 'f1',
        pillarId: 'P2',
        module: 'cmp_presence',
        categoryId: 'consent',
        title: 'No consent management platform detected',
        description: 'No CMP found.',
        severity: 'critical',
        confidence: 'high',
        evidence: 'detected',
        evidenceItems: [pageEvidence('https://example.com')],
      },
    ]
    const actions = generateCitizenActions(mockFindings, 'example.com')
    assert.ok(actions.questions.length > 0)
    assert.ok(actions.grievanceDraft !== null)
    assert.ok(actions.grievanceDraft?.subject.includes('example.com'))
    assert.ok(actions.followUpTemplate.includes('example.com'))
    assert.ok(actions.complaintPackSummary.includes('example.com'))
    console.log('✓ Citizen Actions Generator passed\n')
  }

  console.log('🎉 ALL PRIVACY PITSTOP UNIT TESTS PASSED!')
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err)
  process.exit(1)
})
